import { Component, OnInit, Input } from "@angular/core";
import classNames from "classnames";
import { StashItem } from "constants/salvage-guide/stash";
import { StashService } from "app/services/stash.service";

@Component({
  selector: "app-stash-list-item",
  templateUrl: "./stash-list-item.component.html",
  styleUrls: ["./stash-list-item.component.scss"],
})
export class StashListItemComponent implements OnInit {
  @Input()
  itemId: string;

  item: StashItem;
  className: string;

  constructor(private stashService: StashService) {}

  ngOnInit(): void {
    this.stashService.getItems().subscribe((itemMap) => {
      this.item = itemMap[this.itemId];
      this.className = classNames(
        "app-stash-list-item",
        `app-stash-list-item--${this.item.color}`,
        {
          "app-stash-list-item--selected": this.item.isSelected,
        }
      );
    });
  }
}
