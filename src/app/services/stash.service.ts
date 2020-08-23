import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { BaseService } from "app/services/base-service";

import { itemsByLink } from "constants/salvage-guide/salvage-guide";
import { Item } from "constants/salvage-guide/types";

export interface StashItem extends Item {
  isSelected: boolean;
  value: string;
}

export interface StashItemMap {
  [value: string]: StashItem;
}

const stashItems = Object.values(itemsByLink).reduce<StashItemMap>(
  (acc, item: Item) => ({
    ...acc,
    [item.link]: {
      ...item,
      value: item.link,
      isSelected: false,
    },
  }),
  {}
);

@Injectable({
  providedIn: "root",
})
export class StashService extends BaseService {
  private items = new BehaviorSubject(stashItems);

  private filter = new BehaviorSubject("");
  private filteredItems = new BehaviorSubject(Object.values(stashItems));

  private selectedItems = new BehaviorSubject([] as StashItem[]);

  constructor() {
    super();
  }

  getItems() {
    return super.getBehaviorSubjectValue(this.items);
  }

  private setItems(items: StashItemMap) {
    return super.setBehaviorSubjectValue(this.items, items);
  }

  getFilter() {
    return super.getBehaviorSubjectValue(this.filter);
  }

  private setFilter(filter: string) {
    return super.setBehaviorSubjectValue(this.filter, filter);
  }

  getFilteredItems() {
    return super.getBehaviorSubjectValue(this.filteredItems);
  }

  private setFilteredItems(items: StashItem[]) {
    return super.setBehaviorSubjectValue(this.filteredItems, items);
  }

  getSelectedItems() {
    return super.getBehaviorSubjectValue(this.selectedItems);
  }

  private setSelectedItems(items: StashItem[]) {
    return super.setBehaviorSubjectValue(this.selectedItems, items);
  }

  updateFilter(filter: string) {
    const filterMatch = new RegExp(this.filter.getValue(), "gi");
    const filteredItems = Object.values(this.items.getValue()).filter((item) =>
      item.label.match(filterMatch)
    );

    this.setFilter(filter);
    this.setFilteredItems(filteredItems);
  }

  updateIsItemSelcted(item: StashItem, isSelected?: boolean) {
    const updatedItems: StashItemMap = {
      ...this.items.value,
      [item.value]: {
        ...this.items.value[item.value],
        isSelected:
          isSelected === undefined
            ? !this.items.value[item.value].isSelected
            : isSelected,
      },
    };

    const filterMatch = new RegExp(this.filter.getValue(), "gi");
    const filteredItems: StashItem[] = [];
    const selectedItems: StashItem[] = [];

    Object.values(updatedItems).forEach((updatedItem) => {
      if (updatedItem.label.match(filterMatch)) {
        filteredItems.push(updatedItem);
      }
      if (updatedItem.isSelected) {
        selectedItems.push(updatedItem);
      }
    });

    this.setItems(updatedItems);
    this.setFilteredItems(filteredItems);
    this.setSelectedItems(selectedItems);
  }
}
