import { Component, OnInit } from "@angular/core";
import { BuildsService } from "app/services/builds.service";
import { StashService } from "app/services/stash.service";
import { UiService } from "app/services/ui.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  isStashDrawerOpen: boolean = true;
  stashIcon: string = "chevron_left";
  isBuildDrawerOpen: boolean = true;
  buildIcon: string = "chevron_right";

  constructor(
    private uiService: UiService,
    private stashService: StashService,
    private buildService: BuildsService
  ) {}

  ngOnInit(): void {
    this.buildService.setStashService(this.stashService);

    this.uiService.getIsStashDrawerOpen().subscribe((isStashDrawerOpen) => {
      this.isStashDrawerOpen = isStashDrawerOpen;
      this.stashIcon = isStashDrawerOpen ? "chevron_left" : "chevron_right";
    });

    this.uiService.getIsBuildDrawerOpen().subscribe((isBuildDrawerOpen) => {
      this.isBuildDrawerOpen = isBuildDrawerOpen;
      this.buildIcon = isBuildDrawerOpen ? "chevron_right" : "chevron_left";
    });
  }

  handleStashIconClick = () => {
    this.uiService.setIsStashDrawerOpen(!this.isStashDrawerOpen);
  };

  handleBuildIconClick = () => {
    this.uiService.setIsBuildDrawerOpen(!this.isBuildDrawerOpen);
  };
}
