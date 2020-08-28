import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { itemsById } from "constants/salvage-guide/salvage-guide";
import { Item } from "constants/salvage-guide/types";
import { BaseService } from "app/services/base-service";

export interface StashItem extends Item {
  isSelected: boolean;
}

export interface StashItemMap {
  [value: string]: StashItem;
}

const stashItems = Object.values(itemsById).reduce<StashItemMap>(
  (acc, item: Item) => ({
    ...acc,
    [item.id]: {
      ...item,
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
  private filteredItems = new BehaviorSubject(Object.keys(stashItems));
  private selectedItems = new BehaviorSubject([] as string[]);

  constructor() {
    super();

    this.getItems().subscribe(() =>
      setTimeout(() => this.syncSelectedItems(), 0)
    );
    this.getFilter().subscribe(() =>
      setTimeout(() => this.syncFilteredItems(), 0)
    );
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

  private setFilteredItems(items: string[]) {
    return super.setBehaviorSubjectValue(this.filteredItems, items);
  }

  private syncFilteredItems() {
    const filterMatch = new RegExp(this.filter.getValue(), "gi");
    const filteredItems = Object.values(this.items.getValue())
      .filter((item) => item.label.match(filterMatch))
      .map((item) => item.id);
    this.setFilteredItems(filteredItems);
  }

  getSelectedItems() {
    return super.getBehaviorSubjectValue(this.selectedItems);
  }

  private setSelectedItems(items: string[]) {
    return super.setBehaviorSubjectValue(this.selectedItems, items);
  }

  private syncSelectedItems() {
    const selectedItems = Object.values(this.items.getValue())
      .filter((item) => item.isSelected)
      .map((item) => item.id);
    this.setSelectedItems(selectedItems);
  }

  updateFilter(filter: string) {
    setTimeout(() => this.setFilter(filter), 0);
  }

  updateIsItemSelcted(itemId: string, isSelected?: boolean) {
    const prevItems = this.items.getValue();
    const updatedItems: StashItemMap = {
      ...prevItems,
      [itemId]: {
        ...prevItems[itemId],
        isSelected:
          isSelected === undefined ? !prevItems[itemId].isSelected : isSelected,
      },
    };
    setTimeout(() => this.setItems(updatedItems), 0);
  }
}
