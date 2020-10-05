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
  buildToggleOptions,
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
      isSelected:
        characters.length === buildCharacterOptions.length
          ? false
          : characters.includes(value),
    }));

    this.tagOptions = buildTagOptions.map((value) => ({
      value,
      isSelected:
        tags.length === buildTagOptions.length ? false : tags.includes(value),
    }));

    this.variationOptions = buildToggleOptions.map((value) => ({
      value,
      isSelected:
        variation.length === buildToggleOptions.length
          ? false
          : variation.includes(value),
    }));

    this.outdatedOptions = buildToggleOptions.map((value) => ({
      value,
      isSelected:
        outdated.length === buildToggleOptions.length
          ? false
          : outdated.includes(value),
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
    this[optionType].find(({ value }) => value === optionValue).isSelected =
      event.selected;
    // if (
    //   option.isSelected !==
    //   event.selected
    // ) {
    //   option.isSelected =
    //   this[optionType] = this[optionType].map(({ value, isSelected }) => ({
    //     value,
    //     isSelected: value === optionValue ? event.selected : isSelected,
    //   }));
    // }
  };

  handleApplyClick = () => {
    this.buildService.updateSortAndFilter({
      sortBy: this.sortByOptions.find(({ isSelected }) => isSelected)
        .value as BuildSortBy,
      characters: this.characterOptions.some(({ isSelected }) => isSelected)
        ? this.characterOptions
            .filter(({ isSelected }) => isSelected)
            .map(({ value }) => value as BuildCharacter)
        : buildCharacterOptions,
      tags: this.tagOptions.some(({ isSelected }) => isSelected)
        ? this.tagOptions
            .filter(({ isSelected }) => isSelected)
            .map(({ value }) => value)
        : buildTagOptions,
      variation: this.variationOptions.some(({ isSelected }) => isSelected)
        ? this.variationOptions
            .filter(({ isSelected }) => isSelected)
            .map(({ value }) => value as BuildToggle)
        : buildToggleOptions,
      outdated: this.outdatedOptions.some(({ isSelected }) => isSelected)
        ? this.outdatedOptions
            .filter(({ isSelected }) => isSelected)
            .map(({ value }) => value as BuildToggle)
        : buildToggleOptions,
    });
    this.dialogRef.close();
  };

  handleCancelClick = () => {
    this.dialogRef.close();
  };
}
