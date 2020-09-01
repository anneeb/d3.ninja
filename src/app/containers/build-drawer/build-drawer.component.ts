import { Component, OnInit } from "@angular/core";
import { UiService } from "app/services/ui.service";

@Component({
  selector: "app-build-drawer",
  templateUrl: "./build-drawer.component.html",
  styleUrls: ["./build-drawer.component.scss"],
})
export class BuildDrawerComponent implements OnInit {
  hasSelectedBuild: boolean;

  constructor(private uiService: UiService) {}

  ngOnInit(): void {
    this.uiService.getSelectedBuild().subscribe((buildId) => {
      this.hasSelectedBuild = Boolean(buildId);
    });
  }
}
