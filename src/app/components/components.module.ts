import { NgModule } from "@angular/core";

import { SharedModule } from "app/shared/shared.module";

import { HeaderComponent } from "app/components/header/header.component";
import { IconFabComponent } from "app/components/icon-fab/icon-fab.component";

@NgModule({
  imports: [SharedModule],
  declarations: [HeaderComponent, IconFabComponent],
  exports: [HeaderComponent, IconFabComponent],
})
export class ComponentsModule {}
