import { Component, OnInit, Input } from "@angular/core";
import { StashItem } from "constants/stash";
import { StashService } from "app/services/stash.service";

@Component({
  selector: "app-stash-quick-add-item",
  templateUrl: "./stash-quick-add-item.component.html",
  styleUrls: ["./stash-quick-add-item.component.scss"],
})
export class StashQuickAddItemComponent implements OnInit {
  @Input()
  itemId: string;
  item: StashItem;

  constructor(private stashService: StashService) {}

  ngOnInit(): void {
    this.stashService.getItems().subscribe((itemMap) => {
      this.item = itemMap[this.itemId];
    });
  }

  handleItemClick = (event: Event) => {
    event.stopPropagation();
    this.stashService.updateIsItemSelected(this.itemId);
  };

  handleCheckboxClick = (event: Event) => {
    event.preventDefault();
  };
}
