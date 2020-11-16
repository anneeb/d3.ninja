import { itemsById } from "constants/salvage-guide/salvage-guide";
import { Item } from "constants/salvage-guide/types";

export interface StashItem extends Item {
  isSelected: boolean;
  isCubeSelected: boolean;
}

export type SelectedStashItem = Pick<
  StashItem,
  "id" | "isSet" | "isSelected" | "isCubeSelected"
>;

export interface StashItemMap {
  [value: string]: StashItem;
}

export const stashItems = Object.values(itemsById).reduce<StashItemMap>(
  (acc, item: Item) => ({
    ...acc,
    [item.id]: {
      ...item,
      isSelected: false,
      isCubeSelected: false,
    },
  }),
  {}
);
