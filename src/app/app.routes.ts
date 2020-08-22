import { Routes } from "@angular/router";

export const AppRoutes: Routes = [
  {
    path: "",
    loadChildren: "./home/home.module#HomeModule",
  },
];
