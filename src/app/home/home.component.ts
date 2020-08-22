import { Component, OnInit } from "@angular/core";
import { BehaviorSubjectWrapper } from 'utils/behavior-subject-wrapper';

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  public headerText = "What to Play";

  private _isSidebarOpen: BehaviorSubjectWrapper<boolean>;
  public isSidebarOpen: boolean;

  private _sidebarIcon: BehaviorSubjectWrapper<string>;
  public sidebarIcon: string;

  constructor() {
    this._isSidebarOpen = new BehaviorSubjectWrapper(true);
    this._sidebarIcon = new BehaviorSubjectWrapper("chevron_left");
  }

  ngOnInit(): void {
    this._isSidebarOpen.getValue().subscribe((isSidebarOpen) => {
      this.isSidebarOpen = isSidebarOpen;
    });
    this._sidebarIcon.getValue().subscribe((sidebarIcon) => {
      this.sidebarIcon = sidebarIcon;
    });
  }

  handleSidebarIconClick = () => {
    const isSidebarOpen = !this.isSidebarOpen;
    this._isSidebarOpen.setValue(isSidebarOpen);
    this._sidebarIcon.setValue(isSidebarOpen ? "chevron_left" : "chevron_right");
  };
}
