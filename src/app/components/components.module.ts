import { NgModule } from "@angular/core";

import { SharedModule } from "app/shared/shared.module";
import { BuildInfoComponent } from "app/components/build-info/build-info.component";
import { BuildInfoSlotsComponent } from "app/components/build-info-slots/build-info-slots.component";
import { BuildsCardsComponent } from "app/components/builds-cards/builds-cards.component";
import { BuildsCardComponent } from "app/components/builds-card/builds-card.component";
import { BuildsDialogComponent } from "app/components/builds-dialog/builds-dialog.component";
import { StashItemComponent } from "app/components/stash-item/stash-item.component";
import { StashItemToggleComponent } from "app/components/stash-item-toggle/stash-item-toggle.component";
import { StashListComponent } from "app/components/stash-list/stash-list.component";
import { StashQuickAddComponent } from "app/components/stash-quick-add/stash-quick-add.component";
import { StashQuickAddItemComponent } from "app/components/stash-quick-add-item/stash-quick-add-item.component";

@NgModule({
  imports: [SharedModule],
  declarations: [
    BuildInfoComponent,
    BuildInfoSlotsComponent,
    BuildsCardsComponent,
    BuildsCardComponent,
    BuildsDialogComponent,
    StashItemComponent,
    StashItemToggleComponent,
    StashListComponent,
    StashQuickAddComponent,
    StashQuickAddItemComponent,
  ],
  exports: [
    BuildInfoComponent,
    BuildInfoSlotsComponent,
    BuildsCardsComponent,
    BuildsCardComponent,
    BuildsDialogComponent,
    StashItemComponent,
    StashItemToggleComponent,
    StashListComponent,
    StashQuickAddComponent,
    StashQuickAddItemComponent,
  ],
})
export class ComponentsModule {}
