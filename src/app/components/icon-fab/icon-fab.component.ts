import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-icon-fab",
  templateUrl: "./icon-fab.component.html",
  styleUrls: ["./icon-fab.component.scss"],
})
export class IconFabComponent implements OnInit {
  @Input()
  icon: string;

  @Input()
  onClick: () => any;

  ngOnInit(): void {}

  handleClick() {
    this.onClick();
  }
}
