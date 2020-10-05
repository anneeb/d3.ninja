import { Component, OnInit } from "@angular/core";
import {
  MatChipListChange,
  MatChipSelectionChange,
} from "@angular/material/chips";
import { MatDialogRef } from "@angular/material/dialog";
import { BuildsService } from "app/services/builds.service";
import {
  defaultBuildSortAndFilter,
  buildSortByOptions,
  buildCharacterOptions,
  buildTagOptions,
  buildToggleOption,
  BuildSortBy,
  BuildToggle,
} from "constants/filters";
import { BuildCharacter } from "constants/salvage-guide/types";

interface DialogOption {
  value: string;
  isSelected: boolean;
}

@Component({
  selector: "app-builds-dialog",
  templateUrl: "./builds-dialog.component.html",
  styleUrls: ["./builds-dialog.component.scss"],
})
export class BuildsDialogComponent implements OnInit {
  sortByOptions: DialogOption[] = [];
  characterOptions: DialogOption[] = [];
  tagOptions: DialogOption[] = [];
  variationOptions: DialogOption[] = [];
  outdatedOptions: DialogOption[] = [];

  constructor(
    private buildService: BuildsService,
    private dialogRef: MatDialogRef<BuildsDialogComponent>
  ) {
    this.setDialogValues(defaultBuildSortAndFilter);
  }

  ngOnInit(): void {
    this.buildService.getSortAndFilter().subscribe((sortAndFilter) => {
      this.setDialogValues(sortAndFilter);
    });
  }

  setDialogValues({
    sortBy,
    characters,
    tags,
    variation,
    outdated,
  } = defaultBuildSortAndFilter) {
    this.sortByOptions = buildSortByOptions.map((value) => ({
      value,
      isSelected: value === sortBy,
    }));

    this.characterOptions = buildCharacterOptions.map((value) => ({
      value,
      isSelected: characters.includes(value),
    }));

    this.tagOptions = buildTagOptions.map((value) => ({
      value,
      isSelected: tags.includes(value),
    }));

    this.variationOptions = buildToggleOption.map((value) => ({
      value,
      isSelected: variation.includes(value),
    }));

    this.outdatedOptions = buildToggleOption.map((value) => ({
      value,
      isSelected: outdated.includes(value),
    }));
  }

  handleOptionChange = (
    event: MatChipSelectionChange,
    optionType:
      | "sortByOptions"
      | "characterOptions"
      | "tagOptions"
      | "variationOptions"
      | "outdatedOptions",
    optionValue: string
  ) => {
    if (
      this[optionType].find(({ value }) => value === optionValue).isSelected !==
      event.selected
    ) {
      this[optionType] = this[optionType].map(({ value, isSelected }) => ({
        value,
        isSelected: value === optionValue ? event.selected : isSelected,
      }));
    }
  };

  handleApplyClick = () => {
    this.buildService.updateSortAndFilter({
      sortBy: this.sortByOptions.find(({ isSelected }) => isSelected)
        .value as BuildSortBy,
      characters: this.characterOptions
        .filter(({ isSelected }) => isSelected)
        .map(({ value }) => value as BuildCharacter),
      tags: this.tagOptions
        .filter(({ isSelected }) => isSelected)
        .map(({ value }) => value),
      variation: this.variationOptions
        .filter(({ isSelected }) => isSelected)
        .map(({ value }) => value as BuildToggle),
      outdated: this.outdatedOptions
        .filter(({ isSelected }) => isSelected)
        .map(({ value }) => value as BuildToggle),
    });
    this.dialogRef.close();
  };

  handleCancelClick = () => {
    this.dialogRef.close();
  };
}
