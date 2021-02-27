import { Component, ViewChild } from "@angular/core";

import { HomePage } from "../home/home";
import { AboutMePage } from "../about-me/about-me";
import { FriendsPage } from "../friends/friends";
import { UserService } from "../../providers/user-service";
import { Tabs } from "ionic-angular";

@Component({
  templateUrl: "tabs.html",
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = FriendsPage;
  tab2Root: any = HomePage;
  tab3Root: any = AboutMePage;

  @ViewChild("odTabs") tabRef: Tabs;

  constructor(public us: UserService) {}

  ionViewDidEnter() {
    if (this.us.authorized || this.us.bypass) {
      this.tabRef.select(1);
    } else {
      this.tabRef.select(2);
    }
  }
}
