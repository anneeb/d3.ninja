import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import {
  itemsById,
  buildsById,
  itemsByBuild,
  tagsById,
} from "constants/salvage-guide/salvage-guide";
import {
  ItemColor,
  ItemSlot,
  Build,
  BuildItemTag,
} from "constants/salvage-guide/types";
import { BaseService } from "app/services/base-service";
import { StashService, StashItem } from "app/services/stash.service";

function createItemsByTag() {
  return {
    [BuildItemTag.ALT]: [] as string[],
    [BuildItemTag.BIS]: [] as string[],
    [BuildItemTag.CUBE]: [] as string[],
    [BuildItemTag.VARIATION]: [] as string[],
  };
}

function createItemsBySlot() {
  return {
    [ItemSlot.HEAD]: createItemsByTag(),
    [ItemSlot.SHOULDERS]: createItemsByTag(),
    [ItemSlot.TORSO]: createItemsByTag(),
    [ItemSlot.BRACERS]: createItemsByTag(),
    [ItemSlot.HANDS]: createItemsByTag(),
    [ItemSlot.WAIST]: createItemsByTag(),
    [ItemSlot.LEGS]: createItemsByTag(),
    [ItemSlot.FEET]: createItemsByTag(),
    [ItemSlot.NECK]: createItemsByTag(),
    [ItemSlot.RIGHT_FINGER]: createItemsByTag(),
    [ItemSlot.LEFT_FINGER]: createItemsByTag(),
    [ItemSlot.RIGHT_HAND]: createItemsByTag(),
    [ItemSlot.LEFT_HAND]: createItemsByTag(),
    [ItemSlot.FOLLOWER_SPECIAL]: createItemsByTag(),
  };
}

export interface BuildItem extends Build {
  isOutdated: boolean;
  items: ReturnType<typeof createItemsBySlot>;
  icons: string[];
  score: number;
}

export interface BuildItemMap {
  [id: string]: BuildItem;
}

function buildItemSort(property: keyof BuildItem = "score", desc?: boolean) {
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

const buildItems = Object.values(buildsById).reduce<BuildItemMap>(
  (acc, build: Build) => {
    let isOutdated = false;

    const items = createItemsBySlot();

    Object.entries(itemsByBuild[build.id]).forEach(([item, tagId]) => {
      const tags = tagsById[tagId];
      tags.forEach((tag) => {
        if (tag === BuildItemTag.OUTDATED) {
          isOutdated = true;
        } else {
          itemsById[item].slots.forEach((slot) => {
            items[slot][tag].push(item);
          });
        }
      });
    });

    const icons = Object.values(items).reduce<string[]>((acc, tags) => {
      const icon = tags[BuildItemTag.BIS][0] || tags[BuildItemTag.CUBE][0];
      if (icon && !acc.includes(icon)) {
        acc.push(icon);
      }
      return acc;
    }, []);

    return {
      ...acc,
      [build.id]: {
        ...build,
        isOutdated,
        items,
        icons,
        score: 0,
      },
    };
  },
  {}
);

@Injectable({
  providedIn: "root",
})
export class BuildsService extends BaseService {
  private stashService: StashService;

  private items = new BehaviorSubject(buildItems);

  private sortedItems = new BehaviorSubject(Object.keys(buildItems));

  constructor() {
    super();

    this.getItems().subscribe(() =>
      setTimeout(() => this.syncSortedItems(), 0)
    );
  }

  setStashService(stashService: StashService) {
    this.stashService = stashService;
    this.stashService.getSelectedItems().subscribe((selectedItems) => {
      setTimeout(() => this.setItemScores(selectedItems), 0);
    });
  }

  getItems() {
    return super.getBehaviorSubjectValue(this.items);
  }

  private setItems(items: BuildItemMap) {
    return super.setBehaviorSubjectValue(this.items, items);
  }

  getSortedItems() {
    return super.getBehaviorSubjectValue(this.sortedItems);
  }

  private setSortedItems(items: string[]) {
    return super.setBehaviorSubjectValue(this.sortedItems, items);
  }

  private syncSortedItems() {
    this.setSortedItems(
      Object.values(this.items.getValue())
        .sort(buildItemSort("score", true))
        .map((item) => item.id)
    );
  }

  setItemScores(selectedItems: string[]) {
    const selectedItemsSet = new Set(selectedItems);
    const hasSelectedItems = Boolean(selectedItemsSet.size);
    const updatedItems = Object.entries(this.items.getValue()).reduce<
      BuildItemMap
    >((acc, [key, build]) => {
      const allBuildItems = Object.keys(itemsByBuild[key]);

      if (
        !hasSelectedItems ||
        !allBuildItems.some((item) => selectedItemsSet.has(item))
      ) {
        acc[key] = {
          ...build,
          score: 0,
        };
        return acc;
      }

      const score =
        (build.icons.filter((icon) => selectedItemsSet.has(icon)).length /
          build.icons.length) *
        100;

      acc[key] = {
        ...build,
        score,
      };

      return acc;
    }, {});

    setTimeout(() => this.setItems(updatedItems), 0);
  }
}
