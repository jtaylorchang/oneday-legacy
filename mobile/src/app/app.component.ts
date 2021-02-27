import { Component } from "@angular/core";
import { Platform } from "ionic-angular";
import { StatusBar, Splashscreen } from "ionic-native";
import { GoogleAnalytics } from "ionic-native";

import { HomePage } from "../pages/home/home";
import "rxjs/add/operator/map";
import { Http } from "@angular/http";
import { Device } from "ionic-native";
import { TabsPage } from "../pages/tabs/tabs";

@Component({
  templateUrl: "app.html",
})
export class MyApp {
  rootPage = TabsPage;
  http: Http;

  constructor(http: Http, platform: Platform) {
    this.http = http;
    platform.ready().then(() => {
      if (platform.is("cordova")) {
        if (platform.is("ios")) {
          this.sendPHPAnalytics(0);
        } else if (platform.is("android")) {
          this.sendPHPAnalytics(1);
        }
      } else {
        this.sendPHPAnalytics(2);
      }
      this.hideSplashScreen();
      StatusBar.styleDefault();
    });
  }

  getDateModFromDate(date): string {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var yearS: string = year.toString();
    var monthS: string;
    var dayS: string;
    console.log(day.toString().length);
    console.log(day.toString());
    if (month.toString().length == 1) {
      monthS = "0" + month.toString();
    } else {
      monthS = month.toString();
    }
    if (day.toString().length == 1) {
      dayS = "0" + day.toString();
    } else {
      dayS = day.toString();
    }
    var mod: string = yearS + "-" + monthS + "-" + dayS;
    return mod;
  }

  sendPHPAnalytics(type) {
    var uuid: string = Device.uuid;
    var dt: string = this.getDateModFromDate(new Date());
    var target: string =
      "https://jefftc.com/oneday/tracker.php?os=" +
      type +
      "&uuid=" +
      uuid +
      "&dt=" +
      dt;
    this.http.get(target).subscribe((data) => {
      console.log("Analytics logged", target);
    });
  }

  initGoogleAnalytics() {
    console.log("Starting tracking data");
    var trackingId = "CHANGE_ME";

    GoogleAnalytics.debugMode();
    GoogleAnalytics.startTrackerWithId(trackingId).then(() => {
      console.log("GoogleAnalytics Initialized with ****** : " + trackingId);

      GoogleAnalytics.enableUncaughtExceptionReporting(true)
        .then((_success) => {
          console.log(
            "GoogleAnalytics enableUncaughtExceptionReporting Enabled."
          );
        })
        .catch((_error) => {
          console.log(
            "GoogleAnalytics Error enableUncaughtExceptionReporting : " + _error
          );
        });
    });
  }

  hideSplashScreen() {
    if (Splashscreen) {
      setTimeout(() => {
        Splashscreen.hide();
      }, 100);
    }
  }
}
