import { Component, OnInit } from "@angular/core";

import { Item } from "constants/salvage-guide/types";
import { StashService, StashItem } from "app/services/stash.service";

function itemFilter(value: string) {
  return (item: Item) => item.label.match(new RegExp(value, "gi"));
}

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
  providers: [StashService],
})
export class SidebarComponent implements OnInit {
  headerText = "Stash";
  placeholder = "Quick add items...";
  allItems: StashItem[];
  filteredItems: StashItem[];
  selectedItems: StashItem[] = [];
  filterValue: string = "";

  constructor(private stashService: StashService) {}

  ngOnInit(): void {
    this.stashService.getItems().subscribe((items) => {
      this.allItems = Object.values(items);
      this.filteredItems = Object.values(this.allItems).filter(
        itemFilter(this.filterValue)
      );
      this.selectedItems = Object.values(this.allItems).filter(
        (item) => item.isSelected
      );
    });

    this.stashService.getFilter().subscribe((filterValue) => {
      this.filterValue = filterValue;
      this.filteredItems = Object.values(this.allItems).filter(
        itemFilter(this.filterValue)
      );
    });
  }

  handleItemSelect = (item: StashItem) => {
    this.stashService.setIsItemSelcted(item);
  };

  handleFilterChange = (filter: string) => {
    this.stashService.setFilter(filter);
  };
}
