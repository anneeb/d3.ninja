import { Component, OnInit, Input } from "@angular/core";

import { StashItem } from "constants/stash";
import { UiService } from "app/services/ui.service";

export interface BuildInfoItem {
  id: string;
  tags: string[];
  isCube: boolean;
  isItemSelected: (item: StashItem) => boolean;
}

export interface BuildInfoSlot {
  label: string;
  items: BuildInfoItem[];
}

@Component({
  selector: "app-build-info-slots",
  templateUrl: "./build-info-slots.component.html",
  styleUrls: ["./build-info-slots.component.scss"],
})
export class BuildInfoSlotsComponent implements OnInit {
  @Input()
  slots: BuildInfoSlot[];

  private buildId: string;

  constructor(private uiService: UiService) {}

  ngOnInit(): void {
    this.uiService.getSelectedBuild().subscribe((itemId) => {
      this.buildId = itemId;
    });
  }

  handleStashItemClick = () => {
    this.uiService.setLastClickedBuild(this.buildId);
  };
}
