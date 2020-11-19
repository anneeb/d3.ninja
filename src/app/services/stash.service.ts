import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { stashItems, SelectedStashItem, StashItemMap } from "constants/stash";
import { BaseService } from "app/services/base-service";

@Injectable({
  providedIn: "root",
})
export class StashService extends BaseService {
  private items = new BehaviorSubject(stashItems);
  private search = new BehaviorSubject("");
  private filteredItems = new BehaviorSubject(Object.keys(stashItems));
  private selectedItems = new BehaviorSubject([] as SelectedStashItem[]);

  constructor() {
    super();

    this.getItems().subscribe(() =>
      setTimeout(() => this.syncSelectedItems(), 0)
    );
    this.getSearch().subscribe(() =>
      setTimeout(() => this.syncFilteredItems(), 0)
    );
  }

  getItems() {
    return super.getBehaviorSubjectValue(this.items);
  }

  private setItems(items: StashItemMap) {
    return super.setBehaviorSubjectValue(this.items, items);
  }

  getSearch() {
    return super.getBehaviorSubjectValue(this.search);
  }

  private setSearch(search: string) {
    return super.setBehaviorSubjectValue(this.search, search);
  }

  getFilteredItems() {
    return super.getBehaviorSubjectValue(this.filteredItems);
  }

  private setFilteredItems(items: string[]) {
    return super.setBehaviorSubjectValue(this.filteredItems, items);
  }

  private syncFilteredItems() {
    const searchMatch = new RegExp(this.search.getValue(), "gi");
    const filteredItems = Object.values(this.items.getValue())
      .filter((item) => item.label.match(searchMatch))
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
      .map(({ id, isSet, isSelected, isCubeSelected }) => ({
        id,
        isSet,
        isSelected,
        isCubeSelected,
      }));
    this.setSelectedItems(selectedItems);
  }

  updateSearch(search: string) {
    setTimeout(() => {
      if (this.search.getValue() !== search) {
        this.setSearch(search);
      }
    }, 0);
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

    if (prevItems[itemId].isSet) {
      isCubeSelected = false;
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

  updateIsItemsSelected(selectedItems: SelectedStashItem[]) {
    const prevItems = this.items.getValue();
    const updatedItems: StashItemMap = {
      ...prevItems,
    };

    selectedItems.forEach(({ id, isSelected, isCubeSelected }) => {
      if (updatedItems[id]) {
        updatedItems[id] = {
          ...prevItems[id],
          isSelected,
          isCubeSelected,
        };
      }
    });

    setTimeout(() => this.setItems(updatedItems), 0);
  }
}
