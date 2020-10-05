import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { BuildsDialogComponent } from "app/components/builds-dialog/builds-dialog.component";

@Component({
  selector: "app-builds-panel",
  templateUrl: "./builds-panel.component.html",
  styleUrls: ["./builds-panel.component.scss"],
})
export class BuildsPanelComponent implements OnInit {
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  handleFilterIconClick(): void {
    this.dialog.open(BuildsDialogComponent, {
      width: "500px",
    });
  }
}
