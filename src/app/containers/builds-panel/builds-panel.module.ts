import { NgModule } from "@angular/core";

import { SharedModule } from "app/shared/shared.module";
import { ComponentsModule } from "app/components/components.module";
import { BuildsPanelComponent } from "app/containers/builds-panel/builds-panel.component";

@NgModule({
  imports: [SharedModule, ComponentsModule],
  declarations: [BuildsPanelComponent],
  exports: [BuildsPanelComponent],
})
export class BuildsPanelModule {}
