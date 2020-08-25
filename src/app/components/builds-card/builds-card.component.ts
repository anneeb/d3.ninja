import { Component, OnInit, Input } from "@angular/core";
import { BuildsService, BuildItem } from "app/services/builds.service";

@Component({
  selector: "app-builds-card",
  templateUrl: "./builds-card.component.html",
  styleUrls: ["./builds-card.component.scss"],
})
export class BuildsCardComponent implements OnInit {
  @Input()
  itemId: string;

  item: BuildItem;

  constructor(private buildsService: BuildsService) {}

  ngOnInit(): void {
    this.buildsService.getItems().subscribe((itemMap) => {
      this.item = itemMap[this.itemId];
    });
  }
}
