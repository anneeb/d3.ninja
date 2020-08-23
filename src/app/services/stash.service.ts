import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { BaseService } from "app/services/base-service";

import { itemsByLink } from "constants/salvage-guide/salvage-guide";
import { Item } from "constants/salvage-guide/types";
import { SelectItem } from "app/components/select/select.component";

export type StashItem = SelectItem &
  Item & {
    isSelected: boolean;
  };

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

  constructor() {
    super();
  }

  getItems() {
    return super.getBehaviorSubjectValue(this.items);
  }

  setItems(items: StashItemMap) {
    return super.setBehaviorSubjectValue(this.items, items);
  }

  setIsItemSelcted(item: StashItem, isSelected?: boolean) {
    this.setItems({
      ...this.items.value,
      [item.value]: {
        ...this.items.value[item.value],
        isSelected:
          isSelected === undefined
            ? !this.items.value[item.value].isSelected
            : isSelected,
      },
    });
  }

  getFilter() {
    return super.getBehaviorSubjectValue(this.filter);
  }

  setFilter(filter: string) {
    return super.setBehaviorSubjectValue(this.filter, filter);
  }
}
