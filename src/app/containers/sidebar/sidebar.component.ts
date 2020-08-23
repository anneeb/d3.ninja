import { Component, OnInit } from "@angular/core";

import { StashService, StashItem } from "app/services/stash.service";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  headerText = "Stash";
  items: StashItem[] = [];

  constructor(private stashService: StashService) {}

  ngOnInit(): void {
    this.stashService.getSelectedItems().subscribe((items) => {
      this.items = items;
    });
  }
}
