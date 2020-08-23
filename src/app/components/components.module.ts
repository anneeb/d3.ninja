import { NgModule } from "@angular/core";

import { SharedModule } from "app/shared/shared.module";
import { StashQuickAddComponent } from "app/components/stash-quick-add/stash-quick-add.component";

@NgModule({
  imports: [SharedModule],
  declarations: [StashQuickAddComponent],
  exports: [StashQuickAddComponent],
})
export class ComponentsModule {}
