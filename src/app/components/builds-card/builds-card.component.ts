import { Component, OnInit, Input } from "@angular/core";
import classNames from "classnames";
import { StashItem } from "constants/salvage-guide/stash";
import { BuildItem, BuildIcon } from "constants/salvage-guide/builds";
import { BuildsService } from "app/services/builds.service";
import { UiService } from "app/services/ui.service";

@Component({
  selector: "app-builds-card",
  templateUrl: "./builds-card.component.html",
  styleUrls: ["./builds-card.component.scss"],
})
export class BuildsCardComponent implements OnInit {
  @Input()
  itemId: string;

  item: BuildItem;
  className: string;
  isBuildDrawerOpen: boolean;

  constructor(
    private buildsService: BuildsService,
    private uiService: UiService
  ) {}

  ngOnInit(): void {
    this.buildsService.getItems().subscribe((itemMap) => {
      this.item = itemMap[this.itemId];
    });

    this.uiService.getIsBuildDrawerOpen().subscribe((isBuildDrawerOpen) => {
      this.isBuildDrawerOpen = isBuildDrawerOpen;
    });

    this.uiService.getSelectedBuild().subscribe((selectedBuild) => {
      this.className = classNames("app-builds-card", {
        "app-builds-card--selected": selectedBuild === this.itemId,
      });
    });
  }

  handleBuildItemClick = () => {
    this.uiService.setSelectedBuild(this.itemId);
    if (!this.isBuildDrawerOpen) {
      this.uiService.setIsBuildDrawerOpen(!this.isBuildDrawerOpen);
    }
  };

  handleStashItemClick = () => {
    this.uiService.setLastClickedBuild(this.itemId);
  };

  isItemSelected(icon: BuildIcon) {
    return (item: StashItem) =>
      icon.isCube ? item.isCubeSelected : item.isSelected;
  }
}
