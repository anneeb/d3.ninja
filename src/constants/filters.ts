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
    if (!acc.includes(subLabel)) {
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

export enum BuildOutdated {
  "YES" = "Yes",
  "NO" = "No",
}

export const BuildOutdatedOptions = Object.values(BuildOutdated);

export interface BuildSortAndFilter {
  sortBy: BuildSortBy;
  characters: BuildCharacter[];
  tags: string[];
  outdated: BuildOutdated[];
}

export const defaultBuildSortAndFilter: BuildSortAndFilter = {
  sortBy: buildSortByOptions[0],
  characters: buildCharacterOptions,
  tags: buildTagOptions,
  outdated: [BuildOutdated.NO],
};

export function buildItemFilter(
  item: BuildItem,
  search: string,
  { characters, tags, outdated }: BuildSortAndFilter
) {
  const searchMatch = Boolean(item.search.match(new RegExp(search, "i")));
  const characterMatch = characters.includes(item.character);
  const tagMatch = tags.includes(item.subLabel);
  const outdatedMatch = outdated.includes(
    item.isOutdated ? BuildOutdated.YES : BuildOutdated.NO
  );
  return searchMatch && characterMatch && tagMatch && outdatedMatch;
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
