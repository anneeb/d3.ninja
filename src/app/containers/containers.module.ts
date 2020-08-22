import { NgModule } from "@angular/core";

import { SharedModule } from "app/shared/shared.module";
import { MainComponent } from "app/containers/main/main.component";
import { SidebarComponent } from "app/containers/sidebar/sidebar.component";

@NgModule({
  imports: [SharedModule],
  declarations: [MainComponent, SidebarComponent],
  exports: [MainComponent, SidebarComponent],
})
export class ContainersModule {}
