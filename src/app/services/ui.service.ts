import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { BaseService } from "app/services/base-service";

@Injectable({
  providedIn: "root",
})
export class UiService extends BaseService {
  private isStashDrawerOpen = new BehaviorSubject(true);
  private selectedBuild = new BehaviorSubject("");

  constructor() {
    super();
  }

  getisStashDrawerOpen() {
    return super.getBehaviorSubjectValue(this.isStashDrawerOpen);
  }

  setisStashDrawerOpen(isStashDrawerOpen: boolean) {
    return super.setBehaviorSubjectValue(
      this.isStashDrawerOpen,
      isStashDrawerOpen
    );
  }

  getSelectedBuild() {
    return super.getBehaviorSubjectValue(this.selectedBuild);
  }

  setSelectedBuild(build: string) {
    return super.setBehaviorSubjectValue(this.selectedBuild, build);
  }
}
