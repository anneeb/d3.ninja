import classNames from "classnames";
import { Component, OnInit, Input } from "@angular/core";
import { StashService, StashItem } from "app/services/stash.service";

@Component({
  selector: "app-builds-card-item",
  templateUrl: "./builds-card-item.component.html",
  styleUrls: ["./builds-card-item.component.scss"],
})
export class BuildsCardItemComponent implements OnInit {
  @Input()
  itemId: string;
  item: StashItem;

  className: string;

  constructor(private stashService: StashService) {}

  ngOnInit(): void {
    this.stashService.getItems().subscribe((itemMap) => {
      this.item = itemMap[this.itemId];
      this.className = classNames(
        "app-builds-card-item",
        `app-builds-card-item--${this.item.color}`,
        {
          "app-builds-card-item--selected": this.item.isSelected,
        }
      );
    });
  }
}