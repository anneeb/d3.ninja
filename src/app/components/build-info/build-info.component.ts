import { Component, OnInit } from "@angular/core";
import {
  BuildItemMap,
  GearItems,
  ItemFollowerTag,
  itemFollowerTags,
  heroItemSlots,
} from "constants/builds";
import { StashItem } from "constants/stash";
import { ItemSlot, BuildItemTag } from "constants/salvage-guide/types";
import { BuildsService } from "app/services/builds.service";
import { UiService } from "app/services/ui.service";
import {
  BuildInfoItem,
  BuildInfoSlot,
} from "app/components/build-info-slots/build-info-slots.component";

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
  followerItems: {
    label: string;
    slots: BuildInfoSlot[];
  }[] = null;
  heroItems: BuildInfoSlot[] = null;

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
      isFollower,
      heroItems,
      followersItems,
    } = build;

    this.label = label;
    this.subLabel = subLabel;
    this.link = link;
    this.character = character;
    this.isOutdated = isOutdated;
    this.isVariation = isVariation;

    this.followerItems = null;
    this.heroItems = null;

    if (isFollower) {
      this.character = null;
      this.followerItems = Array.from(itemFollowerTags).map((follower) => {
        const slots = Object.entries(followersItems[follower]).map(
          ([slot, items]: [ItemFollowerTag, GearItems]) => {
            const tagItems: { [itemId: string]: BuildInfoItem } = {};
            Object.entries(items).forEach(
              ([itemTag, itemIds]: [BuildItemTag, string[]]) => {
                itemIds.forEach((itemId) => {
                  if (!tagItems[itemId]) {
                    tagItems[itemId] = {
                      id: itemId,
                      tags: [],
                      isCube: false,
                      isItemSelected: (item: StashItem) => item.isSelected,
                    };
                  }

                  if (!tagItems[itemId].tags.some((tag) => tag === itemTag)) {
                    tagItems[itemId].tags.push(itemTag);
                  }
                });
              }
            );
            return {
              label: slot,
              items: Object.values(tagItems),
            };
          }
        );
        return {
          label: follower,
          slots,
        };
      });
    } else {
      this.heroItems = heroItemSlots.concat(ItemSlot.CUBE).map((slot) => {
        const tagItems: { [itemId: string]: BuildInfoItem } = {};
        Object.entries(heroItems[slot]).forEach(
          ([itemTag, itemIds]: [BuildItemTag, string[]]) => {
            itemIds.forEach((itemId) => {
              if (!tagItems[itemId]) {
                tagItems[itemId] = {
                  id: itemId,
                  tags: [],
                  isCube: slot === ItemSlot.CUBE,
                  isItemSelected: (item: StashItem) =>
                    slot === ItemSlot.CUBE
                      ? item.isCubeSelected
                      : item.isSelected,
                };
              }
              if (!tagItems[itemId].tags.some((tag) => tag === itemTag)) {
                tagItems[itemId].tags.push(itemTag);
              }
            });
          }
        );
        return { label: slot, items: Object.values(tagItems) };
      });
    }
  }
}
