import { Component } from "@angular/core";

import { AboutMe } from "../about-me/about-me";
import { UserManagement } from "../user-management/user-management";
import { ScheduleMaker } from "../schedule-maker/schedule-maker";

@Component({
  templateUrl: "tabs.html",
})
export class TabsPage {
  tab1Root = UserManagement;
  tab2Root = ScheduleMaker;
  tab3Root = AboutMe;

  constructor() {}
}
