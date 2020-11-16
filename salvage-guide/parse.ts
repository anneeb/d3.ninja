import fetch from "node-fetch";
import { URL } from "url";
import { ClientCredentials } from "simple-oauth2";
import * as ora from "ora";
import * as path from "path";

import {
  ItemSlot,
  ItemsById,
  BuildCharacter,
  BuildsById,
  BuildItemTag,
  TagsById,
  ItemsByBuild,
  BuildsByItem,
} from "./output/types";
import { RAW_SALVAGE_GUIDE } from "./output/raw-salvage-guide";
import { saveFileToDirectory } from "./utils/fileSystem";

const SAVE_DIR = path.resolve(__dirname, "output");
const BASE_D3_DATA_URL = "https://us.api.blizzard.com/d3/data/";

function getTags(rawTags: string) {
  const tags: BuildItemTag[] = [];

  Object.values(BuildItemTag).forEach((tag) => {
    if (rawTags.indexOf(tag) > -1) {
      if (tag === BuildItemTag.VARIATION) {
        const numVariations = Number(rawTags.match(/[0-9]+/g)[0]);
        const variations = new Array(numVariations).fill(
          BuildItemTag.VARIATION
        );
        tags.push(...variations);
      } else {
        tags.push(tag);
      }
    }
  });

  return tags;
}

function getCharacter(label: string, link: string) {
  for (let character of Object.values(BuildCharacter)) {
    if (label.indexOf(character) > -1) {
      return character;
    }
  }

  if (link.includes("crusader")) {
    return BuildCharacter.CRUSADER;
  } else if (link.includes("wd")) {
    return BuildCharacter.WITCH_DOCTOR;
  }
}

interface ParsedData {
  itemsById: ItemsById;
  buildsById: BuildsById;
  tagsById: TagsById;
  itemsByBuild: ItemsByBuild;
  buildsByItem: BuildsByItem;
}

async function getBlizzardAccessToken() {
  const client = new ClientCredentials({
    client: {
      id: process.env.BLIZZARD_CLIENT_ID,
      secret: process.env.BLIZZARD_CLIENT_SECRET,
    },
    auth: {
      tokenHost: "https://us.battle.net",
    },
  });

  const token = await client.getToken({});
  return token.token.access_token as string;
}

async function getItemData(path: string, accessToken: string) {
  const itemUrl = new URL(`${BASE_D3_DATA_URL}${path}`);
  itemUrl.searchParams.append("locale", "en_US");
  itemUrl.searchParams.append("access_token", accessToken);

  const response = await fetch(itemUrl, {
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    return await getItemData(path, accessToken);
  } else {
    return response.json();
  }
}

async function getParsed(): Promise<ParsedData> {
  const itemsById: ItemsById = {};
  const buildsById: BuildsById = {};
  const buildsByItem: BuildsByItem = {};
  const itemsByBuild: ItemsByBuild = {};
  const tagsById: TagsById = {};

  const spinner = ora("Authenticating Blizzard client");
  spinner.spinner = "simpleDotsScrolling";
  spinner.start();

  const blizzardAccessToken = await getBlizzardAccessToken();

  const failures = [];

  spinner.text = "Loading items";
  const results = await Promise.all(
    RAW_SALVAGE_GUIDE.map(async (item) => {
      try {
        let itemPath = item.link.replace("https://us.diablo3.com/en/", "");
        let itemData = await getItemData(itemPath, blizzardAccessToken);

        if (itemData.itemProduced) {
          itemPath = itemData.itemProduced.path;
          itemData = await getItemData(itemPath, blizzardAccessToken);
        }

        return {
          itemId: itemPath.slice(5),
          itemData,
        };
      } catch (err) {
        failures.push(err);
      }
    })
  );

  if (failures.length) {
    spinner.fail(`Problem loading ${failures.length} items: ${failures}`);
    throw new Error(JSON.stringify(failures, null, 2));
  }

  spinner.succeed(`Loaded ${results.length} items`);

  RAW_SALVAGE_GUIDE.forEach((item, idx) => {
    const { itemId, itemData } = results[idx];
    itemsById[itemId] = {
      id: itemId,
      label: item.label,
      link: item.link,
      img: `https://blzmedia-a.akamaihd.net/d3/icons/items/small/${itemData.icon}.png`,
      isSet: itemData.color === "green",
      slots: itemData.slots.filter((slot: ItemSlot) =>
        new Set(Object.values(ItemSlot)).has(slot)
      ),
      isTwoHanded: itemData.type.twoHanded,
    };

    buildsByItem[itemId] = {};

    item.buildsData.forEach((build) => {
      buildsById[build.id] = {
        id: build.id,
        character: getCharacter(build.label, build.link),
        label: build.label,
        link: build.link,
      };

      const buildItemLinks = `${itemId}-${build.id}`;
      tagsById[buildItemLinks] = getTags(build.tags);

      if (!itemsByBuild[build.id]) {
        itemsByBuild[build.id] = {};
      }
      itemsByBuild[build.id][itemId] = buildItemLinks;
      buildsByItem[itemId][build.id] = buildItemLinks;
    });
  });

  return {
    itemsById,
    buildsById,
    tagsById,
    itemsByBuild,
    buildsByItem,
  };
}

function enumToRegex(string: string) {
  return new RegExp(`"${string}"`, "g");
}

function replaceEnums(
  input: string,
  enumerator: { [key: string]: string },
  enumStr: string
) {
  return Object.entries(enumerator).reduce((acc, [key, value]) => {
    return acc.replace(enumToRegex(value), `${enumStr}.${key}`);
  }, input);
}

async function saveFile(results: ParsedData) {
  const itemsById = replaceEnums(
    JSON.stringify(results.itemsById, null, 2),
    ItemSlot,
    "ItemSlot"
  );
  const buildsById = replaceEnums(
    JSON.stringify(results.buildsById, null, 2),
    BuildCharacter,
    "BuildCharacter"
  );
  const tagsById = replaceEnums(
    JSON.stringify(results.tagsById, null, 2),
    BuildItemTag,
    "BuildItemTag"
  );
  const itemsByBuild = JSON.stringify(results.itemsByBuild, null, 2);
  const buildsByItem = JSON.stringify(results.buildsByItem, null, 2);
  const data = `// Last updated on ${new Date().toLocaleString()}

import {
  ItemSlot,
  ItemsById,
  BuildCharacter,
  BuildsById,
  BuildItemTag,
  TagsById,
  ItemsByBuild,
  BuildsByItem,
} from "./types";

export const itemsById: ItemsById = \n${itemsById};

export const buildsById: BuildsById = \n${buildsById};

export const tagsById: TagsById = \n${tagsById};

export const itemsByBuild: ItemsByBuild = \n${itemsByBuild};

export const buildsByItem: BuildsByItem = \n${buildsByItem};
`;

  return saveFileToDirectory(SAVE_DIR, "salvage-guide.ts", data);
}

async function parse() {
  try {
    console.log("Parsing salvage guide...");
    const parsed = await getParsed();

    const target = await saveFile(parsed);
    console.log(`Saved salvage guide to ${target}`);
  } catch (err) {
    console.log(err);
    process.exit(-1);
  }
}

parse();
