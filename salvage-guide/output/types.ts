export interface RawItemData {
  label: string;
  link: string;
  type: string;
  img: string;
  buildsData?: RawBuildData[];
}

export interface RawBuildData {
  label: string;
  link: string;
  tags: string;
}

export const enum ItemType {
  "LEGENDARY" = "legendary",
  "SET" = "set",
}

export interface Item {
  label: string;
  link: string;
  type: ItemType;
  img: string;
}

export interface ItemsByLink {
  [link: string]: Item;
}

export interface Build {
  label: string;
  link: string;
}

export interface BuildsByLink {
  [link: string]: Build;
}

export const enum BuildItemTag {
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

export interface TagsByLinks {
  [links: string]: BuildItemTag[];
}
