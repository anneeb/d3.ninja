import { Routes } from "@angular/router";

import { HomeComponent } from 'app/home/home.component';

export const HomeRoutes: Routes = [
  {
    path: "",
    pathMatch: "full",
    component: HomeComponent
  },
];
