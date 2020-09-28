import { Component, OnInit } from "@angular/core";
import { StashItem } from "constants/salvage-guide/stash";
import { BuildItemMap, HeroItemSlots } from "constants/salvage-guide/builds";
import { ItemSlot, BuildItemTag } from "constants/salvage-guide/types";
import { BuildsService } from "app/services/builds.service";
import { UiService } from "app/services/ui.service";

type BuildInfoTag = { label: string; color: string };
type BuildInfoItem = {
  id: string;
  tags: BuildInfoTag[];
  isCube: boolean;
  isItemSelected: (item: StashItem) => boolean;
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
  itemHeaders: {
    label: string;
    items: BuildInfoItem[];
  }[] = [];

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

    if (isFollower) {
    } else {
      this.itemHeaders = HeroItemSlots.concat(ItemSlot.CUBE).map((slot) => {
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

              if (!tagItems[itemId].tags.some((tag) => tag.label === itemTag)) {
                tagItems[itemId].tags.push({ label: itemTag, color: "" });
              }
            });
          }
        );

        return { label: slot, items: Object.values(tagItems) };
      });
    }
  }

  handleStashItemClick = () => {
    this.uiService.setLastClickedBuild(this.buildId);
  };
}
