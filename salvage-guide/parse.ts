import isEqual from "lodash.isequal";
import fetch from "node-fetch";
import ora from "ora";
import path from "path";
import { ClientCredentials } from "simple-oauth2";
import { URL } from "url";

import { RAW_SALVAGE_GUIDE } from "./output/raw-salvage-guide";
import * as salvageGuide from "./output/salvage-guide";
import {
  BuildCharacter,
  BuildFollowers,
  BuildItemTag,
  BuildsById,
  BuildsByItem,
  FOLLOWER_GUIDE_ID,
  ItemsByBuild,
  ItemsById,
  ItemSlot,
  RawBuildData,
  TagsById,
} from "./output/types";
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

function getFollowerCharacters(rawTags: string) {
  const characters: BuildCharacter[] = [];

  BuildFollowers.forEach((follower) => {
    if (rawTags.indexOf(follower) > -1) {
      characters.push(follower);
    }
  });

  return characters.length ? characters : [...BuildFollowers];
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

async function getItemData(path: string, accessToken: string, tries = 3) {
  const itemUrl = new URL(`${BASE_D3_DATA_URL}${path}`);
  itemUrl.searchParams.append("locale", "en_US");
  itemUrl.searchParams.append("access_token", accessToken);

  const response = await fetch(itemUrl, {
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const nextTries = tries - 1;
    if (!nextTries) {
      throw new Error(`${path}: ${response.status} (${response.statusText})`);
    }
    return await getItemData(path, accessToken, nextTries);
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

  const addBuildItemToData = (
    itemId: string,
    build: RawBuildData,
    buildId: string,
    character: BuildCharacter,
    label: string
  ) => {
    if (!buildsById[buildId]) {
      buildsById[buildId] = {
        id: buildId,
        character,
        label,
        link: build.link,
      };
    }

    const buildItemKey = `${itemId}-${buildId}`;
    tagsById[buildItemKey] = getTags(build.tags);

    if (!itemsByBuild[buildId]) {
      itemsByBuild[buildId] = {};
    }
    itemsByBuild[buildId][itemId] = buildItemKey;
    buildsByItem[itemId][buildId] = buildItemKey;
  };

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
      if (build.id === FOLLOWER_GUIDE_ID) {
        const followers = getFollowerCharacters(build.tags);
        followers.forEach((follower) => {
          addBuildItemToData(
            itemId,
            build,
            `${build.id}-${follower}`,
            follower,
            `${build.label} - ${follower}`
          );
        });
      } else {
        addBuildItemToData(
          itemId,
          build,
          build.id,
          getCharacter(build.label, build.link),
          build.label
        );
      }
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
  BuildCharacter,
  BuildItemTag,
  BuildsById,
  BuildsByItem,
  ItemsByBuild,
  ItemsById,
  ItemSlot,
  TagsById,
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
    if (
      isEqual(parsed.itemsById, salvageGuide.itemsById) &&
      isEqual(parsed.buildsById, salvageGuide.buildsById) &&
      isEqual(parsed.tagsById, salvageGuide.tagsById) &&
      isEqual(parsed.itemsByBuild, salvageGuide.itemsByBuild) &&
      isEqual(parsed.buildsByItem, salvageGuide.buildsByItem)
    ) {
      console.log("No updates");
      return;
    }
    const target = await saveFile(parsed);
    console.log(`Saved salvage guide to ${target}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

parse();
