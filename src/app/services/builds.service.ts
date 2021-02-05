import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { buildItems, BuildItemMap, baseBuilds } from "constants/builds";
import { SelectedStashItem } from "constants/stash";
import {
  BuildSortAndFilter,
  defaultBuildSortAndFilter,
  buildItemFilter,
  buildItemSort,
  buildSortByArgs,
} from "constants/filters";
import { itemsByBuild } from "constants/salvage-guide/salvage-guide";
import { BaseService } from "app/services/base-service";
import { StashService } from "app/services/stash.service";

@Injectable({
  providedIn: "root",
})
export class BuildsService extends BaseService {
  private stashService: StashService;
  private items = new BehaviorSubject(buildItems);
  private search = new BehaviorSubject<string>("");
  private sortAndFilter = new BehaviorSubject<BuildSortAndFilter>(
    defaultBuildSortAndFilter
  );
  private isProcessingItems = new BehaviorSubject(false);
  private processedItems = new BehaviorSubject(
    Object.values(this.items.getValue())
      .sort(buildItemSort("score", true))
      .map((item) => item.id)
  );
  private isPendingProcessItems: boolean;
  private processItemsTimeout: NodeJS.Timeout;

  constructor() {
    super();

    this.getItems().subscribe(() => this.debouncedProcessItems());
    this.getSortAndFilter().subscribe(() => this.debouncedProcessItems());
    this.getSearch().subscribe(() => this.debouncedProcessItems());
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

  getSearch() {
    return super.getBehaviorSubjectValue(this.search);
  }

  private setSearch(search: string) {
    super.setBehaviorSubjectValue(this.search, search);
  }

  updateSearch(search: string) {
    if (this.search.getValue() !== search) {
      this.setSearch(search);
    }
  }

  getSortAndFilter() {
    return super.getBehaviorSubjectValue(this.sortAndFilter);
  }

  private setSortAndFilter(sortAndFilter: BuildSortAndFilter) {
    super.setBehaviorSubjectValue(this.sortAndFilter, sortAndFilter);
  }

  updateSortAndFilter(update: Partial<BuildSortAndFilter>) {
    this.setSortAndFilter({
      ...this.sortAndFilter.getValue(),
      ...update,
    });
  }

  getIsProcessingItems() {
    return super.getBehaviorSubjectValue(this.isProcessingItems);
  }

  private setIsProcessingItems(isProcessingItems: boolean) {
    return super.setBehaviorSubjectValue(
      this.isProcessingItems,
      isProcessingItems
    );
  }

  private debouncedProcessItems() {
    if (this.isPendingProcessItems) {
      clearTimeout(this.processItemsTimeout);
    }

    this.isPendingProcessItems = true;
    this.processItemsTimeout = setTimeout(
      () => this.delayedProcessItems(),
      1000
    );
  }

  private delayedProcessItems() {
    this.isPendingProcessItems = false;
    this.setIsProcessingItems(true);
    setTimeout(() => this.processItems(), 500);
  }

  getProcessedItems() {
    return super.getBehaviorSubjectValue(this.processedItems);
  }

  private setProcessedItems(items: string[]) {
    return super.setBehaviorSubjectValue(this.processedItems, items);
  }

  private processItems() {
    const search = this.search.getValue();
    const sortAndFilter = this.sortAndFilter.getValue();
    this.setProcessedItems(
      Object.values(this.items.getValue())
        .filter((item) => buildItemFilter(item, search, sortAndFilter))
        .sort(buildItemSort(...buildSortByArgs[sortAndFilter.sortBy]))
        .map((item) => item.id)
    );
    if (!this.isPendingProcessItems) {
      this.setIsProcessingItems(false);
    }
  }

  private setItemScores(items: SelectedStashItem[]) {
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
    const updatedItems = Object.entries(
      this.items.getValue()
    ).reduce<BuildItemMap>((acc, [key, build]) => {
      const allBuildItems = Object.keys(itemsByBuild[key]);
      if (baseBuilds[build.label] !== key) {
        allBuildItems.push(
          ...Object.keys(itemsByBuild[baseBuilds[build.label]])
        );
      }

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
