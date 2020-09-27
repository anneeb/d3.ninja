import { Component, OnInit } from "@angular/core";
import { BuildsService } from "app/services/builds.service";

@Component({
  selector: "app-builds-cards",
  templateUrl: "./builds-cards.component.html",
  styleUrls: ["./builds-cards.component.scss"],
})
export class BuildsCardsComponent implements OnInit {
  itemIds: string[] = [];
  isSortingItems: boolean;

  constructor(private buildService: BuildsService) {}

  ngOnInit(): void {
    this.buildService.getSortedItems().subscribe((items) => {
      this.itemIds = items;
    });

    this.buildService.getIsSortingItems().subscribe((isSortingItems) => {
      this.isSortingItems = isSortingItems;
    });
  }
}
