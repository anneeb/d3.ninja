import { Component, OnInit } from "@angular/core";

import { StashService, StashItem } from "app/services/stash.service";

@Component({
  selector: "app-stash-list",
  templateUrl: "./stash-list.component.html",
  styleUrls: ["./stash-list.component.scss"],
})
export class StashListComponent implements OnInit {
  items: StashItem[] = [];

  constructor(private stashService: StashService) {}

  ngOnInit(): void {
    this.stashService.getSelectedItems().subscribe((items) => {
      this.items = items;
    });
  }
}
