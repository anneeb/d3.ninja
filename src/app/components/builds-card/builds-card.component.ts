import { Component, OnInit, Input } from "@angular/core";
import { BuildItem } from "constants/salvage-guide/builds";
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

  constructor(
    private buildsService: BuildsService,
    private uiService: UiService
  ) {}

  ngOnInit(): void {
    this.buildsService.getItems().subscribe((itemMap) => {
      this.item = itemMap[this.itemId];
    });
  }

  handleCardClick() {
    this.uiService.setSelectedBuild(this.itemId);
  }
}
