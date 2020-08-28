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

  getSelectedItems() {
    return super.getBehaviorSubjectValue(this.selectedItems);
  }

  private setSelectedItems(items: string[]) {
    return super.setBehaviorSubjectValue(this.selectedItems, items);
  }

  updateFilter(filter: string) {
    const prevItems = this.items.getValue();
    const filterMatch = new RegExp(filter, "gi");
    const filteredItems = Object.values(prevItems)
      .filter((item) => item.label.match(filterMatch))
      .map((item) => item.id);

    this.setFilter(filter);
    this.setFilteredItems(filteredItems);
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
    this.setItems(updatedItems);

    const selectedItems = Object.values(this.items.getValue())
      .filter((item) => item.isSelected)
      .map((item) => item.id);
    this.setSelectedItems(selectedItems);
  }
}
