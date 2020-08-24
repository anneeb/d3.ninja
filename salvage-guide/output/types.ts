export interface RawItemData {
  label: string;
  link: string;
  buildsData?: RawBuildData[];
}

export interface RawBuildData {
  id: string;
  label: string;
  link: string;
  tags: string;
}

export enum ItemColor {
  "GREEN" = "green",
  "ORANGE" = "orange",
}

export enum ItemSlot {
  "HEAD" = "head",
  "SHOULDERS" = "shoulders",
  "TORSO" = "torso",
  "BRACERS" = "bracers",
  "HANDS" = "hands",
  "WAIST" = "waist",
  "LEGS" = "legs",
  "FEET" = "feet",
  "NECK" = "neck",
  "RIGHT_FINGER" = "right-finger",
  "LEFT_FINGER" = "left-finger",
  "RIGHT_HAND" = "right-hand",
  "LEFT_HAND" = "left-hand",
  "FOLLOWER_SPECIAL" = "follower-special",
}

export interface Item {
  id: string;
  label: string;
  link: string;
  img: string;
  color: ItemColor;
  slots: ItemSlot[];
  isTwoHanded: boolean;
}

export interface ItemsById {
  [id: string]: Item;
}

export interface Build {
  id: string;
  label: string;
  link: string;
}

export interface BuildsById {
  [id: string]: Build;
}

export enum BuildItemTag {
  "ALT" = "Alt",
  "BIS" = "BiS",
  "CUBE" = "Cube",
  "OUTDATED" = "outdated",
  "VARIATION" = "variation",
  "ENCHANTRESS" = "Enchantress",
  "SCOUNDREL" = "Scoundrel",
  "TEMPLAR" = "Templar",
}

export interface BuildsByItem {
  [item: string]: {
    [build: string]: string;
  };
}

export interface ItemsByBuild {
  [build: string]: {
    [item: string]: string;
  };
}

export interface TagsById {
  [id: string]: BuildItemTag[];
}
