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
  selectControl = new FormControl();
  filterValue: Observable<string>;

  constructor(private stashService: StashService) {
    this.filterValue = this.selectControl.valueChanges.pipe(startWith(""));
  }

  ngOnInit(): void {
    this.filterValue.subscribe((filterValue) => {
      this.handleFilterChange(filterValue);
    });

    this.stashService.getFilteredItems().subscribe((items) => {
      this.itemIds = items;
    });
  }

  handleFilterChange = (filter: string) => {
    this.stashService.updateFilter(filter);
  };
}
