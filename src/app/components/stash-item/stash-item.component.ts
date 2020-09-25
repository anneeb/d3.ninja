import { Component, OnInit, Input } from "@angular/core";
import classNames from "classnames";
import { StashItem } from "constants/salvage-guide/stash";
import { StashService } from "app/services/stash.service";

@Component({
  selector: "app-stash-item",
  templateUrl: "./stash-item.component.html",
  styleUrls: ["./stash-item.component.scss"],
})
export class StashItemComponent implements OnInit {
  @Input()
  itemId: string;

  @Input()
  isClickable?: boolean;

  @Input()
  isCube?: boolean;

  @Input()
  isItemSelected?: (item: StashItem) => boolean;

  @Input()
  showLabel?: boolean;

  item: StashItem;
  className: string;

  constructor(private stashService: StashService) {}

  ngOnInit(): void {
    this.stashService.getItems().subscribe((itemMap) => {
      this.item = itemMap[this.itemId];
      this.className = classNames(
        "app-stash-item",
        `app-stash-item--${this.item.color}`,
        {
          "app-stash-item--selected": this.isItemSelected
            ? this.isItemSelected(this.item)
            : this.item.isSelected || this.item.isCubeSelected,
          "app-stash-item--clickable": this.isClickable,
        }
      );
    });
  }

  handleImageClick() {
    if (this.isClickable) {
      if (this.isCube) {
        this.stashService.updateIsItemSelected(this.itemId, {
          isSelected: this.item.isSelected,
          isCubeSelected: !this.item.isCubeSelected,
        });
      } else {
        this.stashService.updateIsItemSelected(this.itemId, {
          isSelected: !this.item.isSelected,
          isCubeSelected: this.item.isCubeSelected,
        });
      }
    }
  }
}
