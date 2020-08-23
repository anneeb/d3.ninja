import { NgModule } from "@angular/core";

import { BuildDrawerModule } from "app/containers/build-drawer/build-drawer.module";
import { BuildsPanelModule } from "app/containers/builds-panel/builds-panel.module";
import { StashDrawerModule } from "app/containers/stash-drawer/stash-drawer.module";

@NgModule({
  imports: [BuildDrawerModule, BuildsPanelModule, StashDrawerModule],
  declarations: [],
  exports: [BuildDrawerModule, BuildsPanelModule, StashDrawerModule],
})
export class ContainersModule {}
