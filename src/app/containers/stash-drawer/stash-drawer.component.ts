import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-stash",
  templateUrl: "./stash-drawer.component.html",
  styleUrls: ["./stash-drawer.component.scss"],
})
export class StashDrawerComponent implements OnInit {
  headerText = "Stash";

  constructor() {}

  ngOnInit(): void {}
}
