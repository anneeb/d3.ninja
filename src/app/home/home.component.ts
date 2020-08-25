import { Component, OnInit } from "@angular/core";

import { BuildsService } from "app/services/builds.service";
import { StashService } from "app/services/stash.service";
import { UiService } from "app/services/ui.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  providers: [UiService, StashService, BuildsService],
})
export class HomeComponent implements OnInit {
  isStashDrawerOpen: boolean = true;
  isBuildDrawerOpen: boolean = true;
  sidebarIcon: string = "chevron_left";

  constructor(
    private uiService: UiService,
    private stashService: StashService,
    private buildService: BuildsService
  ) {}

  ngOnInit(): void {
    this.buildService.setStashService(this.stashService);

    this.uiService.getisStashDrawerOpen().subscribe((isStashDrawerOpen) => {
      this.isStashDrawerOpen = isStashDrawerOpen;
      this.sidebarIcon = isStashDrawerOpen ? "chevron_left" : "chevron_right";
    });
  }

  handleSidebarIconClick = () => {
    this.uiService.setisStashDrawerOpen(!this.isStashDrawerOpen);
  };
}
