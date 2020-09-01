import { Component, OnInit, Input } from "@angular/core";
import {
  BuildItem,
  BuildItemMap,
  HeroItemSlots,
  FollowerTags,
} from "constants/salvage-guide/builds";
import { BuildsService } from "app/services/builds.service";
import { UiService } from "app/services/ui.service";
import { ItemSlot, BuildItemTag } from "constants/salvage-guide/types";
import { StashService } from "app/services/stash.service";
import { StashItemMap, StashItem } from "constants/salvage-guide/stash";

type BuildSlotItem = Pick<
  StashItem,
  "label" | "link" | "color" | "isSelected"
> & {
  tags: { label: string; color: string }[];
};

@Component({
  selector: "app-build-info",
  templateUrl: "./build-info.component.html",
  styleUrls: ["./build-info.component.scss"],
})
export class BuildInfoComponent implements OnInit {
  label: string;
  character: string;
  isOutdated: boolean;
  isVariation: boolean;
  itemHeaders: {
    label: string;
    items: BuildSlotItem[];
  }[] = [];

  private buildId: string;
  private buildMap: BuildItemMap;
  private stashMap: StashItemMap;

  constructor(
    private stashService: StashService,
    private buildsService: BuildsService,
    private uiService: UiService
  ) {}

  ngOnInit(): void {
    this.stashService.getItems().subscribe((itemMap) => {
      this.stashMap = itemMap;
      this.updateItemInfo();
    });

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
      character,
      isOutdated,
      isVariation,
      isFollower,
      heroItems,
      followersItems,
    } = build;

    this.label = label;
    this.character = character;
    this.isOutdated = isOutdated;
    this.isVariation = isVariation;

    if (isFollower) {
    } else {
      this.itemHeaders = HeroItemSlots.concat(ItemSlot.CUBE).map((slot) => {
        const tagItems: { [itemId: string]: BuildSlotItem } = {};

        Object.entries(heroItems[slot]).forEach(
          ([itemTag, itemIds]: [BuildItemTag, string[]]) => {
            itemIds.forEach((itemId) => {
              const item = this.stashMap[itemId];
              if (!tagItems[itemId]) {
                tagItems[itemId] = {
                  label: item.label,
                  link: item.link,
                  color: item.color,
                  isSelected: item.isSelected,
                  tags: [],
                };
              }

              if (!tagItems[itemId].tags.some((tag) => tag.label === itemTag)) {
                tagItems[itemId].tags.push({ label: itemTag, color: "" });
              }
            });
          }
        );

        return { label: slot.toUpperCase(), items: Object.values(tagItems) };
      });
    }
  }
}
