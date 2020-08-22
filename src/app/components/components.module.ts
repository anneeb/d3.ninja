import { NgModule } from "@angular/core";

import { SharedModule } from "app/shared/shared.module";
import { AutocompleteComponent } from "app/components/autocomplete/autocomplete.component";
import { HeaderComponent } from "app/components/header/header.component";
import { IconFabComponent } from "app/components/icon-fab/icon-fab.component";

@NgModule({
  imports: [SharedModule],
  declarations: [
    AutocompleteComponent,
    HeaderComponent,
    IconFabComponent,
  ],
  exports: [
    AutocompleteComponent,
    HeaderComponent,
    IconFabComponent,
  ],
})
export class ComponentsModule {}
