import fetch from "node-fetch";
import { URL } from "url";
import * as path from "path";

import {
  ItemColor,
  ItemSlot,
  ItemsById,
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
  if (rawTags.indexOf(BuildItemTag.ALT) > -1) {
    tags.push(BuildItemTag.ALT);
  }

  if (rawTags.indexOf(BuildItemTag.CUBE) > -1) {
    tags.push(BuildItemTag.CUBE);
  }

  if (rawTags.indexOf(BuildItemTag.BIS) > -1) {
    tags.push(BuildItemTag.BIS);
  }

  if (rawTags.indexOf(BuildItemTag.OUTDATED) > -1) {
    tags.push(BuildItemTag.OUTDATED);
  }

  if (rawTags.indexOf(BuildItemTag.VARIATION) > -1) {
    const numVariations = Number(rawTags.match(/[0-9]+/g)[0]);
    const variations = new Array(numVariations).fill(BuildItemTag.VARIATION);
    tags.push(...variations);
  }

  return tags;
}

interface ParsedData {
  itemsById: ItemsById;
  buildsById: BuildsById;
  tagsById: TagsById;
  itemsByBuild: ItemsByBuild;
  buildsByItem: BuildsByItem;
}

async function getItemData(path: string) {
  const itemUrl = new URL(`${BASE_D3_DATA_URL}${path}`);
  itemUrl.searchParams.append("locale", "en_US");
  itemUrl.searchParams.append("access_token", process.env.BLIZZARD_KEY);

  return fetch(itemUrl, {
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.json())
    .catch(() => getItemData(path));
}

async function getParsed(): Promise<ParsedData> {
  const itemsById: ItemsById = {};
  const buildsById: BuildsById = {};
  const buildsByItem: BuildsByItem = {};
  const itemsByBuild: ItemsByBuild = {};
  const tagsById: TagsById = {};

  await Promise.all(
    RAW_SALVAGE_GUIDE.map(async (item) => {
      let itemPath = item.link.replace("https://us.diablo3.com/en/", "");
      let itemData = await getItemData(itemPath);

      if (itemData.itemProduced) {
        itemPath = itemData.itemProduced.path;
        itemData = await getItemData(itemPath);
      }

      const itemId = itemPath.slice(5);

      itemsById[itemId] = {
        id: itemId,
        label: item.label,
        link: item.link,
        img: `http://media.blizzard.com/d3/icons/items/small/${itemData.icon}`,
        color: itemData.color,
        slots: itemData.slots.filter((slot: ItemSlot) =>
          new Set(Object.values(ItemSlot)).has(slot)
        ),
        isTwoHanded: itemData.type.twoHanded,
      };

      buildsByItem[itemId] = {};

      item.buildsData.forEach((build) => {
        buildsById[build.id] = {
          id: build.id,
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
    })
  );

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
    replaceEnums(
      JSON.stringify(results.itemsById, null, 2),
      ItemColor,
      "ItemColor"
    ),
    ItemSlot,
    "ItemSlot"
  );
  const buildsById = JSON.stringify(results.buildsById, null, 2);
  const tagsById = replaceEnums(
    JSON.stringify(results.tagsById, null, 2),
    BuildItemTag,
    "BuildItemTag"
  );
  const itemsByBuild = JSON.stringify(results.itemsByBuild, null, 2);
  const buildsByItem = JSON.stringify(results.buildsByItem, null, 2);
  const data = `// Last updated on ${new Date().toLocaleString()}

import {
  ItemColor,
  ItemSlot,
  ItemsById,
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

export const buildsByItem: BuildsByItem = \n${buildsByItem};`;

  return saveFileToDirectory(SAVE_DIR, "salvage-guide.ts", data);
}

async function parse() {
  console.log("Parsing salvage guide...");
  const parsed = await getParsed();

  const target = await saveFile(parsed);
  console.log(`Saved salvage guide to ${target}`);
}

parse();
