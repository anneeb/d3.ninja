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
}

export enum CubeItemSlot {
  "ARMOR" = "armor",
  "WEAPON" = "weapon",
  "JEWELRY" = "jewelry",
}

export interface Item {
  id: string;
  label: string;
  link: string;
  img: string;
  slots: ItemSlot[];
  isSet: boolean;
  isTwoHanded: boolean;
}

export interface ItemsById {
  [id: string]: Item;
}

export const FOLLOWER_GUIDE_ID = "follower-skills-and-gearing-guide";

export enum BuildCharacter {
  "BARBARIAN" = "Barbarian",
  "CRUSADER" = "Crusader",
  "DEMON_HUNTER" = "Demon Hunter",
  "MONK" = "Monk",
  "NECROMANCER" = "Necromancer",
  "WITCH_DOCTOR" = "Witch Doctor",
  "WIZARD" = "Wizard",

  "ENCHANTRESS" = "Enchantress",
  "SCOUNDREL" = "Scoundrel",
  "TEMPLAR" = "Templar",
}

export const BuildFollowers = [
  BuildCharacter.ENCHANTRESS,
  BuildCharacter.SCOUNDREL,
  BuildCharacter.TEMPLAR,
];

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

export type StashItemVersion = [string[], string[]];
