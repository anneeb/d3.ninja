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

export interface AutocompelteItem {
  value: string;
}

@Component({
  selector: "app-autocomplete",
  templateUrl: "./autocomplete.component.html",
  styleUrls: ["./autocomplete.component.scss"],
})
export class AutocompleteComponent<AutocompelteItem> implements OnInit {
  @Input()
  placeholder: string;

  @Input()
  items: AutocompelteItem[];

  @Input()
  itemFilter: (value: string) => (item: AutocompelteItem) => boolean;

  @Output() onFilterItems = new EventEmitter<AutocompelteItem[]>();

  @ContentChild("item", { static: false }) itemTemplateRef: TemplateRef<
    any
  >;

  selectControl = new FormControl();
  filteredItems: Observable<AutocompelteItem[]>;

  constructor() {
    console.log("constructor select", this.items);
    this.filteredItems = this.selectControl.valueChanges.pipe(
      startWith(""),
      map((items) => (items ? this.filterItems(items) : this.items.slice()))
    );
  }

  private filterItems(value: string): AutocompelteItem[] {
    return this.items.filter(this.itemFilter(value));
  }

  ngOnInit(): void {
    console.log("init");
    this.filteredItems.subscribe((filteredItems) => {
      console.log("filteredItems", filteredItems);
      this.onFilterItems.emit(filteredItems);
    });
  }
}
