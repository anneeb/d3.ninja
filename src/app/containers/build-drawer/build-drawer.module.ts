import { NgModule } from "@angular/core";

import { SharedModule } from "app/shared/shared.module";
import { ComponentsModule } from "app/components/components.module";
import { BuildDrawerComponent } from "app/containers/build-drawer/build-drawer.component";

@NgModule({
  imports: [SharedModule, ComponentsModule],
  declarations: [BuildDrawerComponent],
  exports: [BuildDrawerComponent],
})
export class BuildDrawerModule {}
