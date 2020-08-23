import { NgModule } from "@angular/core";

import { SharedModule } from "app/shared/shared.module";
import { ComponentsModule } from "app/components/components.module";
import { StashDrawerComponent } from "app/containers/stash-drawer/stash-drawer.component";

@NgModule({
  imports: [SharedModule, ComponentsModule],
  declarations: [StashDrawerComponent],
  exports: [StashDrawerComponent],
})
export class StashDrawerModule {}
