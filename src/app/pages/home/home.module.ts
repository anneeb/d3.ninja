import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { HomeRoutes } from "app/pages/home/home.routes";
import { SharedModule } from 'app/shared/shared.module';
import { HomeComponent } from './home.component';

@NgModule({
  imports: [
    RouterModule,
    RouterModule.forChild(HomeRoutes),
    SharedModule,
  ],
  declarations: [HomeComponent],
  exports: [
    RouterModule
  ]
})
export class HomeModule {}
