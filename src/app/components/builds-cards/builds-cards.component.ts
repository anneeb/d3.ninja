import { Component, OnInit } from "@angular/core";
import { BuildsService } from "app/services/builds.service";
import { UiService } from "app/services/ui.service";

@Component({
  selector: "app-builds-cards",
  templateUrl: "./builds-cards.component.html",
  styleUrls: ["./builds-cards.component.scss"],
})
export class BuildsCardsComponent implements OnInit {
  hasItems: boolean = true;
  itemIds: string[] = [];
  isProcessingItems: boolean;
  scrollElementId: string;

  constructor(
    private buildService: BuildsService,
    private uiService: UiService
  ) {}

  ngOnInit(): void {
    this.buildService.getProcessedItems().subscribe((items) => {
      this.hasItems = Boolean(items.length);
      this.itemIds = items;

      if (this.scrollElementId) {
        this.scrollElementIntoView();
      }
    });

    this.buildService.getIsProcessingItems().subscribe((isProcessingItems) => {
      this.isProcessingItems = isProcessingItems;
    });

    this.uiService.getLastClickedBuild().subscribe((buildId) => {
      if (buildId) {
        this.scrollElementId = `app-builds-card__${buildId}`;
      }
    });
  }

  scrollElementIntoView() {
    const element = document.getElementById(this.scrollElementId);
    const elementRect = element.getBoundingClientRect();
    const elementTop = elementRect.top;
    const elementBottom = elementRect.bottom;

    const container = document.getElementsByClassName("app-builds-cards")[0];
    const containerTop = container.scrollTop;
    const containerBottom = containerTop + container.clientHeight;

    const isInView =
      (elementTop < containerTop && elementBottom > containerTop) ||
      (elementTop > containerTop && elementTop < containerBottom);
    if (!isInView) {
      requestAnimationFrame(() => element.scrollIntoView());
    }
  }
}
