import {
  Component,
  OnInit,
  Input,
  ContentChild,
  TemplateRef,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { startWith } from "rxjs/operators";

export interface SelectItem {
  value: string;
}

export interface SelectItemMap {
  [value: string]: SelectItem;
}

@Component({
  selector: "app-select",
  templateUrl: "./select.component.html",
  styleUrls: ["./select.component.scss"],
})
export class SelectComponent implements OnInit {
  @Input()
  placeholder: string;

  @Input()
  items: SelectItem[];

  @Input()
  onFilterChange: (filter: string) => any;

  @Input()
  onItemSelect: (item: SelectItem) => any;

  @ContentChild("item", { static: false }) itemTemplateRef: TemplateRef<any>;

  selectControl = new FormControl();
  filterValue: Observable<string>;

  constructor() {
    this.filterValue = this.selectControl.valueChanges.pipe(startWith(""));
  }

  ngOnInit(): void {
    this.filterValue.subscribe((filterValue) => {
      this.onFilterChange(filterValue);
    });
  }

  handleItemClick(event: Event, item: SelectItem) {
    event.stopPropagation();
    this.onItemSelect(item);
  }
}
