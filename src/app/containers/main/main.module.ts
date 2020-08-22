import { NgModule } from "@angular/core";

import { SharedModule } from "app/shared/shared.module";
import { ComponentsModule } from "app/components/components.module";
import { MainComponent } from "app/containers/main/main.component";

@NgModule({
  imports: [SharedModule, ComponentsModule],
  declarations: [MainComponent],
  exports: [MainComponent]
})
export class MainModule {}
