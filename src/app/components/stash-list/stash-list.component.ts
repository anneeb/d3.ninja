import { Component, OnInit } from "@angular/core";
import { StashService } from "app/services/stash.service";

@Component({
  selector: "app-stash-list",
  templateUrl: "./stash-list.component.html",
  styleUrls: ["./stash-list.component.scss"],
})
export class StashListComponent implements OnInit {
  itemIds: string[] = [];

  constructor(private stashService: StashService) {}

  ngOnInit(): void {
    this.stashService.getSelectedItems().subscribe((items) => {
      this.itemIds = items.map((item) => item.id);
    });
  }
}
