import { NgModule } from "@angular/core";

import { SharedModule } from "app/shared/shared.module";
import { BuildInfoComponent } from "app/components/build-info/build-info.component";
import { BuildsCardsComponent } from "app/components/builds-cards/builds-cards.component";
import { BuildsCardComponent } from "app/components/builds-card/builds-card.component";
import { BuildsCardItemComponent } from "app/components/builds-card-item/builds-card-item.component";
import { StashListComponent } from "app/components/stash-list/stash-list.component";
import { StashListItemComponent } from "app/components/stash-list-item/stash-list-item.component";
import { StashQuickAddComponent } from "app/components/stash-quick-add/stash-quick-add.component";
import { StashQuickAddItemComponent } from "app/components/stash-quick-add-item/stash-quick-add-item.component";

@NgModule({
  imports: [SharedModule],
  declarations: [
    BuildInfoComponent,
    BuildsCardsComponent,
    BuildsCardComponent,
    BuildsCardItemComponent,
    StashListComponent,
    StashListItemComponent,
    StashQuickAddComponent,
    StashQuickAddItemComponent,
  ],
  exports: [
    BuildInfoComponent,
    BuildsCardsComponent,
    BuildsCardComponent,
    BuildsCardItemComponent,
    StashListComponent,
    StashListItemComponent,
    StashQuickAddComponent,
    StashQuickAddItemComponent,
  ],
})
export class ComponentsModule {}
