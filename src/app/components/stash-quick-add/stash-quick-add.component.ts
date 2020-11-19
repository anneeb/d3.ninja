import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { startWith } from "rxjs/operators";
import { StashService } from "app/services/stash.service";

@Component({
  selector: "app-stash-quick-add",
  templateUrl: "./stash-quick-add.component.html",
  styleUrls: ["./stash-quick-add.component.scss"],
})
export class StashQuickAddComponent implements OnInit {
  itemIds: string[] = [];
  searchControl = new FormControl();
  searchValue: Observable<string>;
  searchIcon: string = "search";

  constructor(private stashService: StashService) {
    this.searchValue = this.searchControl.valueChanges.pipe(startWith(""));
  }

  ngOnInit(): void {
    this.searchValue.subscribe((searchValue) => {
      this.handleSearchChange(searchValue);
    });

    this.stashService.getFilteredItems().subscribe((items) => {
      this.itemIds = items;
    });
  }

  handleClearSearchClick(): void {
    this.searchControl.setValue("");
  }

  handleSearchChange = (search: string) => {
    this.searchIcon = search ? "close" : "search";
    this.stashService.updateSearch(search);
  };
}
