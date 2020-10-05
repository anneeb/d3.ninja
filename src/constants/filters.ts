import { BuildItem, buildTags } from "constants/builds";
import { BuildCharacter } from "constants/salvage-guide/types";

export enum BuildSortBy {
  "STASH_DESC" = "Stash (desc)",
  "STASH_ASC" = "Stash (asc)",
  "NAME_DESC" = "Name (desc)",
  "NAME_ASC" = "Name (asc)",
}

export const buildSortByArgs: {
  [key: string]: [keyof BuildItem, boolean];
} = {
  [BuildSortBy.STASH_DESC]: ["score", true],
  [BuildSortBy.STASH_ASC]: ["score", false],
  [BuildSortBy.NAME_DESC]: ["label", true],
  [BuildSortBy.NAME_ASC]: ["label", false],
};
export const buildSortByOptions = Object.values(BuildSortBy);

export const buildCharacterOptions = Object.values(BuildCharacter);

export const buildTagOptions = Object.values(buildTags)
  .reduce<string[]>((acc, { subLabel }) => {
    if (subLabel && !acc.includes(subLabel)) {
      acc.push(subLabel);
    }
    return acc;
  }, [])
  .sort((a, b) =>
    a.toLowerCase() < b.toLowerCase()
      ? -1
      : a.toLowerCase() > b.toLowerCase()
      ? 1
      : 0
  );

export enum BuildToggle {
  "YES" = "Yes",
  "NO" = "No",
}

export const buildToggleOption = Object.values(BuildToggle);

export interface BuildSortAndFilter {
  sortBy: BuildSortBy;
  characters: BuildCharacter[];
  tags: string[];
  variation: BuildToggle[];
  outdated: BuildToggle[];
}

export const defaultBuildSortAndFilter: BuildSortAndFilter = {
  sortBy: buildSortByOptions[0],
  characters: buildCharacterOptions,
  tags: buildTagOptions,
  variation: buildToggleOption,
  outdated: buildToggleOption,
};

export function buildItemFilter(
  item: BuildItem,
  { characters, tags, variation, outdated }: BuildSortAndFilter
) {
  const variationMatch = variation.includes(
    item.isVariation ? BuildToggle.YES : BuildToggle.NO
  );
  const outdatedMatch = outdated.includes(
    item.isOutdated ? BuildToggle.YES : BuildToggle.NO
  );
  const characterMatch = characters.includes(item.character);
  const tagMatch = !item.subLabel || tags.includes(item.subLabel);
  return variationMatch && outdatedMatch && characterMatch && tagMatch;
}

export function buildItemSort(
  property: keyof BuildItem = "score",
  desc?: boolean
) {
  return function (a: BuildItem, b: BuildItem) {
    const aProp = a[property];
    const aVal = typeof aProp === "string" ? aProp.toLowerCase() : aProp;

    const bProp = b[property];
    const bVal = typeof bProp === "string" ? bProp.toLowerCase() : bProp;

    if (aVal === bVal) {
      if (property === "label") {
        return a.isVariation ? 1 : b.isVariation ? -1 : 0;
      } else {
        return buildItemSort("label")(a, b);
      }
    }

    return aVal < bVal ? (desc ? 1 : -1) : aVal > bVal ? (desc ? -1 : 1) : 0;
  };
}
