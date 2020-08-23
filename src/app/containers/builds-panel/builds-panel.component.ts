import { Component, OnInit } from "@angular/core";

import { BuildsService, BuildItem } from "app/services/builds.service";

@Component({
  selector: "app-builds-panel",
  templateUrl: "./builds-panel.component.html",
  styleUrls: ["./builds-panel.component.scss"],
})
export class BuildsPanelComponent implements OnInit {
  items: BuildItem[] = [];

  constructor(private buildService: BuildsService) {}

  ngOnInit(): void {
    this.buildService.getSortedItems().subscribe((items) => {
      this.items = items;
    });
  }
}
