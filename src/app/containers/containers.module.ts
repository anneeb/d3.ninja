import { NgModule } from "@angular/core";

import { SidebarModule } from "app/containers/sidebar/sidebar.module";
import { MainModule } from "app/containers/main/main.module";

@NgModule({
  imports: [MainModule, SidebarModule],
  declarations: [],
  exports: [MainModule, SidebarModule],
})
export class ContainersModule {}
