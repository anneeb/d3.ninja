import { NgModule } from "@angular/core";

import { MainModule } from "app/containers/main/main.module";
import { SidebarModule } from "app/containers/sidebar/sidebar.module";

@NgModule({
  imports: [MainModule, SidebarModule],
  declarations: [],
  exports: [MainModule, SidebarModule],
})
export class ContainersModule {}
