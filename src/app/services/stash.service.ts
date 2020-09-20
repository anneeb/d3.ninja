import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { stashItems, StashItemMap } from "constants/salvage-guide/stash";
import { BaseService } from "app/services/base-service";

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
      .filter((item) => item.isSelected || item.isCubeSelected)
      .map((item) => item.id);
    this.setSelectedItems(selectedItems);
  }

  updateFilter(filter: string) {
    setTimeout(() => this.setFilter(filter), 0);
  }

  updateIsItemSelected(itemId: string, isSelected?: boolean) {
    const prevItems = this.items.getValue();
    const newIsSelected =
      isSelected === undefined ? !prevItems[itemId].isSelected : isSelected;
    const updatedItems: StashItemMap = {
      ...prevItems,
      [itemId]: {
        ...prevItems[itemId],
        isSelected: newIsSelected,
        isCubeSelected: newIsSelected,
      },
    };
    setTimeout(() => this.setItems(updatedItems), 0);
  }

  updateIsItemCubeSelected(itemId: string, isCubeSelected?: boolean) {
    const prevItems = this.items.getValue();
    const updatedItems: StashItemMap = {
      ...prevItems,
      [itemId]: {
        ...prevItems[itemId],
        isCubeSelected:
          isCubeSelected === undefined
            ? !prevItems[itemId].isCubeSelected
            : isCubeSelected,
      },
    };
    setTimeout(() => this.setItems(updatedItems), 0);
  }
}
