import { Component, OnInit, Input } from "@angular/core";
import classNames from "classnames";
import { StashItem } from "constants/salvage-guide/stash";
import { StashService } from "app/services/stash.service";

@Component({
  selector: "app-builds-card-item",
  templateUrl: "./builds-card-item.component.html",
  styleUrls: ["./builds-card-item.component.scss"],
})
export class BuildsCardItemComponent implements OnInit {
  @Input()
  itemId: string;

  @Input()
  isCube: boolean;

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
          "app-builds-card-item--selected": this.isCube
            ? this.item.isCubeSelected
            : this.item.isSelected,
        }
      );
    });
  }
}
