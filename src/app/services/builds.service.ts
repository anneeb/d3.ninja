import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import {
  buildItems,
  buildItemSort,
  BuildItemMap,
} from "constants/salvage-guide/builds";
import { itemsByBuild } from "constants/salvage-guide/salvage-guide";
import { BaseService } from "app/services/base-service";
import { StashService } from "app/services/stash.service";

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
