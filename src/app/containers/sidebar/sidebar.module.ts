import { NgModule } from "@angular/core";

import { SharedModule } from "app/shared/shared.module";
import { ComponentsModule } from "app/components/components.module";
import { SidebarComponent } from "app/containers/sidebar/sidebar.component";

@NgModule({
  imports: [SharedModule, ComponentsModule],
  declarations: [SidebarComponent],
  exports: [SidebarComponent, ComponentsModule],
})
export class SidebarModule {}
