import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { CdkModule } from "app/shared/cdk.module";
import { MaterialModule } from "app/shared/material.module";

@NgModule({
  imports: [CommonModule],
  declarations: [],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CdkModule,
    MaterialModule,
  ],
})
export class SharedModule {}
