import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HeaderModule } from "./components/header/header.module";

@NgModule({
  imports: [CommonModule],
  declarations: [],
  exports: [CommonModule, FormsModule, HeaderModule],
})
export class SharedModule {}
