import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { startWith } from "rxjs/operators";
import { BuildsService } from "app/services/builds.service";
import { BuildsDialogComponent } from "app/components/builds-dialog/builds-dialog.component";

@Component({
  selector: "app-builds-panel",
  templateUrl: "./builds-panel.component.html",
  styleUrls: ["./builds-panel.component.scss"],
})
export class BuildsPanelComponent implements OnInit {
  searchControl = new FormControl();
  searchValue: Observable<string>;
  searchIcon: string = "search";

  constructor(private buildsService: BuildsService, private dialog: MatDialog) {
    this.searchValue = this.searchControl.valueChanges.pipe(startWith(""));
  }

  ngOnInit(): void {
    this.searchValue.subscribe((searchValue) => {
      this.handleSearchChange(searchValue);
    });
  }

  handleSearchChange(search: string): void {
    this.searchIcon = search ? "close" : "search";
    this.buildsService.updateSearch(search);
  }

  handleClearSearchClick(): void {
    this.searchControl.setValue("");
  }

  handleFilterIconClick(): void {
    this.dialog.open(BuildsDialogComponent, {
      width: "500px",
    });
  }
}
