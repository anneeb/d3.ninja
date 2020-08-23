import { NgModule } from "@angular/core";

import { BuildDrawerModule } from "app/containers/build-drawer/build-drawer.module";
import { MainModule } from "app/containers/main/main.module";
import { StashDrawerModule } from "app/containers/stash-drawer/stash-drawer.module";

@NgModule({
  imports: [BuildDrawerModule, MainModule, StashDrawerModule],
  declarations: [],
  exports: [BuildDrawerModule, MainModule, StashDrawerModule],
})
export class ContainersModule {}
