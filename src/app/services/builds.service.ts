import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import {
  buildsByLink,
  itemsByBuild,
  tagsByLinks,
} from "constants/salvage-guide/salvage-guide";
import { Build, BuildItemTag } from "constants/salvage-guide/types";
import { BaseService } from "app/services/base-service";
import { StashService, StashItem } from "app/services/stash.service";

export interface BuildItem extends Build {
  isOutdated: boolean;
  items: {
    [BuildItemTag.ALT]: string[];
    [BuildItemTag.CUBE]: string[];
    [BuildItemTag.BIS]: string[];
    [BuildItemTag.VARIATION]: string[];
  };
  score: number;
}

export interface BuildItemMap {
  [value: string]: BuildItem;
}

function buildItemSort(property: keyof BuildItem = "score", desc: boolean) {
  return function (a: BuildItem, b: BuildItem) {
    const aProp = a[property];
    const aVal = typeof aProp === "string" ? aProp.toLowerCase() : aProp;

    const bProp = b[property];
    const bVal = typeof bProp === "string" ? bProp.toLowerCase() : bProp;

    return aVal < bVal ? (desc ? 1 : -1) : aVal > bVal ? (desc ? -1 : 1) : 0;
  };
}

const buildItems = Object.values(buildsByLink).reduce<BuildItemMap>(
  (acc, build: Build) => {
    let isOutdated = false;

    const items = {
      [BuildItemTag.ALT]: [],
      [BuildItemTag.BIS]: [],
      [BuildItemTag.CUBE]: [],
      [BuildItemTag.VARIATION]: [],
    };

    const buildItems = itemsByBuild[build.link];

    if (buildItems) {
      Object.entries(buildItems).forEach(([item, tagLink]) => {
        const tags = tagsByLinks[tagLink];
        tags.forEach((tag) => {
          if (tag === BuildItemTag.OUTDATED) {
            isOutdated = true;
          } else {
            items[tag].push(item);
          }
        });
      });
    } else {
      console.log(build.link, itemsByBuild[build.link]);
    }

    return {
      ...acc,
      [build.link]: {
        ...build,
        isOutdated,
        items,
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

  private sortedItems = new BehaviorSubject(Object.values(buildItems));

  // private filter = new BehaviorSubject("");
  // private filteredItems = new BehaviorSubject(Object.values(buildItems));

  constructor() {
    super();
  }

  setStashService(stashService: StashService) {
    this.stashService = stashService;
    this.stashService.getSelectedItems().subscribe((selectedItems) => {
      console.log("changed items", selectedItems);
      this.setItemScores(selectedItems);
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

  private setSortedItems(items: BuildItem[]) {
    return super.setBehaviorSubjectValue(this.sortedItems, items);
  }

  // getFilter() {
  //   return super.getBehaviorSubjectValue(this.filter);
  // }

  // private setFilter(filter: string) {
  //   return super.setBehaviorSubjectValue(this.filter, filter);
  // }

  setItemScores(selectedItems: StashItem[]) {
    const selectedItemsSet = new Set(selectedItems.map((item) => item.value));
    const hasSelectedItems = Boolean(selectedItemsSet.size);
    const updatedItems = Object.entries(this.items.getValue()).reduce<
      BuildItemMap
    >((acc, [key, build]) => {
      console.log(key, itemsByBuild[key]);

      const allBuildItems = Object.keys(itemsByBuild[key]);
      console.log(allBuildItems);

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

      const bestInSlot =
        (build.items[BuildItemTag.BIS].filter((item) =>
          selectedItemsSet.has(item)
        ).length /
          build.items[BuildItemTag.BIS].length) *
        100;

      const cube =
        (build.items[BuildItemTag.CUBE].filter((item) =>
          selectedItemsSet.has(item)
        ).length /
          build.items[BuildItemTag.CUBE].length) *
        100;

      acc[key] = {
        ...build,
        score: (bestInSlot + cube) / 2,
      };

      console.log(acc[key].score);

      return acc;
    }, {});

    this.setItems(updatedItems);
    this.setSortedItems(
      Object.values(updatedItems).sort(
        buildItemSort(hasSelectedItems ? "score" : "label", hasSelectedItems)
      )
    );
  }
}
