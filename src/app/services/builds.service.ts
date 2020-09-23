import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import {
  buildItems,
  buildItemSort,
  BuildItemMap,
} from "constants/salvage-guide/builds";
import { itemsByBuild } from "constants/salvage-guide/salvage-guide";
import { SelectedStashItem } from "constants/salvage-guide/stash";
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
    this.stashService.getSelectedItems().subscribe((items) => {
      setTimeout(() => this.setItemScores(items), 0);
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

  setItemScores(items: SelectedStashItem[]) {
    const stashedItems = new Set();
    const cubedItems = new Set();
    items.forEach(({ id, isSelected, isCubeSelected }) => {
      if (isSelected) {
        stashedItems.add(id);
      }
      if (isCubeSelected) {
        cubedItems.add(id);
      }
    });

    const hasSelectedItems = Boolean(stashedItems.size + cubedItems.size);
    const updatedItems = Object.entries(this.items.getValue()).reduce<
      BuildItemMap
    >((acc, [key, build]) => {
      const allBuildItems = Object.keys(itemsByBuild[key]);

      if (
        !hasSelectedItems ||
        !allBuildItems.some(
          (item) => cubedItems.has(item) || stashedItems.has(item)
        )
      ) {
        acc[key] = {
          ...build,
          score: 0,
        };
        return acc;
      }

      const score =
        (build.icons.filter((icon) =>
          icon.isCube ? cubedItems.has(icon.id) : stashedItems.has(icon.id)
        ).length /
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
