import { Component, OnInit, Input } from "@angular/core";
import { StashService } from "app/services/stash.service";

type StashToggleValue = "Stash" | "Cube" | "Both" | "";

@Component({
  selector: "app-stash-item-toggle",
  templateUrl: "./stash-item-toggle.component.html",
  styleUrls: ["./stash-item-toggle.component.scss"],
})
export class StashItemToggleComponent implements OnInit {
  @Input()
  itemId: string;

  value: StashToggleValue;

  constructor(private stashService: StashService) {}

  ngOnInit(): void {
    this.stashService.getItems().subscribe((itemMap) => {
      const item = itemMap[this.itemId];
      this.value =
        item.isSelected && item.isCubeSelected
          ? "Both"
          : item.isSelected
          ? "Stash"
          : item.isCubeSelected
          ? "Cube"
          : "";
    });
  }

  handleTagClick(event: Event) {
    event.stopPropagation();
    switch (this.value) {
      case "Stash": {
        this.stashService.updateIsItemSelected(this.itemId, {
          isSelected: false,
          isCubeSelected: true,
        });
        break;
      }
      case "Cube": {
        this.stashService.updateIsItemSelected(this.itemId, {
          isSelected: true,
          isCubeSelected: true,
        });
        break;
      }
      case "Both": {
        this.stashService.updateIsItemSelected(this.itemId, {
          isSelected: true,
          isCubeSelected: false,
        });
        break;
      }
    }
  }
}
