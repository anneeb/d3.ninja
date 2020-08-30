import {
  itemsById,
  buildsById,
  itemsByBuild,
  tagsById,
} from "constants/salvage-guide/salvage-guide";
import {
  ItemSlot,
  ItemCubeSlot,
  Build,
  BuildItemTag,
  BuildsById,
} from "constants/salvage-guide/types";

function createCubeItems() {
  return {
    [ItemCubeSlot.ARMOR]: [] as string[],
    [ItemCubeSlot.WEAPON]: [] as string[],
    [ItemCubeSlot.JEWELRY]: [] as string[],
  };
}

type ItemGearTag = BuildItemTag.ALT | BuildItemTag.BIS | BuildItemTag.VARIATION;
const ItemGearTags = new Set([
  BuildItemTag.ALT,
  BuildItemTag.BIS,
  BuildItemTag.VARIATION,
]);

type GearItems = ReturnType<typeof createGearItems>;
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
const ItemArmorSlots = new Set([
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
  | ItemSlot.RIGHT_FINGER
  | ItemSlot.LEFT_FINGER;
const ItemJewelrySlots = new Set([
  ItemSlot.NECK,
  ItemSlot.RIGHT_FINGER,
  ItemSlot.LEFT_FINGER,
]);

type ItemWeaponSlot = ItemSlot.RIGHT_HAND | ItemSlot.LEFT_HAND;
const ItemWeaponSlots = new Set([ItemSlot.RIGHT_HAND, ItemSlot.LEFT_HAND]);

type HeroItemSlot = ItemArmorSlot | ItemJewelrySlot | ItemWeaponSlot;

type HeroItems = ReturnType<typeof createHeroItems>;
function createHeroItems() {
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
    [ItemSlot.RIGHT_FINGER]: createGearItems(),
    [ItemSlot.LEFT_FINGER]: createGearItems(),

    [ItemSlot.RIGHT_HAND]: createGearItems(),
    [ItemSlot.LEFT_HAND]: createGearItems(),

    [ItemSlot.CUBE]: createCubeItems(),
  };
}

type FollowerItemSlot =
  | ItemJewelrySlot
  | ItemWeaponSlot
  | ItemSlot.FOLLOWER_SPECIAL;

function createFollowerItems() {
  return {
    [ItemSlot.NECK]: createGearItems(),
    [ItemSlot.RIGHT_FINGER]: createGearItems(),
    [ItemSlot.LEFT_FINGER]: createGearItems(),

    [ItemSlot.RIGHT_HAND]: createGearItems(),
    [ItemSlot.LEFT_HAND]: createGearItems(),

    [ItemSlot.FOLLOWER_SPECIAL]: createGearItems(),
  };
}

const FollowerTags = new Set([
  BuildItemTag.ENCHANTRESS,
  BuildItemTag.SCOUNDREL,
  BuildItemTag.TEMPLAR,
]);
type FollowerItemTag =
  | BuildItemTag.ENCHANTRESS
  | BuildItemTag.SCOUNDREL
  | BuildItemTag.TEMPLAR;

type FollowersItems = ReturnType<typeof createFollowersItems>;
function createFollowersItems() {
  return {
    [BuildItemTag.ENCHANTRESS]: createFollowerItems(),
    [BuildItemTag.SCOUNDREL]: createFollowerItems(),
    [BuildItemTag.TEMPLAR]: createFollowerItems(),
  };
}

interface BuildWithItems extends Build {
  isFollower: boolean;
  isOutdated: boolean;
  heroItems?: HeroItems;
  followersItems?: FollowersItems;
}

interface BuildsWithItems {
  [id: string]: BuildWithItems;
}

interface BuildsByLabel {
  [label: string]: BuildsWithItems;
}

function getBuildWithItems(build: Build): BuildWithItems {
  let isOutdated = false;
  const isFollower = Object.values(itemsByBuild[build.id]).some((tagId) =>
    tagsById[tagId].some((tag) => FollowerTags.has(tag))
  );
  let heroItems: HeroItems;
  let followersItems: FollowersItems;

  if (isFollower) {
    followersItems = createFollowersItems();
  } else {
    heroItems = createHeroItems();
  }

  Object.entries(itemsByBuild[build.id]).forEach(([item, tagId]) => {
    const followerTags: FollowerItemTag[] = [];
    const gearTags: ItemGearTag[] = [];
    let isCube = false;

    tagsById[tagId].forEach((tag) => {
      if (tag === BuildItemTag.OUTDATED) {
        isOutdated = true;
      } else if (tag === BuildItemTag.CUBE) {
        isCube = true;
      } else if (FollowerTags.has(tag)) {
        followerTags.push(tag as FollowerItemTag);
      } else if (ItemGearTags.has(tag)) {
        gearTags.push(tag as ItemGearTag);
      }
    });

    if (isFollower) {
      followerTags.forEach((followerTag) => {
        const follower = followersItems[followerTag];
        itemsById[item].slots.forEach((slot: FollowerItemSlot) => {
          const followerSlot = follower[slot];
          gearTags.forEach((gearTag) => {
            followerSlot[gearTag].push(item);
          });
        });
      });
    } else {
      if (isCube) {
        const cubeSlots: Set<ItemCubeSlot> = new Set();
        itemsById[item].slots.forEach((slot: HeroItemSlot) => {
          if (ItemArmorSlots.has(slot)) {
            cubeSlots.add(ItemCubeSlot.ARMOR);
          }
          if (ItemJewelrySlots.has(slot)) {
            cubeSlots.add(ItemCubeSlot.JEWELRY);
          }
          if (ItemWeaponSlots.has(slot)) {
            cubeSlots.add(ItemCubeSlot.WEAPON);
          }
        });

        cubeSlots.forEach((cubeSlot) => {
          heroItems.cube[cubeSlot].push(item);
        });
      }
      gearTags.forEach((gearTag) => {
        itemsById[item].slots.forEach((slot: HeroItemSlot) => {
          heroItems[slot][gearTag].push(item);
        });
      });
    }
  });

  return {
    ...build,
    heroItems,
    followersItems,
    isFollower,
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

function countGearItems(acc: number, gear: GearItems) {
  return (
    acc +
    Object.values(gear).reduce<number>(
      (subAcc, items) => subAcc + items.length,
      0
    )
  );
}

function countBuildItems(build: BuildWithItems) {
  return build.isFollower
    ? Object.values(build.followersItems).reduce<number>(
        (acc, follower) =>
          acc + Object.values(follower).reduce<number>(countGearItems, 0),
        0
      )
    : Object.values(build.heroItems).reduce<number>(countGearItems, 0);
}

type BaseBuildsByLabel = {
  [key: string]: string;
};

function getBaseBuilds(buildsByLabel: BuildsByLabel) {
  return Object.entries(buildsByLabel).reduce<BaseBuildsByLabel>(
    (acc, [key, buildsById]) => {
      const builds = Object.values(buildsById);
      if (builds.length === 1) {
        acc[key] = builds[0].id;
      } else {
        let maxBuild = builds[0];
        let maxBuildCount = countBuildItems(maxBuild);
        builds.forEach((build) => {
          const buildCount = countBuildItems(build);
          if (buildCount > maxBuildCount) {
            maxBuild = build;
            maxBuildCount = maxBuildCount;
          }
        });
        acc[key] = maxBuild.id;
      }

      return acc;
    },
    {}
  );
}

function addBaseGearItemsToBuild(
  slot: ItemSlot,
  items: GearItems,
  baseItems: GearItems
) {
  if (!items[BuildItemTag.BIS].length) {
    items[BuildItemTag.BIS] = [...baseItems[BuildItemTag.BIS]];
  }

  if (
    (slot === ItemSlot.LEFT_FINGER || slot === ItemSlot.RIGHT_FINGER) &&
    items[BuildItemTag.BIS].length < 2
  ) {
    items[BuildItemTag.BIS].push(...baseItems[BuildItemTag.VARIATION]);
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
    if (build.isFollower) {
      Object.entries(build.followersItems).forEach(
        ([follower, followerItems]) => {
          Object.entries(followerItems).forEach(([slot, slotItems]) => {
            addBaseGearItemsToBuild(
              slot as ItemSlot,
              slotItems,
              baseBuild.followersItems[follower][slot]
            );
          });
        }
      );
    } else {
      Object.entries(build.heroItems).forEach(([slot, slotItems]) => {
        if (slot === ItemSlot.CUBE) {
          Object.entries(slotItems).forEach(([cubeSlot, cubeSlotItems]) => {
            if (!cubeSlotItems.length) {
              build.heroItems[slot][cubeSlot] = [
                ...baseBuild.heroItems[slot][cubeSlot],
              ];
            }
          });
        } else {
          addBaseGearItemsToBuild(
            slot as ItemSlot,
            slotItems as GearItems,
            baseBuild.heroItems[slot]
          );
        }
      });
    }
  }
}

function addItemsToIcons(items: GearItems, icons: string[]) {
  items[BuildItemTag.BIS].forEach((item: string) => {
    if (!icons.includes(item)) {
      icons.push(item);
    }
  });
}

function getBuildIcons(build: BuildWithItems) {
  const slotIcons: string[] = [];
  const cubeIcons: string[] = [];

  if (build.isFollower) {
    Object.values(build.followersItems).forEach((followerItems) => {
      Object.values(followerItems).forEach((slotItems) => {
        addItemsToIcons(slotItems, slotIcons);
      });
    });
  } else {
    Object.entries(build.heroItems).forEach(([slot, slotItems]) => {
      if (slot === ItemSlot.CUBE) {
        Object.values(slotItems).forEach((cubeSlotItems, idx) => {
          cubeSlotItems.forEach((item: string) => {
            if (
              cubeIcons.length !== idx + 1 &&
              !slotIcons.includes(item) &&
              !cubeIcons.includes(item)
            ) {
              cubeIcons.push(item);
            }
          });
        });
      } else {
        addItemsToIcons(slotItems as GearItems, slotIcons);
      }
    });
  }

  return slotIcons.concat(cubeIcons);
}

const buildsByLabel = getBuildsByLabel(buildsById);
const baseBuildIds = getBaseBuilds(buildsByLabel);

export type BuildItem = BuildWithItems & {
  icons: string[];
  score: number;
};

export interface BuildItemMap {
  [id: string]: BuildItem;
}

export const buildItems = Object.values(getBuildsByLabel(buildsById)).reduce<
  BuildItemMap
>((acc, builds) => {
  Object.values(builds).forEach((build) => {
    addBaseItemsToBuild(build, builds, baseBuildIds);
    const icons = getBuildIcons(build);

    acc[build.id] = {
      ...build,
      icons,
      score: 0,
    };
  });

  return acc;
}, {});

console.log(buildItems);

export function buildItemSort(
  property: keyof BuildItem = "score",
  desc?: boolean
) {
  return function (a: BuildItem, b: BuildItem) {
    const aProp = a[property];
    const aVal = typeof aProp === "string" ? aProp.toLowerCase() : aProp;

    const bProp = b[property];
    const bVal = typeof bProp === "string" ? bProp.toLowerCase() : bProp;

    if (property !== "label" && aVal === bVal) {
      return buildItemSort("label")(a, b);
    }

    return aVal < bVal ? (desc ? 1 : -1) : aVal > bVal ? (desc ? -1 : 1) : 0;
  };
}
