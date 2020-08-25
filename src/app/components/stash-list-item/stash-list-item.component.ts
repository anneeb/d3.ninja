import { Component, OnInit, Input } from "@angular/core";
import { StashService, StashItem } from "app/services/stash.service";

@Component({
  selector: "app-stash-list-item",
  templateUrl: "./stash-list-item.component.html",
  styleUrls: ["./stash-list-item.component.scss"],
})
export class StashListItemComponent implements OnInit {
  @Input()
  itemId: string;

  item: StashItem;

  constructor(private stashService: StashService) {}

  ngOnInit(): void {
    this.stashService.getItems().subscribe((itemMap) => {
      this.item = itemMap[this.itemId];
    });
  }
}
