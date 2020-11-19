import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { first, skip } from "rxjs/operators";
import { BuildsService } from "app/services/builds.service";
import { StashService } from "app/services/stash.service";
import { UiService } from "app/services/ui.service";
import { decodeStashItems, encodeStashItems } from "utils/stash-encoder";

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
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private uiService: UiService,
    private stashService: StashService,
    private buildsService: BuildsService
  ) {}

  ngOnInit(): void {
    this.buildsService.setStashService(this.stashService);

    this.activatedRoute.queryParamMap.pipe(first()).subscribe((paramMap) => {
      const stash = paramMap.get("stash");
      if (stash) {
        const selectedItems = decodeStashItems(stash);
        this.stashService.updateIsItemsSelected(selectedItems);
      }
    });

    this.stashService
      .getItems()
      .pipe(skip(1))
      .subscribe((items) => {
        const stash = encodeStashItems(items);
        this.router.navigate([], {
          relativeTo: this.activatedRoute,
          queryParams: { stash },
        });
      });

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
