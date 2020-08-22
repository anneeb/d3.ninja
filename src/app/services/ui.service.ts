import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { BaseService } from "app/services/base-service";

@Injectable({
  providedIn: 'root'
})
export class UiService extends BaseService {
  private isSidebarOpen = new BehaviorSubject(true);

  constructor() {
    super();
  }

  getIsSidebarOpen() {
    return super.getBehaviorSubjectValue(this.isSidebarOpen);
  }

  setIsSidebarOpen(isSidebarOpen: boolean) {
    return super.setBehaviorSubjectValue(this.isSidebarOpen, isSidebarOpen);
  }
}
