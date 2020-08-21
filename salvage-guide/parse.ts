import * as path from "path";

import {
  ItemType,
  ItemsByLink,
  BuildsByLink,
  BuildItemTag,
  TagsByLinks,
  ItemsByBuild,
  BuildsByItem,
} from "./output/types";
import { RAW_SALVAGE_GUIDE } from "./output/raw-salvage-guide";
import { saveFileToDirectory } from "./utils/saveFileToDirectory";

const SAVE_DIR = path.resolve(__dirname, "output");

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
  itemsByLink: ItemsByLink;
  buildsByLink: BuildsByLink;
  tagsByLinks: TagsByLinks;
  itemsByBuild: ItemsByBuild;
  buildsByItem: BuildsByItem;
}

function getParsed(): ParsedData {
  const itemsByLink: ItemsByLink = {};
  const buildsByLink: BuildsByLink = {};
  const buildsByItem: BuildsByItem = {};
  const itemsByBuild: ItemsByBuild = {};
  const tagsByLinks: TagsByLinks = {};

  RAW_SALVAGE_GUIDE.forEach((item) => {
    const itemLink = item.link;
    itemsByLink[itemLink] = {
      label: item.label,
      link: itemLink,
      type: item.type as ItemType,
      img: item.img,
    };

    buildsByItem[itemLink] = {};

    item.buildsData.forEach((build) => {
      const buildLink = build.link;
      buildsByLink[buildLink] = {
        label: build.label,
        link: itemLink,
      };

      const buildItemLinks = `${itemLink}-${buildLink}`;
      tagsByLinks[buildItemLinks] = getTags(build.tags);

      if (!itemsByBuild[buildLink]) {
        itemsByBuild[buildLink] = {};
      }
      itemsByBuild[buildLink][itemLink] = buildItemLinks;
      buildsByItem[itemLink][buildLink] = buildItemLinks;
    });
  });

  return {
    itemsByLink,
    buildsByLink,
    tagsByLinks,
    itemsByBuild,
    buildsByItem,
  };
}

function enumToRegex(string: string) {
  return new RegExp(`"${string}"`, "g");
}

async function saveFile(results: ParsedData) {
  const itemsByLink = JSON.stringify(results.itemsByLink, null, 2)
    .replace(enumToRegex(ItemType.SET), "ItemType.SET")
    .replace(enumToRegex(ItemType.LEGENDARY), "ItemType.LEGENDARY");
  const buildsByLink = JSON.stringify(results.buildsByLink, null, 2);
  const tagsByLinks = JSON.stringify(results.tagsByLinks, null, 2)
    .replace(enumToRegex(BuildItemTag.ALT), "BuildItemTag.ALT")
    .replace(enumToRegex(BuildItemTag.CUBE), "BuildItemTag.CUBE")
    .replace(enumToRegex(BuildItemTag.BIS), "BuildItemTag.BIS")
    .replace(enumToRegex(BuildItemTag.OUTDATED), "BuildItemTag.OUTDATED")
    .replace(enumToRegex(BuildItemTag.VARIATION), "BuildItemTag.VARIATION");
  const itemsByBuild = JSON.stringify(results.itemsByBuild, null, 2);
  const buildsByItem = JSON.stringify(results.buildsByItem, null, 2);
  const data = `// Last updated on ${new Date().toLocaleString()}

import {
  ItemType,
  ItemsByLink,
  BuildsByLink,
  BuildItemTag,
  TagsByLinks,
  ItemsByBuild,
  BuildsByItem,
} from "./types";

export const itemsByLink: ItemsByLink = \n${itemsByLink};

export const buildsByLink: BuildsByLink = \n${buildsByLink};

export const tagsByLinks: TagsByLinks = \n${tagsByLinks};

export const itemsByBuild: ItemsByBuild = \n${itemsByBuild};

export const buildsByItem: BuildsByItem = \n${buildsByItem};`;

  return saveFileToDirectory(SAVE_DIR, "salvage-guide.ts", data);
}

async function parse() {
  console.log("Parsing salvage guide...");
  const parsed = getParsed();

  const target = await saveFile(parsed);
  console.log(`Saved salvage guide to ${target}`);
}

parse();
