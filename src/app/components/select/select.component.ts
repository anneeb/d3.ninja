import {
  Component,
  OnInit,
  Input,
  Output,
  ContentChild,
  TemplateRef,
  EventEmitter,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";

export interface SelectItem {
  value: string;
}

@Component({
  selector: "app-select",
  templateUrl: "./select.component.html",
  styleUrls: ["./select.component.scss"],
})
export class SelectComponent<SelectItem> implements OnInit {
  @Input()
  placeholder: string;

  @Input()
  items: SelectItem[];

  @Input()
  itemFilter: (value: string) => (item: SelectItem) => boolean;

  @Input()
  onItemSelect: (item: SelectItem) => any;

  @Output() onFilterItems = new EventEmitter<SelectItem[]>();

  @ContentChild("item", { static: false }) itemTemplateRef: TemplateRef<any>;

  selectControl = new FormControl();
  filteredItems: Observable<SelectItem[]>;
  filterValue: string = "";

  constructor() {
    this.filteredItems = this.selectControl.valueChanges.pipe(
      startWith(""),
      map((items) => (items ? this.filterItems(items) : this.items.slice()))
    );
  }

  private filterItems(filterValue: string): SelectItem[] {
    filterValue = filterValue;
    return this.items.filter(this.itemFilter(filterValue));
  }

  ngOnInit(): void {
    this.filteredItems.subscribe((filteredItems) => {
      this.onFilterItems.emit(filteredItems);
    });
  }

  handleItemClick(event: Event, item: SelectItem) {
    event.stopPropagation();
    this.onItemSelect(item);
  }
}
