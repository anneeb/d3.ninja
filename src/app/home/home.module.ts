import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { HomeRoutes } from "app/home/home.routes";

import { SharedModule } from 'app/shared/shared.module';
import { ComponentsModule } from 'app/components/components.module';
import { ContainersModule } from 'app/containers/containers.module';

import { HomeComponent } from 'app/home/home.component';

@NgModule({
  imports: [
    RouterModule,
    RouterModule.forChild(HomeRoutes),
    SharedModule,
    ContainersModule,
    ComponentsModule,
  ],
  declarations: [HomeComponent],
  exports: [
    RouterModule
  ]
})
export class HomeModule {}
