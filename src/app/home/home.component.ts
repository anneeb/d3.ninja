import { Component, OnInit } from "@angular/core";

import { StashService } from "app/services/stash.service";
import { UiService } from "app/services/ui.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  providers: [StashService, UiService],
})
export class HomeComponent implements OnInit {
  headerColor = "primary";
  headerText = "d3.ninja";

  isSidebarOpen: boolean = true;
  sidebarIcon: string = "chevron_left";

  constructor(private uiService: UiService) {}

  ngOnInit(): void {
    this.uiService.getIsSidebarOpen().subscribe((isSidebarOpen) => {
      this.isSidebarOpen = isSidebarOpen;
      this.sidebarIcon = isSidebarOpen ? "chevron_left" : "chevron_right";
    });
  }

  handleSidebarIconClick = () => {
    this.uiService.setIsSidebarOpen(!this.isSidebarOpen);
  };
}
