import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { BaseService } from "app/services/base-service";

@Injectable({
  providedIn: "root",
})
export class UiService extends BaseService {
  private isStashDrawerOpen = new BehaviorSubject(true);
  private isBuildDrawerOpen = new BehaviorSubject(false);
  private selectedBuild = new BehaviorSubject("");
  private lastClickedBuild = new BehaviorSubject("");

  constructor() {
    super();
  }

  getIsStashDrawerOpen() {
    return super.getBehaviorSubjectValue(this.isStashDrawerOpen);
  }

  setIsStashDrawerOpen(isStashDrawerOpen: boolean) {
    return super.setBehaviorSubjectValue(
      this.isStashDrawerOpen,
      isStashDrawerOpen
    );
  }

  getIsBuildDrawerOpen() {
    return super.getBehaviorSubjectValue(this.isBuildDrawerOpen);
  }

  setIsBuildDrawerOpen(isBuildDrawerOpen: boolean) {
    return super.setBehaviorSubjectValue(
      this.isBuildDrawerOpen,
      isBuildDrawerOpen
    );
  }

  getSelectedBuild() {
    return super.getBehaviorSubjectValue(this.selectedBuild);
  }

  setSelectedBuild(build: string) {
    return super.setBehaviorSubjectValue(this.selectedBuild, build);
  }

  getLastClickedBuild() {
    return super.getBehaviorSubjectValue(this.lastClickedBuild);
  }

  setLastClickedBuild(build: string) {
    return super.setBehaviorSubjectValue(this.lastClickedBuild, build);
  }
}
