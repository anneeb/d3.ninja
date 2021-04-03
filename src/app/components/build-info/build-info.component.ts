import {
  BuildInfoItem,
  BuildInfoSlot,
} from "app/components/build-info-slots/build-info-slots.component";
import { BuildsService } from "app/services/builds.service";
import { UiService } from "app/services/ui.service";
import {
  BuildItemMap,
  characterItemSlots,
  CubeItems,
  followerItemSlots,
  GearItems,
} from "constants/builds";
import { StashItem } from "constants/stash";

import { Component, OnInit } from "@angular/core";

const getBuildInfoItems = (
  items: GearItems | CubeItems,
  isCube: boolean = false
) => {
  return Object.entries(items).reduce<{ [itemId: string]: BuildInfoItem }>(
    (acc, [itemTag, itemIds]) => {
      itemIds.forEach((itemId) => {
        if (!acc[itemId]) {
          acc[itemId] = {
            id: itemId,
            tags: [],
            isCube,
            isItemSelected: (item: StashItem) =>
              isCube ? item.isCubeSelected : item.isSelected,
          };
        }
        if (!acc[itemId].tags.some((tag) => tag === itemTag)) {
          acc[itemId].tags.push(itemTag);
        }
      });

      return acc;
    },
    {}
  );
};

const buildInfoSort = (a: BuildInfoItem, b: BuildInfoItem) => {
  const aId = a.id.toLowerCase();
  const bId = b.id.toLowerCase();
  return aId < bId ? 1 : aId > bId ? -1 : 0;
};

@Component({
  selector: "app-build-info",
  templateUrl: "./build-info.component.html",
  styleUrls: ["./build-info.component.scss"],
})
export class BuildInfoComponent implements OnInit {
  label: string;
  subLabel: string;
  link: string;
  character: string;
  isOutdated: boolean;
  isVariation: boolean;
  items: BuildInfoSlot[] = null;

  private buildId: string;
  private buildMap: BuildItemMap;

  constructor(
    private buildsService: BuildsService,
    private uiService: UiService
  ) {}

  ngOnInit(): void {
    this.buildsService.getItems().subscribe((itemMap) => {
      this.buildMap = itemMap;
      this.updateItemInfo();
    });

    this.uiService.getSelectedBuild().subscribe((itemId) => {
      this.buildId = itemId;
      this.updateItemInfo();
    });
  }

  updateItemInfo() {
    const build = this.buildMap[this.buildId];
    if (!build) {
      return;
    }

    const {
      label,
      subLabel,
      link,
      character,
      isOutdated,
      isVariation,
      characterItems,
      cubeItems,
      followerItems,
    } = build;

    this.label = label;
    this.subLabel = subLabel;
    this.link = link;
    this.character = character;
    this.isOutdated = isOutdated;
    this.isVariation = isVariation;

    this.items = [];

    characterItemSlots.forEach((slot) => {
      const buildInfoItems = getBuildInfoItems(characterItems[slot]);
      this.items.push({
        label: slot,
        items: Object.values(buildInfoItems).sort(buildInfoSort),
      });
    });

    if (cubeItems) {
      const buildInfoItems = getBuildInfoItems(cubeItems, true);
      this.items.push({
        label: "cube",
        items: Object.values(buildInfoItems),
      });
    }

    if (followerItems) {
      followerItemSlots.forEach((slot) => {
        const buildInfoItems = getBuildInfoItems(followerItems[slot]);
        this.items.push({
          label: slot,
          items: Object.values(buildInfoItems).sort(buildInfoSort),
        });
      });
    }
  }
}
