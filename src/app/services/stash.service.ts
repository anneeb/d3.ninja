import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import {
  stashItems,
  SelectedStashItem,
  StashItemMap,
} from "constants/salvage-guide/stash";
import { BaseService } from "app/services/base-service";

@Injectable({
  providedIn: "root",
})
export class StashService extends BaseService {
  private items = new BehaviorSubject(stashItems);
  private filter = new BehaviorSubject("");
  private filteredItems = new BehaviorSubject(Object.keys(stashItems));
  private selectedItems = new BehaviorSubject([] as SelectedStashItem[]);

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

  private setSelectedItems(items: SelectedStashItem[]) {
    return super.setBehaviorSubjectValue(this.selectedItems, items);
  }

  private syncSelectedItems() {
    const selectedItems = Object.values(this.items.getValue())
      .filter((item) => item.isSelected || item.isCubeSelected)
      .map(({ id, isSelected, isCubeSelected }) => ({
        id,
        isSelected,
        isCubeSelected,
      }));
    this.setSelectedItems(selectedItems);
  }

  updateFilter(filter: string) {
    setTimeout(() => this.setFilter(filter), 0);
  }

  updateIsItemSelected(
    itemId: string,
    newValues?: {
      isSelected: boolean;
      isCubeSelected: boolean;
    }
  ) {
    const prevItems = this.items.getValue();
    let isSelected: boolean;
    let isCubeSelected: boolean;

    if (newValues) {
      isSelected = newValues.isSelected;
      isCubeSelected = newValues.isCubeSelected;
    } else if (
      prevItems[itemId].isSelected ||
      prevItems[itemId].isCubeSelected
    ) {
      isSelected = false;
      isCubeSelected = false;
    } else {
      isSelected = true;
      isCubeSelected = true;
    }

    const updatedItems: StashItemMap = {
      ...prevItems,
      [itemId]: {
        ...prevItems[itemId],
        isSelected,
        isCubeSelected,
      },
    };
    setTimeout(() => this.setItems(updatedItems), 0);
  }
}
