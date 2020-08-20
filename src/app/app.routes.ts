import { Routes } from "@angular/router";

export const AppRoutes: Routes = [
  {
    path: "",
    loadChildren: "./pages/home/home.module#HomeModule",
  },
];
