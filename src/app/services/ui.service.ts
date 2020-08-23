import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { BaseService } from "app/services/base-service";

@Injectable({
  providedIn: "root",
})
export class UiService extends BaseService {
  private isStashDrawerOpen = new BehaviorSubject(true);

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
}
