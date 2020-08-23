import { Component, OnInit } from "@angular/core";
import { itemsByLink } from "constants/salvage-guide/salvage-guide";
import { Item } from "constants/salvage-guide/types";

interface SalvageGuideItem {
  value: string;
  label: string;
}

const salvageGuideItems = Object.values(itemsByLink).map<SalvageGuideItem>(
  (item: Item) => ({
    value: item.link,
    label: item.label,
  })
);

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  headerText = "Stash";
  placeholder = "Quick add items...";
  items = salvageGuideItems;
  filteredItems = salvageGuideItems;

  filter = (value: string) => (item: Item) =>
    item.label.match(new RegExp(value, "gi"));

  constructor() {}

  ngOnInit(): void {}

  handleFilterItems = (filteredItems: SalvageGuideItem[]) => {
    this.filteredItems = filteredItems;
  };

  handleItemSelect = (item: SalvageGuideItem) => {
    console.log("selected", item);
  };
}
