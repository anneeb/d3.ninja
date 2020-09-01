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
  "LEFT_FINGER" = "left-finger",
  "RIGHT_FINGER" = "right-finger",

  "LEFT_HAND" = "left-hand",
  "RIGHT_HAND" = "right-hand",

  "FOLLOWER_SPECIAL" = "follower-special",
  "CUBE" = "cube",
}

export enum ItemCubeSlot {
  "ARMOR" = "armor",
  "WEAPON" = "weapon",
  "JEWELRY" = "jewelry",
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

export enum BuildCharacter {
  "BARBARIAN" = "Barbarian",
  "CRUSADER" = "Crusader",
  "DEMON_HUNTER" = "Demon Hunter",
  "MONK" = "Monk",
  "NECROMANCER" = "Necromancer",
  "WITCH_DOCTOR" = "Witch Doctor",
  "WIZARD" = "Wizard",

  "FOLLOWER" = "Follower",
}

export interface Build {
  id: string;
  character: BuildCharacter;
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
