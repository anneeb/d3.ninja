import {
  buildsById,
  itemsByBuild,
  itemsById,
  tagsById,
} from "constants/salvage-guide/salvage-guide";
import {
  Build,
  BuildFollowers,
  BuildItemTag,
  BuildsById,
  CubeItemSlot,
  ItemSlot,
} from "constants/salvage-guide/types";

export const cubeItemSlots = [
  CubeItemSlot.ARMOR,
  CubeItemSlot.WEAPON,
  CubeItemSlot.JEWELRY,
];

export type CubeItems = ReturnType<typeof createCubeItems>;
function createCubeItems() {
  return {
    [CubeItemSlot.ARMOR]: [] as string[],
    [CubeItemSlot.WEAPON]: [] as string[],
    [CubeItemSlot.JEWELRY]: [] as string[],
  };
}

type ItemGearTag = BuildItemTag.ALT | BuildItemTag.BIS | BuildItemTag.VARIATION;
const itemGearTags = new Set([
  BuildItemTag.ALT,
  BuildItemTag.BIS,
  BuildItemTag.VARIATION,
]);

export type GearItems = ReturnType<typeof createGearItems>;
function createGearItems() {
  return {
    [BuildItemTag.ALT]: [] as string[],
    [BuildItemTag.BIS]: [] as string[],
    [BuildItemTag.VARIATION]: [] as string[],
  };
}

type ItemArmorSlot =
  | ItemSlot.HEAD
  | ItemSlot.SHOULDERS
  | ItemSlot.TORSO
  | ItemSlot.BRACERS
  | ItemSlot.HANDS
  | ItemSlot.WAIST
  | ItemSlot.LEGS
  | ItemSlot.FEET;
const itemArmorSlots = new Set([
  ItemSlot.HEAD,
  ItemSlot.SHOULDERS,
  ItemSlot.TORSO,
  ItemSlot.BRACERS,
  ItemSlot.HANDS,
  ItemSlot.WAIST,
  ItemSlot.LEGS,
  ItemSlot.FEET,
]);

type ItemJewelrySlot =
  | ItemSlot.NECK
  | ItemSlot.LEFT_FINGER
  | ItemSlot.RIGHT_FINGER;
const itemJewelrySlots = new Set([
  ItemSlot.NECK,
  ItemSlot.LEFT_FINGER,
  ItemSlot.RIGHT_FINGER,
]);

type ItemWeaponSlot = ItemSlot.LEFT_HAND | ItemSlot.RIGHT_HAND;
const itemWeaponSlots = new Set([ItemSlot.LEFT_HAND, ItemSlot.RIGHT_HAND]);

type CharacterItemSlot = ItemArmorSlot | ItemJewelrySlot | ItemWeaponSlot;
export const characterItemSlots = [
  ...itemArmorSlots,
  ...itemJewelrySlots,
  ...itemWeaponSlots,
];

type CharacterItems = ReturnType<typeof createCharacterItems>;
function createCharacterItems() {
  return {
    [ItemSlot.HEAD]: createGearItems(),
    [ItemSlot.SHOULDERS]: createGearItems(),
    [ItemSlot.TORSO]: createGearItems(),
    [ItemSlot.BRACERS]: createGearItems(),
    [ItemSlot.HANDS]: createGearItems(),
    [ItemSlot.WAIST]: createGearItems(),
    [ItemSlot.LEGS]: createGearItems(),
    [ItemSlot.FEET]: createGearItems(),

    [ItemSlot.NECK]: createGearItems(),
    [ItemSlot.LEFT_FINGER]: createGearItems(),
    [ItemSlot.RIGHT_FINGER]: createGearItems(),

    [ItemSlot.LEFT_HAND]: createGearItems(),
    [ItemSlot.RIGHT_HAND]: createGearItems(),
  };
}

type FollowerItemSlot = ItemSlot.FOLLOWER_SPECIAL;
export const followerItemSlots = [ItemSlot.FOLLOWER_SPECIAL];

type FollowerItems = ReturnType<typeof createFollowerItems>;
function createFollowerItems() {
  return {
    [ItemSlot.FOLLOWER_SPECIAL]: createGearItems(),
  };
}

interface BuildWithItems extends Build {
  isOutdated: boolean;
  characterItems: CharacterItems;
  cubeItems?: CubeItems;
  followerItems?: FollowerItems;
}

interface BuildsWithItems {
  [id: string]: BuildWithItems;
}

interface BuildTags {
  isVariation: boolean;
  subLabel: string;
}

interface BuildsTags {
  [id: string]: BuildTags;
}

interface BuildsByLabel {
  [label: string]: BuildsWithItems;
}

function dedupeItems(items: CharacterItems) {
  const leftHand = items[ItemSlot.LEFT_HAND];
  const rightHand = items[ItemSlot.RIGHT_HAND];
  itemGearTags.forEach((tag: ItemGearTag) => {
    rightHand[tag] = rightHand[tag].filter(
      (item) => !leftHand[tag].includes(item)
    );
  });

  const leftFinger = items[ItemSlot.LEFT_FINGER];
  const rightFinger = items[ItemSlot.RIGHT_FINGER];
  itemGearTags.forEach((tag: ItemGearTag) => {
    if (leftFinger[tag].length > 1) {
      leftFinger[tag] = leftFinger[tag].slice(0, 1);
    }

    rightFinger[tag] = rightFinger[tag].filter(
      (item) => !leftFinger[tag].includes(item)
    );
  });
}

function getBuildWithItems(build: Build): BuildWithItems {
  let isOutdated = false;
  const isFollower = BuildFollowers.includes(build.character);

  const characterItems: CharacterItems = createCharacterItems();
  let cubeItems: CubeItems;
  let followerItems: FollowerItems;

  if (isFollower) {
    followerItems = createFollowerItems();
  } else {
    cubeItems = createCubeItems();
  }

  Object.entries(itemsByBuild[build.id]).forEach(([item, tagId]) => {
    const gearTags: ItemGearTag[] = [];
    let isCube = false;

    tagsById[tagId].forEach((tag) => {
      if (tag === BuildItemTag.OUTDATED) {
        isOutdated = true;
      } else if (tag === BuildItemTag.CUBE) {
        isCube = true;
      } else if (itemGearTags.has(tag)) {
        gearTags.push(tag as ItemGearTag);
      }
    });

    if (isCube) {
      const cubeSlots: Set<CubeItemSlot> = new Set();
      itemsById[item].slots.forEach((slot: CharacterItemSlot) => {
        if (itemArmorSlots.has(slot)) {
          cubeSlots.add(CubeItemSlot.ARMOR);
        }
        if (itemJewelrySlots.has(slot)) {
          cubeSlots.add(CubeItemSlot.JEWELRY);
        }
        if (itemWeaponSlots.has(slot)) {
          cubeSlots.add(CubeItemSlot.WEAPON);
        }
      });

      cubeSlots.forEach((cubeSlot) => {
        cubeItems[cubeSlot].push(item);
      });
    }
    gearTags.forEach((gearTag) => {
      itemsById[item].slots.forEach(
        (slot: CharacterItemSlot | FollowerItemSlot) => {
          if (isFollower && followerItemSlots.includes(slot)) {
            followerItems[slot][gearTag].push(item);
          } else if (characterItemSlots.includes(slot)) {
            characterItems[slot][gearTag].push(item);
          }
        }
      );
    });
  });

  dedupeItems(characterItems);

  return {
    ...build,
    characterItems,
    cubeItems,
    followerItems,
    isOutdated,
  };
}

function getBuildsByLabel(buildsById: BuildsById) {
  return Object.values(buildsById).reduce<BuildsByLabel>(
    (acc, build: Build) => {
      if (!acc[build.label]) {
        acc[build.label] = {};
      }
      acc[build.label][build.id] = getBuildWithItems(build);
      return acc;
    },
    {}
  );
}

function getBaseBuildsAndTags(buildsByLabel: BuildsByLabel) {
  const baseBuilds: BaseBuildsByLabel = {};
  const buildTags: BuildsTags = {};
  Object.entries(buildsByLabel).forEach(([key, buildsById]) => {
    const builds = Object.values(buildsById);

    if (builds.length === 1) {
      const buildId = builds[0].id;
      baseBuilds[key] = buildId;
      buildTags[buildId] = { isVariation: false, subLabel: "" };
      return;
    }

    const splitBuilds = builds.map((build) => build.id.split("-"));
    const longestBuild = splitBuilds
      .slice()
      .sort((a, b) => a.length - b.length)[0];

    const prefix = [];
    longestBuild.forEach((id, idx) => {
      if (splitBuilds.every((build) => build[idx] === id)) {
        prefix.push(id);
      }
    });

    const tags = splitBuilds.map<BuildTags>((build) => {
      const subLabels = build.slice(prefix.length);
      let isVariation = true;
      let subLabel = "";

      if (subLabels.includes("bis")) {
        isVariation = false;
      } else if (subLabels.includes("rgk")) {
        subLabel = "RGK";
      } else {
        subLabel = subLabels
          .filter((label) => label !== "build")
          .join(" ")
          .trim();
      }
      return { isVariation, subLabel };
    });

    tags.forEach((tag, idx) => {
      const buildId = builds[idx].id;
      if (!tag.isVariation) {
        baseBuilds[key] = buildId;
      }
      buildTags[buildId] = tag;
    });
  });

  return {
    baseBuilds,
    buildTags,
  };
}

interface BaseBuildsByLabel {
  [key: string]: string;
}

function addBaseGearItemsToBuild(items: GearItems, baseItems: GearItems) {
  if (!items[BuildItemTag.BIS].length) {
    items[BuildItemTag.BIS].push(...baseItems[BuildItemTag.BIS]);
  }
}

function addBaseItemsToBuild(
  build: BuildWithItems,
  builds: BuildsWithItems,
  baseBuilds: BaseBuildsByLabel
) {
  const baseBuildId = baseBuilds[build.label];
  if (baseBuildId !== build.id) {
    const baseBuild = builds[baseBuildId];
    Object.entries(build.characterItems).forEach(([slot, slotItems]) => {
      addBaseGearItemsToBuild(slotItems, baseBuild.characterItems[slot]);
    });
    if (build.cubeItems) {
      Object.entries(build.cubeItems).forEach(([cubeSlot, cubeSlotItems]) => {
        if (!cubeSlotItems.length) {
          build.cubeItems[cubeSlot].push(...baseBuild.cubeItems[cubeSlot]);
        }
      });
    }
    if (build.followerItems) {
      Object.entries(build.followerItems).forEach(([slot, slotItems]) => {
        addBaseGearItemsToBuild(slotItems, baseBuild.followerItems[slot]);
      });
    }
  }
}

function addItemsToIcons(items: GearItems, icons: string[]) {
  for (let item of items[BuildItemTag.BIS]) {
    if (!icons.includes(item)) {
      icons.push(item);
      break;
    }
  }
}

function getBuildIcons(build: BuildWithItems) {
  const slotIcons: string[] = [];
  const cubeIcons: string[] = [];

  characterItemSlots.forEach((slot) => {
    addItemsToIcons(build.characterItems[slot], slotIcons);
  });

  if (build.cubeItems) {
    cubeItemSlots.forEach((slot, idx) => {
      build.cubeItems[slot].forEach((item) => {
        if (
          cubeIcons.length !== idx + 1 &&
          !slotIcons.includes(item) &&
          !cubeIcons.includes(item)
        ) {
          cubeIcons.push(item);
        }
      });
    });
  }

  if (build.followerItems) {
    followerItemSlots.forEach((slot) => {
      addItemsToIcons(build.followerItems[slot], slotIcons);
    });
  }

  return slotIcons
    .map((id) => ({ id, isCube: false }))
    .concat(cubeIcons.map((id) => ({ id, isCube: true })));
}

const buildsByLabel = getBuildsByLabel(buildsById);
export const { baseBuilds, buildTags } = getBaseBuildsAndTags(buildsByLabel);

export interface BuildIcon {
  id: string;
  isCube: boolean;
}
export type BuildItem = BuildWithItems &
  BuildTags & {
    icons: BuildIcon[];
    score: number;
    search: string;
  };

export interface BuildItemMap {
  [id: string]: BuildItem;
}

export const buildItems = Object.values(
  getBuildsByLabel(buildsById)
).reduce<BuildItemMap>((acc, builds) => {
  Object.values(builds).forEach((build) => {
    addBaseItemsToBuild(build, builds, baseBuilds);
    const icons = getBuildIcons(build);
    const tags = buildTags[build.id];
    const itemLabels = [];
    Object.values(build.characterItems).forEach((slots) =>
      Object.values(slots).forEach((ids) =>
        ids.forEach((id) => itemLabels.push(itemsById[id].label))
      )
    );
    if (build.cubeItems) {
      Object.values(build.cubeItems).forEach((ids) =>
        ids.forEach((id) => itemLabels.push(itemsById[id].label))
      );
    }
    if (build.followerItems) {
      Object.values(build.followerItems).forEach((slots) =>
        Object.values(slots).forEach((ids) =>
          ids.forEach((id) => itemLabels.push(itemsById[id].label))
        )
      );
    }
    const search = [
      build.label,
      build.character,
      tags.subLabel,
      ...itemLabels,
    ].join(" ");

    acc[build.id] = {
      ...build,
      ...tags,
      icons,
      score: 0,
      search,
    };
  });

  return acc;
}, {});
