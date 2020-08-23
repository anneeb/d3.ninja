import { NgModule } from "@angular/core";

import { SharedModule } from "app/shared/shared.module";
import { StashListComponent } from "./stash-list/stash-list.component";
import { StashQuickAddComponent } from "app/components/stash-quick-add/stash-quick-add.component";

@NgModule({
  imports: [SharedModule],
  declarations: [StashListComponent, StashQuickAddComponent],
  exports: [StashListComponent, StashQuickAddComponent],
})
export class ComponentsModule {}
