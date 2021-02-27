import { Component } from "@angular/core";
import {
  NavController,
  Platform,
  ModalController,
  Segment,
  SegmentButton,
  ToastController,
  LoadingController,
  ActionSheetController,
} from "ionic-angular";
import { File } from "ionic-native";
import { Http } from "@angular/http";
import { ClassEditorPage } from "../class-editor/class-editor";
import { LocalNotifications, Transfer } from "ionic-native";
import { Sql } from "../providers/Sql";
import { UserService } from "../../providers/user-service";
import "rxjs/add/operator/map";
import { AlertController } from "ionic-angular";

declare var cordova: any;

@Component({
  selector: "page-home",
  templateUrl: "home.html",
})
export class HomePage {
  localReqVersion: string = "5.0"; //TODO

  public loader: any;

  jsonSource: string;
  jsonWebBase: string = "https://jefftc.com/oneday/us/getSchedule.php"; //"https://jefftc.com/schedule.json?rd=";
  showingFriendSchedule: boolean = false;
  friendName: string = "You";
  needsOverwrite: boolean = false;
  //jsonLocal : string = "./ext/schedule.json";
  daySeg: any;
  daySegCurrent: any;
  isMondaySeg: any = false;
  isTuesdaySeg: any = false;
  isWednesdaySeg: any = false;
  isThursdaySeg: any = false;
  isFridaySeg: any = false;
  isMonday2Seg: any = false;
  todaysDate: Date;
  lunchSetup: any;
  readyMigrate: boolean = false;
  readyTable: boolean = false;
  lettersAll = [];
  notificationArray = [];
  STYLE_COLOR_DARK = "#553A41";
  STYLE_COLOR_GREEN = "#76ab77";
  STYLE_COLOR_LIGHT = "#FFFFFF";
  STYLE_COLOR_UNDER = "#6a9a6b";
  ASTYLE_SEG_MON = "";
  ASTYLE_SEG_TUES = "";
  ASTYLE_SEG_WED = "";
  ASTYLE_SEG_THURS = "";
  ASTYLE_SEG_FRI = "";
  ASTYLE_SEG_MONB = "";
  lunchNumberSet: number = 4;
  localJSONVersion: string;
  webJSONVersion: string;
  dateModC: string;
  notifTick: number = 0;
  notifReminder: number = 9;
  FC: boolean = true;
  waitingForJN: boolean = false;
  updatedNew: boolean = false;
  authorized: boolean = false;
  lunchPeriod: string = "X#";
  friendsInLunch1 = [];
  friendsInLunch2 = [];
  friendsInLunch3 = [];
  friendsInLunch4 = [];

  logWebV;
  logLocalV;

  /* PULLED FROM JSON */
  jsonLunch1: string;
  jsonLunch2: string;
  jsonLunch3: string;
  jsonLunch4: string;
  jsonTimeReg;

  /* ONLY FOR DEVELOPMENT BUILD PURPOSES */
  consoleOutputs = ["Console:"];
  consoleNotifOutputs = ["Scheduled:"];
  notifLogOutputs = ["20170215a"];
  jsonLogOutputs = ["20170215a"];
  isDev: boolean = false;
  isSpecialDev: boolean = false;
  isJSONDev: boolean = false;
  sDevTracker: number = 0;
  notifArray1 = [];
  notifArray2 = [];
  /* END DEVELOPMENT BUILD */
  today = {
    date: "YYYY-MM-DD",
    day: "DAYOFWEEK",
    type: "REL",
    number: "#",
    letters: "XXXXXXX",
    name: "",
    category: "",
    lunchNumber: "",
    typeFull: "",
    timeType: "", //R (regular) or I (irregular)
    timeP1: "", //HH:MM-HH:MM
    timeP2: "",
    timeP3: "",
    timeP4: "",
    timeP5: "",
    timeP6: "",
    timeP7: "",
    timeP8: "",
  };
  periods = [
    {
      number: "1",
      letter: "X",
      class: "Tap to change",
      category: "not chosen",
      class1: "Tap to change",
      category1: "not chosen",
      class2: "Tap to change",
      category2: "not chosen",
      class3: "Tap to change",
      category3: "not chosen",
      class4: "Tap to change",
      category4: "not chosen",
      class5: "Tap to change",
      category5: "not chosen",
      class6: "Tap to change",
      category6: "not chosen",
      class7: "Tap to change",
      category7: "not chosen",
      class8: "Tap to change",
      category8: "not chosen",
      isLunch: "0",
      timeStart: "",
      timeEnd: "",
    },
    {
      number: "2",
      letter: "X",
      class: "Tap to change",
      category: "not chosen",
      class1: "Tap to change",
      category1: "not chosen",
      class2: "Tap to change",
      category2: "not chosen",
      class3: "Tap to change",
      category3: "not chosen",
      class4: "Tap to change",
      category4: "not chosen",
      class5: "Tap to change",
      category5: "not chosen",
      class6: "Tap to change",
      category6: "not chosen",
      class7: "Tap to change",
      category7: "not chosen",
      class8: "Tap to change",
      category8: "not chosen",
      isLunch: "0",
      timeStart: "",
      timeEnd: "",
    },
    {
      number: "3",
      letter: "X",
      class: "Tap to change",
      category: "not chosen",
      class1: "Tap to change",
      category1: "not chosen",
      class2: "Tap to change",
      category2: "not chosen",
      class3: "Tap to change",
      category3: "not chosen",
      class4: "Tap to change",
      category4: "not chosen",
      class5: "Tap to change",
      category5: "not chosen",
      class6: "Tap to change",
      category6: "not chosen",
      class7: "Tap to change",
      category7: "not chosen",
      class8: "Tap to change",
      category8: "not chosen",
      isLunch: "0",
      timeStart: "",
      timeEnd: "",
    },
    {
      number: "4",
      letter: "X",
      class: "Tap to change",
      category: "not chosen",
      class1: "Tap to change",
      category1: "not chosen",
      class2: "Tap to change",
      category2: "not chosen",
      class3: "Tap to change",
      category3: "not chosen",
      class4: "Tap to change",
      category4: "not chosen",
      class5: "Tap to change",
      category5: "not chosen",
      class6: "Tap to change",
      category6: "not chosen",
      class7: "Tap to change",
      category7: "not chosen",
      class8: "Tap to change",
      category8: "not chosen",
      isLunch: "0",
      timeStart: "",
      timeEnd: "",
    },
    {
      number: "5",
      letter: "X",
      class: "Tap to change",
      category: "not chosen",
      class1: "Tap to change",
      category1: "not chosen",
      class2: "Tap to change",
      category2: "not chosen",
      class3: "Tap to change",
      category3: "not chosen",
      class4: "Tap to change",
      category4: "not chosen",
      class5: "Tap to change",
      category5: "not chosen",
      class6: "Tap to change",
      category6: "not chosen",
      class7: "Tap to change",
      category7: "not chosen",
      class8: "Tap to change",
      category8: "not chosen",
      isLunch: "0",
      timeStart: "",
      timeEnd: "",
    },
    {
      number: "6",
      letter: "X",
      class: "Tap to change",
      category: "not chosen",
      class1: "Tap to change",
      category1: "not chosen",
      class2: "Tap to change",
      category2: "not chosen",
      class3: "Tap to change",
      category3: "not chosen",
      class4: "Tap to change",
      category4: "not chosen",
      class5: "Tap to change",
      category5: "not chosen",
      class6: "Tap to change",
      category6: "not chosen",
      class7: "Tap to change",
      category7: "not chosen",
      class8: "Tap to change",
      category8: "not chosen",
      isLunch: "0",
      timeStart: "",
      timeEnd: "",
    },
    {
      number: "7",
      letter: "X",
      class: "Tap to change",
      category: "not chosen",
      class1: "Tap to change",
      category1: "not chosen",
      class2: "Tap to change",
      category2: "not chosen",
      class3: "Tap to change",
      category3: "not chosen",
      class4: "Tap to change",
      category4: "not chosen",
      class5: "Tap to change",
      category5: "not chosen",
      class6: "Tap to change",
      category6: "not chosen",
      class7: "Tap to change",
      category7: "not chosen",
      class8: "Tap to change",
      category8: "not chosen",
      isLunch: "0",
      timeStart: "",
      timeEnd: "",
    },
    {
      number: "8",
      letter: "X",
      class: "Tap to change",
      category: "not chosen",
      class1: "Tap to change",
      category1: "not chosen",
      class2: "Tap to change",
      category2: "not chosen",
      class3: "Tap to change",
      category3: "not chosen",
      class4: "Tap to change",
      category4: "not chosen",
      class5: "Tap to change",
      category5: "not chosen",
      class6: "Tap to change",
      category6: "not chosen",
      class7: "Tap to change",
      category7: "not chosen",
      class8: "Tap to change",
      category8: "not chosen",
      isLunch: "0",
      timeStart: "",
      timeEnd: "",
    },
  ];
  defaultFriendSchedule = this.periods;
  currentDefaultFriendSchedule = this.periods;
  currentFriendSchedule = this.periods;
  currentFriend: number = 0;

  timeRegularR = [];
  timeRegularWithAPR = [];
  timeLateStartR = [];
  timeEarlyReleaseWithAPR = [];
  timeEarlyReleaseWithoutAPR = [];
  timeEarlyReleaseAllWithoutAPR = [];
  timeMidterm = [];
  http: any;
  data: any;
  dataW: any;
  dataL: any;
  classConfig = [];
  date: string;
  dateMod: string;
  dateModStatic: string;
  tomorrowDateMod: string;
  tomorrowDate: Date;
  receivedClassName1: string;
  receivedClassCategory1: string;
  receivedClassName2: string;
  receivedClassCategory2: string;
  receivedClassName3: string;
  receivedClassCategory3: string;
  receivedClassName4: string;
  receivedClassCategory4: string;
  receivedClassName5: string;
  receivedClassCategory5: string;
  receivedClassName6: string;
  receivedClassCategory6: string;
  receivedClassName7: string;
  receivedClassCategory7: string;
  receivedClassName8: string;
  receivedClassCategory8: string;
  isSchool: boolean = false;
  daysOfWeek = [
    {
      //sunday ignore
      school: "",
      year: "",
      month: "",
      day: "",
    },
    {
      //monday
      school: "",
      year: "",
      month: "",
      day: "",
    },
    {
      //tuesday
      school: "",
      year: "",
      month: "",
      day: "",
    },
    {
      //wednesday
      school: "",
      year: "",
      month: "",
      day: "",
    },
    {
      //thursday
      school: "",
      year: "",
      month: "",
      day: "",
    },
    {
      //friday
      school: "",
      year: "",
      month: "",
      day: "",
    },
    {
      //next monday
      school: "",
      year: "",
      month: "",
      day: "",
    },
  ];
  DAY_SUNDAY: number = 0;
  DAY_MONDAY: number = 1;
  DAY_TUESDAY: number = 2;
  DAY_WEDNESDAY: number = 3;
  DAY_THURSDAY: number = 4;
  DAY_FRIDAY: number = 5;
  DAY_SATURDAY: number = 6;

  weekDataDateMods = [
    {
      //M
      dateMod: "YYYY-MM-DD",
    },
    {
      //T
      dateMod: "YYYY-MM-DD",
    },
    {
      //W
      dateMod: "YYYY-MM-DD",
    },
    {
      //T
      dateMod: "YYYY-MM-DD",
    },
    {
      //F
      dateMod: "YYYY-MM-DD",
    },
    {
      //M
      dateMod: "YYYY-MM-DD",
    },
  ];

  constructor(
    public us: UserService,
    public navCtrl: NavController,
    public platform: Platform,
    http: Http,
    public modalCtrl: ModalController,
    private sql: Sql,
    public ac: AlertController,
    public tc: ToastController,
    public lc: LoadingController,
    public asc: ActionSheetController
  ) {
    console.log("INIT | STARTED");
    this.http = http;
    this.correctTime();

    /*if(this.isDev) {
      sql.query("CREATE TABLE IF NOT EXISTS devData (id INTEGER PRIMARY KEY AUTOINCREMENT, devKey TEXT, devValue TEXT)");
      console.log("Loading dev values");
      this.loadDevValues().then(res => {
        console.log("Load Dev Values success");
        this.devCheckSource();
      }, err => {
        console.log("Load Dev Values error", err);
      });
    }*/
  }

  onClickEdit() {
    console.log("Clicked edit");
    if (this.authorized) {
      let asc = this.asc.create({
        title: "Edit Schedule",
        enableBackdropDismiss: true,
        buttons: [
          {
            text: "A Period",
            icon: "md-school",
            cssClass: "ascBtnEdit",
            handler: () => {
              console.log("User clicked button", "AS-A");
              this.editAvailable("A");
            },
          },
          {
            text: "B Period",
            icon: "md-school",
            cssClass: "ascBtnEdit",
            handler: () => {
              console.log("User clicked button", "AS-B");
              this.editAvailable("B");
            },
          },
          {
            text: "C Period",
            icon: "md-school",
            cssClass: "ascBtnEdit",
            handler: () => {
              console.log("User clicked button", "AS-C");
              this.editAvailable("C");
            },
          },
          {
            text: "D Period",
            icon: "md-school",
            cssClass: "ascBtnEdit",
            handler: () => {
              console.log("User clicked button", "AS-D");
              this.editAvailable("D");
            },
          },
          {
            text: "E Period",
            icon: "md-school",
            cssClass: "ascBtnEdit",
            handler: () => {
              console.log("User clicked button", "AS-E");
              this.editAvailable("E");
            },
          },
          {
            text: "F Period",
            icon: "md-school",
            cssClass: "ascBtnEdit",
            handler: () => {
              console.log("User clicked button", "AS-F");
              this.editAvailable("F");
            },
          },
          {
            text: "G Period",
            icon: "md-school",
            cssClass: "ascBtnEdit",
            handler: () => {
              console.log("User clicked button", "AS-G");
              this.editAvailable("G");
            },
          },
          {
            text: "Cancel",
            icon: "close",
            role: "cancel",
            handler: () => {
              console.log("User clicked button", "AS-Cancel");
            },
          },
        ],
      });
      asc.present();
    } else {
      this.sendToast("Sorry", "You must be logged in to edit");
    }
  }

  editAvailable(l: string) {
    var found: boolean = false;
    for (var i = 0; i < this.periods.length; i++) {
      if (this.periods[i].letter == l) {
        this.cardClicked(undefined, this.periods[i]);
        i = this.periods.length;
        found = true;
      }
    }
    if (!found) {
      this.cardClicked(undefined, {
        number: "1",
        letter: l,
        class: "Tap to change",
        category: "not chosen",
        class1: "Tap to change",
        category1: "not chosen",
        class2: "Tap to change",
        category2: "not chosen",
        class3: "Tap to change",
        category3: "not chosen",
        class4: "Tap to change",
        category4: "not chosen",
        class5: "Tap to change",
        category5: "not chosen",
        class6: "Tap to change",
        category6: "not chosen",
        class7: "Tap to change",
        category7: "not chosen",
        class8: "Tap to change",
        category8: "not chosen",
        isLunch: "0",
        timeStart: "",
        timeEnd: "",
      });
    }
  }

  devCheckSource() {
    var dSource: string = this.getDevValue("source");
    if (dSource == "0") {
      //this.jsonWeb = "https://jefftc.com/schedule.json";
    } else if (dSource == "1") {
      //this.jsonWeb = "https://jefftc.com/scheduleDev.json";
    }
  }

  randomSessionID(): string {
    var sid: string = "AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE";
    var date: Date = new Date();

    var a: string =
      date.getMilliseconds() +
      "" +
      (date.getSeconds() + "") +
      (date.getMinutes() + "");
    var b: string = (Math.random() + "").substring(2, 6);
    var c: string = (Math.random() + "").substring(2, 6);
    var d: string = (Math.random() + "").substring(2, 6);
    var e: string = (parseInt(d) * parseInt(a) + "").substring(0, 12);

    return a + b;
  }

  jsonWeb(): string {
    return this.jsonWebBase; // + this.randomSessionID();
  }

  sendAlert(sTitle: string, sText: string) {
    let alert = this.ac.create({
      title: sTitle,
      subTitle: sText,
      buttons: ["OK"],
    });
    alert.present();
  }

  sendToast(sTitle: string, sText: string) {
    let toast = this.tc.create({
      message: sText,
      duration: 3500,
      showCloseButton: true,
      position: "bottom",
    });
    toast.present();
  }

  correctTime() {
    this.todaysDate = new Date();
    this.dateMod = this.getDateModFromDate(this.todaysDate);
    this.dateModStatic = this.dateMod;
    console.log("Full time not localized: " + this.todaysDate.toISOString());
    console.log("Local Date Mod: " + this.dateMod);
  }

  stdTimezoneOffset(date: Date) {
    var jan = new Date(date.getFullYear(), 0, 1);
    var jul = new Date(date.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
  }

  dst(date: Date) {
    return date.getTimezoneOffset() < this.stdTimezoneOffset(date);
  }

  daysInMonth(month, year): number {
    return new Date(year, month, 0).getDate();
  }

  getDeltaDate(dateModCurrent, delta: number): string {
    var d: Date = this.getDeltaDateRaw(dateModCurrent, delta);
    var dM: string = this.getDateModFromDate(d);
    return dM;
  }

  getDeltaDateRaw(dateModCurrent, delta: number): Date {
    var deltaYear: number;
    var deltaMonth: number;
    var deltaDay: number;
    var recYear: number = this.getYear(dateModCurrent);
    var recMonth: number = this.getMonth(dateModCurrent);
    var recDay: number = this.getDay(dateModCurrent);
    var newDate: Date = new Date();
    console.log(
      "---Rec: " +
        recMonth.toString() +
        "/" +
        recDay.toString() +
        "/" +
        recYear.toString() +
        "  delta: " +
        delta
    );

    deltaYear = recYear;
    if (recDay + delta > this.daysInMonth(recMonth, recYear)) {
      console.log("(+) recDay + delta = " + (recDay + delta));
      deltaDay = recDay + delta - this.daysInMonth(recMonth, recYear);
      console.log(
        "----" +
          (recDay + delta) +
          " - " +
          this.daysInMonth(recMonth, recYear) +
          " = " +
          deltaDay
      );
      deltaMonth = recMonth;
      if (deltaMonth == 13) {
        deltaMonth = 1;
        deltaYear += 1;
      }
      newDate.setFullYear(deltaYear);
      newDate.setDate(deltaDay);
      newDate.setMonth(deltaMonth);
    } else if (recDay + delta < 0) {
      console.log("---neg(-) recDay + delta = " + (recDay + delta));
      deltaMonth = recMonth - 2;
      deltaDay = this.daysInMonth(recMonth - 1, recYear) + (recDay + delta);
      console.log(
        "---" +
          this.daysInMonth(deltaMonth, recYear) +
          " + " +
          (recDay + delta) +
          " = " +
          deltaDay
      );
      newDate.setFullYear(deltaYear);
      newDate.setMonth(deltaMonth);
      newDate.setDate(deltaDay);
    } else if (recDay + delta == 0) {
      console.log("---zer(-) recDay + delta = " + (recDay + delta));
      deltaMonth = recMonth - 2;
      deltaDay = this.daysInMonth(recMonth - 1, recYear) + (recDay + delta);
      console.log(
        "---" +
          this.daysInMonth(deltaMonth, recYear) +
          " + " +
          (recDay + delta) +
          " = " +
          deltaDay
      );
      if (deltaDay > this.daysInMonth(deltaMonth, deltaYear)) {
        newDate.setFullYear(deltaYear);
        newDate.setDate(deltaDay);
        newDate.setMonth(deltaMonth);
      } else {
        newDate.setFullYear(deltaYear);
        newDate.setMonth(deltaMonth);
        newDate.setDate(deltaDay);
      }
    } else {
      deltaMonth = recMonth - 1;
      deltaDay = recDay + delta;
      newDate.setFullYear(deltaYear);
      newDate.setDate(deltaDay);
      newDate.setMonth(deltaMonth);
    }

    console.log(
      "----RecMonth:" +
        recMonth +
        " DeltaMonth:" +
        deltaMonth +
        " Delta:" +
        delta
    );
    console.log("----" + this.getDateModFromDate(newDate));
    return newDate;
  }

  getDayOfWeek(dateMod: string) {
    var testDate: Date = new Date();
    testDate.setFullYear(this.getYear(dateMod));
    testDate.setDate(this.getDay(dateMod));
    testDate.setMonth(this.getMonth(dateMod) - 1);
    console.log(
      "USING: " +
        this.getYear(dateMod) +
        " " +
        (this.getMonth(dateMod) - 1).toString() +
        " " +
        this.getDay(dateMod)
    );
    console.log(dateMod);
    console.log(testDate);
    return testDate.getDay();
  }

  loadDaysOfWeek() {
    console.log("Loading days of week. Today: " + this.dateMod);
    var currentDay = this.getDayOfWeek(this.dateMod);
    if (currentDay == this.DAY_SATURDAY) {
      this.dateMod = this.getDeltaDate(this.dateMod, 2);
      this.todaysDate = new Date(this.dateMod);
      this.date = this.todaysDate.toISOString();
      currentDay = this.getDayOfWeek(this.dateMod);
    } else if (currentDay == this.DAY_SUNDAY) {
      this.dateMod = this.getDeltaDate(this.dateMod, 1);
      this.todaysDate = new Date(this.dateMod);
      this.date = this.todaysDate.toISOString();
      currentDay = this.getDayOfWeek(this.dateMod);
    }
    this.ASTYLE_SEG_MON = this.STYLE_COLOR_GREEN;
    this.ASTYLE_SEG_TUES = this.STYLE_COLOR_GREEN;
    this.ASTYLE_SEG_WED = this.STYLE_COLOR_GREEN;
    this.ASTYLE_SEG_THURS = this.STYLE_COLOR_GREEN;
    this.ASTYLE_SEG_FRI = this.STYLE_COLOR_GREEN;
    this.ASTYLE_SEG_MONB = this.STYLE_COLOR_GREEN;
    switch (currentDay) {
      case this.DAY_MONDAY:
        this.daySeg = "monday";
        this.weekDataDateMods[0].dateMod = this.dateMod;
        this.weekDataDateMods[1].dateMod = this.getDeltaDate(this.dateMod, 1);
        this.tomorrowDateMod = this.getDeltaDate(this.dateMod, 1);
        this.tomorrowDate = this.getDeltaDateRaw(this.dateMod, 1);
        this.weekDataDateMods[2].dateMod = this.getDeltaDate(this.dateMod, 2);
        this.weekDataDateMods[3].dateMod = this.getDeltaDate(this.dateMod, 3);
        this.weekDataDateMods[4].dateMod = this.getDeltaDate(this.dateMod, 4);
        this.weekDataDateMods[5].dateMod = this.getDeltaDate(this.dateMod, 7);
        this.isMondaySeg = true;
        this.ASTYLE_SEG_MON = this.STYLE_COLOR_DARK;
        break;
      case this.DAY_TUESDAY:
        this.daySeg = "tuesday";
        this.weekDataDateMods[0].dateMod = this.getDeltaDate(this.dateMod, -1);
        this.weekDataDateMods[1].dateMod = this.dateMod;
        this.weekDataDateMods[2].dateMod = this.getDeltaDate(this.dateMod, 1);
        this.tomorrowDateMod = this.getDeltaDate(this.dateMod, 1);
        this.tomorrowDate = this.getDeltaDateRaw(this.dateMod, 1);
        this.weekDataDateMods[3].dateMod = this.getDeltaDate(this.dateMod, 2);
        this.weekDataDateMods[4].dateMod = this.getDeltaDate(this.dateMod, 3);
        this.weekDataDateMods[5].dateMod = this.getDeltaDate(this.dateMod, 6);
        this.isTuesdaySeg = true;
        this.ASTYLE_SEG_TUES = this.STYLE_COLOR_DARK;
        break;
      case this.DAY_WEDNESDAY:
        this.daySeg = "wednesday";
        this.weekDataDateMods[0].dateMod = this.getDeltaDate(this.dateMod, -2);
        this.weekDataDateMods[1].dateMod = this.getDeltaDate(this.dateMod, -1);
        this.weekDataDateMods[2].dateMod = this.dateMod;
        this.weekDataDateMods[3].dateMod = this.getDeltaDate(this.dateMod, 1);
        this.tomorrowDateMod = this.getDeltaDate(this.dateMod, 1);
        this.tomorrowDate = this.getDeltaDateRaw(this.dateMod, 1);
        this.weekDataDateMods[4].dateMod = this.getDeltaDate(this.dateMod, 2);
        this.weekDataDateMods[5].dateMod = this.getDeltaDate(this.dateMod, 5);
        this.isWednesdaySeg = true;
        this.ASTYLE_SEG_WED = this.STYLE_COLOR_DARK;
        break;
      case this.DAY_THURSDAY:
        this.daySeg = "thursday";
        this.weekDataDateMods[0].dateMod = this.getDeltaDate(this.dateMod, -3);
        this.weekDataDateMods[1].dateMod = this.getDeltaDate(this.dateMod, -2);
        this.weekDataDateMods[2].dateMod = this.getDeltaDate(this.dateMod, -1);
        this.weekDataDateMods[3].dateMod = this.dateMod;
        this.weekDataDateMods[4].dateMod = this.getDeltaDate(this.dateMod, 1);
        this.tomorrowDateMod = this.getDeltaDate(this.dateMod, 1);
        this.tomorrowDate = this.getDeltaDateRaw(this.dateMod, 1);
        this.weekDataDateMods[5].dateMod = this.getDeltaDate(this.dateMod, 4);
        this.isThursdaySeg = true;
        this.ASTYLE_SEG_THURS = this.STYLE_COLOR_DARK;
        break;
      case this.DAY_FRIDAY:
        this.daySeg = "friday";
        this.weekDataDateMods[0].dateMod = this.getDeltaDate(this.dateMod, -4);
        this.weekDataDateMods[1].dateMod = this.getDeltaDate(this.dateMod, -3);
        this.weekDataDateMods[2].dateMod = this.getDeltaDate(this.dateMod, -2);
        this.weekDataDateMods[3].dateMod = this.getDeltaDate(this.dateMod, -1);
        this.weekDataDateMods[4].dateMod = this.dateMod;
        this.weekDataDateMods[5].dateMod = this.getDeltaDate(this.dateMod, 3);
        this.tomorrowDateMod = this.getDeltaDate(this.dateMod, 3);
        this.tomorrowDate = this.getDeltaDateRaw(this.dateMod, 3);
        this.isFridaySeg = true;
        this.ASTYLE_SEG_FRI = this.STYLE_COLOR_DARK;
        break;
    }
    for (var i: number = 0; i < this.weekDataDateMods.length; i++) {
      console.log(i + " ---- " + this.weekDataDateMods[i].dateMod);
    }
  }

  clickCancel() {
    console.log("Cancel clicked");
    LocalNotifications.cancelAll().then(() => {
      console.log("Cancelled all notifs");
    });
  }

  clickClear() {
    console.log("Clear clicked");
    LocalNotifications.clearAll().then(() => {
      console.log("Cleared all notifs");
    });
  }

  clickNotify() {
    this.SLOG("Notify clicked");
    //this.notifyNext(0, 180);
    var notif = {
      id: 1, //possible that this must be a string for iOS 10
      title: "Notification Title",
      text: "Notification Body",
      at: new Date().setSeconds(new Date().getSeconds() + 2),
      icon: "file://./ext/ic.png",
      smallIcon: "res://ic_stat_notify",
    };
    LocalNotifications.schedule(notif);
  }

  clickResetNotif() {
    LocalNotifications.cancelAll().then(() => {
      this.handleNotifications(true);
      this.SLOG("Reset success");
    });
  }

  clickRefreshNotif() {
    this.SLOG("Rfresh clicked");
    this.consoleNotifOutputs = ["Scheduled:"];
    LocalNotifications.getAllScheduled().then((scheduledArray) => {
      for (var i: number = 0; i < scheduledArray.length; i++) {
        var d: string = scheduledArray[i].at;
        this.consoleNotifOutputs.push("" + scheduledArray[i].id);
      }
    });
  }

  printNotificationArray() {
    LocalNotifications.getAllScheduled().then((scheduledArray) => {
      this.NLOG(scheduledArray.length);
      for (var i: number = 0; i < scheduledArray.length; i++) {
        var d: string = scheduledArray[i].at;
        this.NLOG(scheduledArray[i].id);
      }
    });
  }

  addNotificationObject(dateModN, type, classes, lunchNum) {
    var d: Date = this.getDateFromDateMod(dateModN);
    d.setHours(5);
    d.setMinutes(30);
    d.setSeconds(0);
    this.SLOG("Gen: " + d);
    var id: number = this.convertDateToScheduleID(dateModN);
    var title: string = "";
    var text: string = "";

    switch (type) {
      case "R":
        title = "Day " + classes[0].number + " | ";
        for (var i: number = 0; i < classes.length; i++) {
          if (classes[i].letter == "Z" || classes[i].letter == "AP") {
            title += " AP ";
          } else {
            title += classes[i].letter;
          }
        }
        //iconName = (classes[0].letter + classes[0].number);
        if (this.firstClassPopulated(classes)) {
          text = classes[0].letter + classes[0].number + ": " + classes[0].name;
        }
        break;
      case "E":
        title = "ER Day " + classes[0].number + " | ";
        for (var i: number = 0; i < classes.length; i++) {
          if (classes[i].letter == "Z" || classes[i].letter == "AP") {
            title += " AP ";
          } else {
            title += classes[i].letter;
          }
        }
        //iconName = (classes[0].letter + classes[0].number);
        if (this.firstClassPopulated(classes)) {
          text = classes[0].letter + classes[0].number + ": " + classes[0].name;
        }
        break;
      case "L":
        title = "LS Day " + classes[0].number + " | ";
        for (var i: number = 0; i < classes.length; i++) {
          if (classes[i].letter == "Z" || classes[i].letter == "AP") {
            title += " AP ";
          } else {
            title += classes[i].letter;
          }
        }
        //iconName = (classes[0].letter + classes[0].number);
        if (this.firstClassPopulated(classes)) {
          text = classes[0].letter + classes[0].number + ": " + classes[0].name;
        }
        break;
      case "N":
        title = "No School";
        text = "";
        break;
      case "X":
        title = "Exam Day " + classes[0].number + " | ";
        for (var i: number = 0; i < classes.length; i++) {
          if (classes[i].letter == "Z" || classes[i].letter == "AP") {
            title += " AP ";
          } else {
            title += classes[i].letter;
          }
        }
        //iconName = (classes[0].letter + classes[0].number);
        if (this.firstClassPopulated(classes)) {
          text = classes[0].letter + classes[0].number + ": " + classes[0].name;
        }
        break;
    }
    /*if(this.classesPopulated(classes)) {
      for(var i : number = 0; i < classes.length; i++) {
        if(parseInt(classes[i].isLunch) > 0) {
          var add : string = "";
          if(i > 0) {
            add = "\n";
          }
          text += add + classes[i].letter + ": " + classes[i].name + " (" + lunchStr + ")";
        } else {
          var add : string = "";
          if(i > 0) {
            add = "\n";
          }
          text += add + classes[i].letter + ": " + classes[i].name;
        }
      }
    } else {

    }*/
    this.createNotification(d, id, title, text);
  }

  classesPopulated(classes): boolean {
    if (classes.length > 0) {
      for (var i: number = 0; i < classes.length; i++) {
        if (classes[i].name == "Tap to change") {
          return false;
        }
      }
      return true;
    } else {
      return false;
    }
  }

  firstClassPopulated(classes): boolean {
    if (classes.length > 0) {
      if (classes[0].name == "Tap to change") {
        return false;
      }
      return true;
    } else {
      return false;
    }
  }

  compareNotificationArray(array1, array2): boolean {
    return false;
  }

  generateNotifications() {
    this.SLOG("Generating notifications");
    this.notifArray1 = [];
    this.notifArray2 = [];
    if (this.notifArray1.length < 1 || this.notifArray1 == undefined) {
      this.notifArray1 = this.notificationArray;
    } else {
      this.notifArray2 = this.notificationArray;
    }
    this.notificationArray = [];
    if (this.data != undefined) {
      this.loadJSONNotify(this.data);
    } else {
      this.waitingForJN = true;
    }
    /*this.http.get(this.jsonLocal).map(res => res.json()).subscribe(data => {
      console.log(data);
      this.data = data.schedule;
      this.loadJSONNotify(this.data);
    }, error => {
      this.SLOG("Notif error:");
      this.SLOG(error);
    });*/
  }

  loadJSONNotify(data) {
    console.log("loading JSON");
    console.log(data);
    //console.log("JSON: " + data[0].number);
    //this.loadLocalStorage();
    console.log(data.length);
    this.notificationArray = [];
    var foundToday: boolean = false;
    for (var i: number = 0; i < data.length; i++) {
      if (data[i].date == this.dateModStatic) {
        foundToday = true;
      } else {
        if (foundToday) {
          var p = this.periodifyData(
            data[i].type,
            data[i].number,
            data[i].letters
          );
          this.addNotificationObject(
            data[i].date,
            data[i].type,
            p,
            this.getLunchNumberFromPData(p)
          );
        }
      }
    }
  }

  handleNotifications(overwrite: boolean) {
    console.log("Handling notifications");
    //if(!this.isLocal)
    if (
      this.platform.is("cordova") ||
      this.platform.is("ios") ||
      this.platform.is("android")
    ) {
      LocalNotifications.isScheduled(
        this.convertDateToScheduleID(this.tomorrowDateMod)
      ).then((scheduled) => {
        if (this.updatedNew) {
          console.log("Updating notifications new");
          this.generateNotifications();
          this.overwriteNotifications();
          this.updatedNew = false;
          this.needsOverwrite = false;
        } else {
          if (scheduled) {
            if (overwrite || this.needsOverwrite) {
              this.SLOG("Overwrite notif");
              this.generateNotifications();
              this.overwriteNotifications();
              this.needsOverwrite = false;
            } else {
              this.SLOG("Not overwrite notif");
            }
          } else {
            this.SLOG("Notifs not scheduled");
            this.SLOG("Creating new notif");
            this.generateNotifications();
            this.overwriteNotifications();
            this.needsOverwrite = false;
          }
        }
      });
    }
  }

  overwriteNotifications() {
    LocalNotifications.cancelAll().then(() => {
      LocalNotifications.clearAll().then(() => {
        this.SLOG("All notifications cleared");
        LocalNotifications.schedule(this.notificationArray);
        this.NLOG(
          "N-array size: 0:" +
            this.notificationArray.length +
            " 1:" +
            this.notifArray1.length +
            " 2:" +
            this.notifArray2.length
        );
        this.NLOG(
          "Compareison[" +
            this.compareNotificationArray(this.notifArray1, this.notifArray2) +
            "]"
        );
        this.NLOG("Scheduled Array: ");
        this.printNotificationArray();
        this.SLOG("All notifications saved");
      });
    });
  }

  createNotification(DAY: Date, ID: number, TITLE: string, TEXT: string) {
    let notification = {
      //possible that ID must be a string according to some sources for iOS
      id: ID,
      title: TITLE,
      text: TEXT,
      at: DAY,
      icon: "file://./ext/ic.png",
      smallIcon: "res://ic_stat_notify",
    };
    this.notificationArray.push(notification);
    this.notifTick++;

    if (this.notifTick >= this.notifReminder) {
      this.notifTick -= this.notifReminder;
      let notification2 = {
        id: ID * 10,
        title: "Check For Updates",
        text: "Click here to check for schedule updates in OneDay!",
        at: DAY,
        icon: "file://./ext/ic.png",
        smallIcon: "res://ic_stat_notify",
      };
      this.notificationArray.push(notification2);
    }
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

  getDateFromDateMod(dateMod: string): Date {
    var d = new Date();
    d.setFullYear(this.getYear(dateMod));
    d.setDate(this.getDay(dateMod));
    d.setMonth(this.getMonth(dateMod) - 1);
    console.log("Got date[" + d + "] from date mod[" + dateMod + "]");
    return d;
  }

  convertDateToScheduleID(date: string): number {
    //2016-12-14
    var year = this.getYear(date);
    var month = this.getMonth(date);
    var day = this.getDay(date);
    var idNumber: number = month * 100 + day;
    this.SLOG(date + " => id#: [" + idNumber + "]");
    return idNumber;
  }

  LOG(text) {
    console.log("LOG | " + text);
    if (this.isDev) {
      this.consoleOutputs.push(text);
    }
  }

  SLOG(text) {
    if (this.isSpecialDev) {
      this.consoleOutputs.push(this.sDevTracker + "|" + text);
      console.log("SLOG [" + this.sDevTracker + "]:");
      this.sDevTracker++;
    }
    console.log(text);
  }

  NLOG(text) {
    if (this.isSpecialDev) {
      this.notifLogOutputs.push(text);
    }
    console.log(text);
  }

  JLOG(text) {
    if (this.isJSONDev) {
      this.jsonLogOutputs.push(text);
    }
    console.log(text);
  }

  ionViewDidLoad() {
    this.FC = true;
    this.updatedNew = this.us.updateNew;
    console.log("Updated New", this.updatedNew);
  }

  //ionViewDidLoad() {
  ionViewWillEnter() {
    console.log("INIT | PAGE LOADED");
    this.authorized = this.us.authorized;
    this.currentFriendSchedule = this.defaultFriendSchedule;
    this.friendName = this.us.username;
    this.currentFriend = 0;
    this.showingFriendSchedule = false;
    if (this.us.needsAuthorization) {
      this.FC = true;
      this.us.needsAuthorization = false;
    }
    this.refresh();
    //this.clear();
  }

  openFriendChip() {
    if (this.authorized) {
      let alert = this.ac.create();
      alert.setTitle("Pick a Friend");
      var isUser = [];
      if (this.friendName == this.us.username) {
        isUser.push(true);
      } else {
        isUser.push(false);
      }
      alert.addInput({
        type: "radio",
        label: this.us.username,
        value: this.us.username,
        checked: isUser[0],
      });
      alert.setCssClass("alertClass");
      for (var i = 0; i < this.us.friendArrayDSorted.length; i++) {
        if (this.friendName == this.us.friendArrayDSorted[i].username) {
          isUser.push(true);
        } else {
          isUser.push(false);
        }
        alert.addInput({
          type: "radio",
          label: this.us.friendArrayDSorted[i].username,
          value: this.us.friendArrayDSorted[i].username,
          checked: isUser[i + 1],
        });
        alert.setCssClass("alertClass");
      }

      alert.addButton("Cancel");
      alert.addButton({
        text: "OK",
        handler: (data) => {
          if (data != undefined) {
            console.log("chosen: " + data);
            for (var i = -1; i < this.us.friendArrayDSorted.length; i++) {
              if (i >= 0) {
                if (data == this.us.friendArrayDSorted[i].username) {
                  this.showingFriendSchedule = true;
                  this.friendName = this.us.friendArrayDSorted[i].username;
                  this.currentFriend = i;

                  this.friendify();
                  console.log(
                    "New schedule " + i + " [" + this.friendName + "]",
                    this.currentFriendSchedule
                  );
                }
              } else {
                if (data == this.us.username) {
                  this.showingFriendSchedule = false;
                  this.friendName = this.us.username;
                  this.currentFriend = 0;
                  console.log("Schedule", this.periods);
                  this.periodify();
                }
              }
            }
          }
        },
      });
      alert.present();
    } else {
      this.sendToast("Failure", "You must be logged in to use this feature");
    }
  }

  friendify() {
    console.log("Friendify", this.currentFriend);
    var n = this.us.convertScheduleLtoN(
      this.us.friendArrayDSorted[this.currentFriend].dA,
      this.us.friendArrayDSorted[this.currentFriend].dB,
      this.us.friendArrayDSorted[this.currentFriend].dC,
      this.us.friendArrayDSorted[this.currentFriend].dD,
      this.us.friendArrayDSorted[this.currentFriend].dE,
      this.us.friendArrayDSorted[this.currentFriend].dF,
      this.us.friendArrayDSorted[this.currentFriend].dG
    );
    this.currentFriendSchedule = this.periods.slice();
    var t = n[parseInt(this.today.number) - 1];
    console.log("Today", t);
    for (var i = 0; i < this.periods.length; i++) {
      switch (this.periods[i].letter) {
        case "A":
          this.currentFriendSchedule[i].class = t[0].className;
          this.currentFriendSchedule[i].category = t[0].classCategory;
          break;
        case "B":
          this.currentFriendSchedule[i].class = t[1].className;
          this.currentFriendSchedule[i].category = t[1].classCategory;
          break;
        case "C":
          this.currentFriendSchedule[i].class = t[2].className;
          this.currentFriendSchedule[i].category = t[2].classCategory;
          break;
        case "D":
          this.currentFriendSchedule[i].class = t[3].className;
          this.currentFriendSchedule[i].category = t[3].classCategory;
          break;
        case "E":
          this.currentFriendSchedule[i].class = t[4].className;
          this.currentFriendSchedule[i].category = t[4].classCategory;
          break;
        case "F":
          this.currentFriendSchedule[i].class = t[5].className;
          this.currentFriendSchedule[i].category = t[5].classCategory;
          break;
        case "G":
          this.currentFriendSchedule[i].class = t[6].className;
          this.currentFriendSchedule[i].category = t[6].classCategory;
          break;
      }
      if (this.periods[i].isLunch != "0") {
        this.currentFriendSchedule[i].isLunch = this.calculateLunch(
          this.currentFriendSchedule[i].category
        );
      }
    }
  }

  processFriendLunches() {
    if (this.authorized) {
      if (this.lunchPeriod != "X#") {
        this.us.friendsInLunch1 = [];
        this.us.friendsInLunch2 = [];
        this.us.friendsInLunch3 = [];
        this.us.friendsInLunch4 = [];
        console.log("Friend Array D", this.us.friendArrayDSorted);
        for (var i = 0; i < this.us.friendArrayDSorted.length; i++) {
          var p = this.getPeriodFromFriendData(
            this.us.friendArrayDSorted[i],
            this.lunchPeriod
          );
          console.log("Friend Lunch Period", p);
          if (p != undefined) {
            var lunchN: string = this.calculateLunch(p.classCategory);
            console.log("Got friend lunch #", lunchN);
            switch (lunchN) {
              case "0":
                break;
              case "1":
                this.us.friendsInLunch1.push(this.us.friendArrayDSorted[i]);
                break;
              case "2":
                this.us.friendsInLunch2.push(this.us.friendArrayDSorted[i]);
                break;
              case "3":
                this.us.friendsInLunch3.push(this.us.friendArrayDSorted[i]);
                break;
              case "4":
                this.us.friendsInLunch4.push(this.us.friendArrayDSorted[i]);
                break;
              case "All":
                this.us.friendsInLunch1.push(this.us.friendArrayDSorted[i]);
                this.us.friendsInLunch2.push(this.us.friendArrayDSorted[i]);
                this.us.friendsInLunch3.push(this.us.friendArrayDSorted[i]);
                this.us.friendsInLunch4.push(this.us.friendArrayDSorted[i]);
                break;
            }
          }
        }
        this.friendsInLunch1 = this.us.friendsInLunch1;
        this.friendsInLunch2 = this.us.friendsInLunch2;
        this.friendsInLunch3 = this.us.friendsInLunch3;
        this.friendsInLunch4 = this.us.friendsInLunch4;
        console.log("Friends in Lunch 1", this.friendsInLunch1);
        console.log("Friends in Lunch 2", this.friendsInLunch2);
        console.log("Friends in Lunch 3", this.friendsInLunch3);
        console.log("Friends in Lunch 4", this.friendsInLunch4);
      }
    }
  }

  clickLunchBadge(n) {
    console.log("Lunch Badge clicked", n);
    var aTitle: string = "Friends in ";
    var f = [];
    switch (n) {
      case 0:
        aTitle += "1st Lunch";
        f = this.friendsInLunch1;
        break;
      case 1:
        aTitle += "2nd Lunch";
        f = this.friendsInLunch2;
        break;
      case 2:
        aTitle += "3rd Lunch";
        f = this.friendsInLunch3;
        break;
      case 3:
        aTitle += "4th Lunch";
        f = this.friendsInLunch4;
        break;
    }
    var aText: string = "";
    for (var i = 0; i < f.length; i++) {
      if (i > 0) {
        aText += ", ";
      }
      aText += f[i].firstName + " " + f[i].lastName.substring(0, 1);
    }
    this.sendAlert(aTitle, aText);
  }

  getPeriodFromFriendData(friendData, ln) {
    var letter: string = ln.substring(0, 1);
    var number: number = parseInt(ln.substring(1, 2));
    console.log("Friend period", ln + "-" + letter + "-" + number);
    switch (letter) {
      case "A":
        return friendData.dA[number - 1];
      case "B":
        return friendData.dB[number - 1];
      case "C":
        return friendData.dC[number - 1];
      case "D":
        return friendData.dD[number - 1];
      case "E":
        return friendData.dE[number - 1];
      case "F":
        return friendData.dF[number - 1];
      case "G":
        return friendData.dG[number - 1];
    }
    return undefined;
  }

  clearClassData() {
    this.sql.query("DROP TABLE classData").then(
      (data) => {
        console.log("clear classData");
      },
      (error) => {
        this.SLOG(error);
      }
    );
  }

  clearPersonalData() {
    this.sql.query("DROP TABLE personalData").then(
      (data) => {
        console.log("clear personal");
      },
      (error) => {
        this.SLOG(error);
      }
    );
  }

  public refresh() {
    console.log("SQL lookup");
    this.correctTime();
    this.loadToday(this.FC);
  }

  loadToday(firstCheck) {
    if (firstCheck) {
      this.FC = false;
    }
    this.loadDaysOfWeek();
    console.log("Modified date: [" + this.dateMod + "]");
    console.log("Loading");
    this.setVisibleData(this.dateMod, false, firstCheck);
  }

  downloadJSONSQL() {
    this.SLOG("Checking platform ready");
    return new Promise((resolve) => {
      this.dataL = this.dataW;
      this.platform.ready().then(() => {
        this.sql.query("DROP TABLE localData").then(
          (data) => {
            console.log("clear classData");
          },
          (error) => {
            this.SLOG(error);
          }
        );
        this.sql
          .query(
            "CREATE TABLE IF NOT EXISTS localData (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, type TEXT, number TEXT, letters TEXT, timeType TEXT, iLunch TEXT, timeP1 TEXT, timeP2 TEXT, timeP3 TEXT, timeP4 TEXT, timeP5 TEXT, timeP6 TEXT, timeP7 TEXT, timeP8 TEXT)"
          )
          .then(
            (res) => {
              console.log("created table");
              console.log("Saving data", this.dataL);
              this.sqlSaveData(this.dataL);
              resolve("T");
            },
            (error) => {
              this.SLOG(error);
            }
          );
      });
    });
  }

  saveSqlLocalDataInsert(
    date,
    type,
    number,
    letters,
    timeType,
    iLunch,
    timeP1,
    timeP2,
    timeP3,
    timeP4,
    timeP5,
    timeP6,
    timeP7,
    timeP8,
    i
  ) {
    this.sql
      .query(
        "INSERT INTO localData (date, type, number, letters, timeType, iLunch, timeP1, timeP2, timeP3, timeP4, timeP5, timeP6, timeP7, timeP8) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          date[i],
          type[i],
          number[i],
          letters[i],
          timeType[i],
          iLunch[i],
          timeP1[i],
          timeP2[i],
          timeP3[i],
          timeP4[i],
          timeP5[i],
          timeP6[i],
          timeP7[i],
          timeP8[i],
        ]
      )
      .then(
        (sqldata) => {
          console.log("" + date[i] + " was saved initially");
          if (i < date.length - 1) {
            if (
              this.saveSqlLocalDataInsert(
                date,
                type,
                number,
                letters,
                timeType,
                iLunch,
                timeP1,
                timeP2,
                timeP3,
                timeP4,
                timeP5,
                timeP6,
                timeP7,
                timeP8,
                i + 1
              )
            ) {
              return true;
            }
          } else {
            console.log("All intials saved");
            this.updatedSQL();
            return true;
          }
        },
        (error) => {
          this.SLOG("Initials error:");
          this.SLOG(error);
        }
      );
  }

  sqlSaveData(data) {
    return new Promise((resolve) => {
      var foundToday = false;
      var date = [""]; //config: version date number
      var type = ["V"]; //config: V
      var number = [""];
      var letters = [""];
      var timeType = [""];
      var iLunch = [""]; //config: packed class data
      var timeP1 = [""];
      var timeP2 = [""];
      var timeP3 = [""];
      var timeP4 = [""];
      var timeP5 = [""];
      var timeP6 = [""];
      var timeP7 = [""];
      var timeP8 = [""];
      for (var i = 0; i < data.length; i++) {
        if (i > 0) {
          if (data[i].date != undefined) {
            if (data[i].date == this.dateModStatic) {
              foundToday = true;
            }
            if (foundToday) {
              var current = data[i];
              date.push(current.date);
              type.push(current.type);
              number.push(current.number);
              letters.push(current.letters);
              timeType.push(current.timeType);
              iLunch.push(this.validateInsert(current.iLunch));
              timeP1.push(this.validateInsert(current.timeP1));
              timeP2.push(this.validateInsert(current.timeP2));
              timeP3.push(this.validateInsert(current.timeP3));
              timeP4.push(this.validateInsert(current.timeP4));
              timeP5.push(this.validateInsert(current.timeP5));
              timeP6.push(this.validateInsert(current.timeP6));
              timeP7.push(this.validateInsert(current.timeP7));
              timeP8.push(this.validateInsert(current.timeP8));
            }
          }
        } else if (i == 0) {
          date[0] = data[0].version;
          var packedSQLClassConfig = this.packSQLClassConfig(data[0].classes);
          iLunch[0] = packedSQLClassConfig;
          console.log("Packed SQL Classes", packedSQLClassConfig);

          //TODO do rest of them
          var packedSQLTimeConfigRegularR = this.packSQLTimeConfig(
            data[0].timeRegularR
          );
          timeP1[0] = packedSQLTimeConfigRegularR;
          console.log("Packed SQL Time Regular R", packedSQLTimeConfigRegularR);
          var packedSQLTimeConfigRegularWithAPR = this.packSQLTimeConfig(
            data[0].timeRegularWithAPR
          );
          timeP2[0] = packedSQLTimeConfigRegularWithAPR;
          console.log(
            "Packed SQL Time Regular With APR",
            packedSQLTimeConfigRegularWithAPR
          );
          var packedSQLTimeConfigLateStartR = this.packSQLTimeConfig(
            data[0].timeLateStartR
          );
          timeP3[0] = packedSQLTimeConfigLateStartR;
          console.log(
            "Packed SQL Time Late Start R",
            packedSQLTimeConfigLateStartR
          );
          var packedSQLTimeConfigEarlyReleaseWithAPR = this.packSQLTimeConfig(
            data[0].timeEarlyReleaseWithAPR
          );
          timeP4[0] = packedSQLTimeConfigEarlyReleaseWithAPR;
          console.log(
            "Packed SQL Time Early Release With APR",
            packedSQLTimeConfigEarlyReleaseWithAPR
          );
          var packedSQLTimeConfigEarlyReleaseWithoutAPR = this.packSQLTimeConfig(
            data[0].timeEarlyReleaseWithoutAPR
          );
          timeP5[0] = packedSQLTimeConfigEarlyReleaseWithoutAPR;
          console.log(
            "Packed SQL Time Early Release With APR",
            packedSQLTimeConfigEarlyReleaseWithoutAPR
          );
          var packedSQLTimeConfigEarlyReleaseAllWithoutAPR = this.packSQLTimeConfig(
            data[0].timeEarlyReleaseAllWithoutAPR
          );
          timeP6[0] = packedSQLTimeConfigEarlyReleaseAllWithoutAPR;
          console.log(
            "Packed SQL Time Early Release With APR",
            packedSQLTimeConfigEarlyReleaseAllWithoutAPR
          );
        }
      }
      if (
        this.saveSqlLocalDataInsert(
          date,
          type,
          number,
          letters,
          timeType,
          iLunch,
          timeP1,
          timeP2,
          timeP3,
          timeP4,
          timeP5,
          timeP6,
          timeP7,
          timeP8,
          0
        )
      ) {
        console.log("Finished updating save");
      }
    });
  }

  updatedSQL() {
    this.JLOG("Download success");
    this.sendToast(
      "Up To Date!",
      "OneDay updated to the latest schedule information"
    );
    this.handleNotifications(true);
  }

  packSQLClassConfig(classArray): string {
    var r: string = "SQL";
    for (var i = 0; i < classArray.length; i++) {
      if (i > 0) {
        r += "~";
      }
      var c = classArray[i].name + "-" + classArray[i].lunch;
      r += c;
    }
    r += "SQL";
    return r;
  }

  unpackSQLClassConfig(classString: string) {
    var r = [];
    var splits = classString.replace("SQL", "").replace("SQL", "").split("~");
    for (var i = 0; i < splits.length; i++) {
      var thisSplit = splits[i].split("-");
      if (thisSplit.length == 2) {
        r.push({
          name: thisSplit[0],
          lunch: thisSplit[1],
        });
      }
    }
    return r;
  }

  packSQLTimeConfig(timeArray): string {
    var r: string = "SQL";
    for (var i = 0; i < timeArray.length; i++) {
      if (i > 0) {
        r += "~";
      }
      var c = timeArray[i].timeStart + "-" + timeArray[i].timeEnd;
      r += c;
    }
    r += "SQL";
    return r;
  }

  unpackSQLTimeConfig(timeString: string) {
    var r = [];
    var splits = timeString.replace("SQL", "").replace("SQL", "").split("~");
    for (var i = 0; i < splits.length; i++) {
      var thisSplit = splits[i].split("-");
      if (thisSplit.length == 2) {
        r.push({
          timeStart: thisSplit[0],
          timeEnd: thisSplit[1],
        });
      }
    }
    return r;
  }

  validateInsert(i): string {
    if (i != undefined) {
      return i;
    } else {
      return "";
    }
  }

  getJSONVersion(data): string {
    if (data.length > 0) {
      if (data[0].date == "SETTINGS") {
        return data[0].version;
      } else {
        return "YYYY-MM-DD";
      }
    } else {
      return "YYYY-MM-DD";
    }
  }

  getJSONReqVersion(data): string {
    if (data.length > 0) {
      if (data[0].date == "SETTINGS") {
        return data[0].req;
      } else {
        return "YYYY-MM-DD";
      }
    } else {
      return "YYYY-MM-DD";
    }
  }

  getJSONReqMandatory(data): string {
    if (data.length > 0) {
      if (data[0].date == "SETTINGS") {
        return data[0].mandatory;
      } else {
        return "N";
      }
    } else {
      return "Y";
    }
  }

  saveWebJSON(needsOverwrite: boolean) {
    this.SLOG("Save web JSON | overwrite(" + needsOverwrite + ")");
    if (needsOverwrite) {
      this.downloadJSONSQL().then((res) => {});
    } else {
      this.downloadJSONSQL().then((res) => {});
    }
  }

  getWebJSON() {
    return new Promise((resolve, err) => {
      var j = this.jsonWeb();
      this.loader = this.lc.create({
        content: "Updating",
      });
      this.loader.present();
      this.http
        .get(j)
        .map((res) => res.json())
        .subscribe(
          (data) => {
            console.log("Loading web JSON", j);
            this.JLOG("Web Source: " + j);
            this.loader.dismiss();
            if (data != undefined) {
              console.log(data);
              this.dataW = data.schedule;
              this.webJSONVersion = this.getJSONVersion(this.dataW);
              var req: string = this.getJSONReqVersion(this.dataW);
              if (req != this.localReqVersion) {
                console.log("Updated needed", req, this.localReqVersion);
                this.sendAlert(
                  "Update Available",
                  "Please update OneDay or the app may not function properly"
                );
                var mand: string = this.getJSONReqMandatory(this.dataW);
                if (mand == "Y") {
                  this.us.reqUpdate = true;
                  this.authorized = false;
                  this.us.authorized = false;
                } else {
                  this.us.reqUpdate = false;
                }
              } else {
                console.log("Update not needed", req, this.localReqVersion);
              }
              this.logWebV = this.webJSONVersion;
              this.JLOG("Web v: " + this.webJSONVersion);
              resolve("valid");
            } else {
              resolve("invalid");
            }
          },
          (error) => {
            console.log("Error", error._body);
            this.JLOG("Web JSON error: " + error);
            this.loader.dismiss();
            err("invalid");
          }
        );
    });
  }

  getLocalSQL() {
    return new Promise((resolve) => {
      this.sql.query("SELECT * FROM localData").then(
        (data) => {
          console.log("FOUND SQL TABLE");
          if (data.res.rows.length > 0) {
            console.log("Local Rows", data.res.rows);
            var newData = [];
            for (let i = 0; i < data.res.rows.length; i++) {
              var row = data.res.rows.item(i);
              if (i > 0) {
                newData.push({
                  date: row.date,
                  type: row.type,
                  number: row.number,
                  letters: row.letters,
                  timeType: row.timeType,
                  iLunch: row.iLunch,
                  timeP1: row.timeP1,
                  timeP2: row.timeP2,
                  timeP3: row.timeP3,
                  timeP4: row.timeP4,
                  timeP5: row.timeP5,
                  timeP6: row.timeP6,
                  timeP7: row.timeP7,
                  timeP8: row.timeP8,
                });
              } else if (i == 0) {
                var unpackedSQLClasses = this.unpackSQLClassConfig(row.iLunch);
                console.log("Unpacked SQL Classes", unpackedSQLClasses);
                var unpackedSQLtimeRegularR = this.unpackSQLTimeConfig(
                  row.timeP1
                );
                console.log(
                  "Unpacked SQL timeRegularR",
                  unpackedSQLtimeRegularR
                );
                var unpackedSQLtimeRegularWithAPR = this.unpackSQLTimeConfig(
                  row.timeP2
                );
                console.log(
                  "Unpacked SQL timeRegularWithAPR",
                  unpackedSQLtimeRegularWithAPR
                );
                var unpackedSQLtimeLateStartR = this.unpackSQLTimeConfig(
                  row.timeP3
                );
                console.log(
                  "Unpacked SQL timeLateStartR",
                  unpackedSQLtimeLateStartR
                );
                var unpackedSQLtimeEarlyReleaseWithAPR = this.unpackSQLTimeConfig(
                  row.timeP4
                );
                console.log(
                  "Unpacked SQL timeEarlyReleaseWithAPR",
                  unpackedSQLtimeEarlyReleaseWithAPR
                );
                var unpackedSQLtimeEarlyReleaseWithoutAPR = this.unpackSQLTimeConfig(
                  row.timeP5
                );
                console.log(
                  "Unpacked SQL timeEarlyReleaseWithoutAPR",
                  unpackedSQLtimeEarlyReleaseWithoutAPR
                );
                var unpackedSQLtimeEarlyReleaseAllWithoutAPR = this.unpackSQLTimeConfig(
                  row.timeP6
                );
                console.log(
                  "Unpacked SQL timeEarlyReleaseAllWithoutAPR",
                  unpackedSQLtimeEarlyReleaseAllWithoutAPR
                );
                newData.push({
                  date: "SETTINGS",
                  version: row.date,
                  classes: unpackedSQLClasses,
                  timeRegularR: unpackedSQLtimeRegularR,
                  timeRegularWithAPR: unpackedSQLtimeRegularWithAPR,
                  timeLateStartR: unpackedSQLtimeLateStartR,
                  timeEarlyReleaseWithAPR: unpackedSQLtimeEarlyReleaseWithAPR,
                  timeEarlyReleaseWithoutAPR: unpackedSQLtimeEarlyReleaseWithoutAPR,
                  timeEarlyReleaseAllWithoutAPR: unpackedSQLtimeEarlyReleaseAllWithoutAPR,
                });
                this.localJSONVersion = row.date;
                this.logLocalV = this.localJSONVersion;
              }
            }
            console.log("Loaded SQL data", newData);
            this.dataL = newData;
            this.data = this.dataL;
            resolve("valid");
          } else {
            this.dataL = this.dataW;
            this.data = this.dataW;
            resolve("invalid");
          }
        },
        (error) => {
          this.dataL = this.dataW;
          resolve("invalid");
        }
      );
    });
  }

  processClassConfig(data) {
    console.log("Process Class Config", data);
    if (data != undefined) {
      this.classConfig = data[0].classes;
      console.log("Class config", this.classConfig);
    }
  }

  processTimeConfig(data) {
    console.log("Process Time Config", data);
    if (data != undefined) {
      this.timeRegularR = data[0].timeRegularR;
      this.timeRegularWithAPR = data[0].timeRegularWithAPR;
      this.timeLateStartR = data[0].timeLateStartR;
      this.timeEarlyReleaseWithAPR = data[0].timeEarlyReleaseWithAPR;
      this.timeEarlyReleaseWithoutAPR = data[0].timeEarlyReleaseWithoutAPR;
      this.timeEarlyReleaseAllWithoutAPR =
        data[0].timeEarlyReleaseAllWithoutAPR;
      console.log("Time Regular Process", this.timeRegularR);
      console.log("Time Regular_W_APR Process", this.timeRegularWithAPR);
      console.log("Time Late Start Process", this.timeLateStartR);
      console.log("Time ER_W_APR Process", this.timeEarlyReleaseWithAPR);
      console.log("Time ER_WO_APR Process", this.timeEarlyReleaseWithoutAPR);
      console.log(
        "Time ER_A_WO_APR Process",
        this.timeEarlyReleaseAllWithoutAPR
      );
    }
  }

  setVisibleData(dateMod, overwrite, firstCheck) {
    this.dateModC = dateMod;
    this.SLOG("Starting visible data");

    this.SLOG("JSON Connection Test");
    if (firstCheck) {
      this.getLocalSQL().then(
        (resL) => {
          if (resL == "valid") {
            this.processClassConfig(this.dataL);
            this.processTimeConfig(this.dataL);
            this.JLOG("Found local w/o web");
            this.SLOG("Loading for " + dateMod);
            this.loadJSON(this.dataL, dateMod, overwrite);
            this.setVisibleDataWeb(dateMod, overwrite, firstCheck, true);
          } else {
            this.JLOG("Local version: missing w/o web");
            this.setVisibleDataWeb(dateMod, overwrite, firstCheck, false);
          }
        },
        (error) => {
          this.JLOG("Local version: missing w/o web");
          this.setVisibleDataWeb(dateMod, overwrite, firstCheck, false);
        }
      );
    } else {
      this.JLOG("Calling direct to local JSON");
      //this.data = this.dataL;
      this.SLOG("Loading for " + dateMod);
      this.loadJSON(this.data, dateMod, overwrite);
    }
  }

  setVisibleDataWeb(dateMod, overwrite, firstCheck, foundLocal) {
    this.SLOG("Calling to Web JSON first");
    this.SLOG("Datemod: " + dateMod + " | " + this.dateModStatic);
    this.getWebJSON().then(
      (resW) => {
        if (resW == "valid") {
          console.log("Found web json", foundLocal);
          if (foundLocal) {
            this.JLOG("Found local json");
            if (this.webJSONVersion != this.localJSONVersion) {
              this.JLOG("Local version: old");
              this.data = this.dataW;
              this.processClassConfig(this.dataW);
              this.processTimeConfig(this.dataW);
              this.loadJSON(this.data, dateMod, overwrite);
              this.saveWebJSON(true);
            } else {
              this.JLOG("Local version: latest");
              this.data = this.dataW;
              this.processClassConfig(this.dataL);
              this.processTimeConfig(this.dataL);
              this.loadJSON(this.data, dateMod, overwrite);
            }
          } else {
            this.JLOG("Local version: missing. Use Web");
            this.data = this.dataW;
            console.log("Web data", this.dataW);
            this.processClassConfig(this.dataW);
            this.processTimeConfig(this.dataW);
            this.loadJSON(this.data, dateMod, overwrite);
            this.saveWebJSON(false);
          }
          if (this.waitingForJN) {
            this.handleNotifications(false);
            this.waitingForJN = false;
          }
        } else {
          this.JLOG("Missing web json");
          if (!foundLocal) {
            this.sendToast(
              "Uh...",
              "You need an internet connection the first time you use the app, sorry"
            );
          }
        }
      },
      (error) => {
        this.JLOG("Web version missing");
        if (!foundLocal) {
          this.sendToast(
            "Uh...",
            "You need an internet connection the first time you use the app, sorry"
          );
        }
      }
    );
  }

  loadJSON(data, dateSearch, overwrite) {
    console.log("loading JSON");
    console.log(data);
    //console.log("JSON: " + data[0].number);
    //this.loadLocalStorage();
    console.log(data.length);
    console.log("Searching for date [" + dateSearch + "]");
    var found: boolean = false;
    for (var i: number = 0; i < data.length; i++) {
      if (data[i].date == dateSearch) {
        found = true;
        console.log("Searching for date successful", data[i]);
        console.log("Loading for " + data[i].date);
        console.log("TODAY DATA: ", data[i]);
        this.isSchool = true;
        console.log("Found schedule for today");
        this.today.date = data[i].date;
        this.today.day = data[i].day;
        this.today.type = data[i].type;
        this.today.number = data[i].number;
        this.today.letters = data[i].letters;
        this.today.timeType = data[i].timeType;
        this.lunchNumberSet = this.today.letters.length - 3;
        switch (this.today.type) {
          case "R":
            this.today.typeFull = "Reg";
            break;
          case "L":
            this.today.typeFull = "LS";
            break;
          case "E":
            this.today.typeFull = "ER";
            break;
          case "X":
            this.today.typeFull = "Exam";
            break;
          case "N":
            this.today.typeFull = "N/A";
            break;
        }

        if (this.today.timeType == "R") {
          switch (this.today.type) {
            case "R":
              break;
            case "L":
              break;
            case "E":
              break;
            case "X":
              break;
            case "N":
              break;
          }
        } else if (this.today.timeType == "I") {
          if (data[i].iLunch != undefined) {
            if (data[i].iLunch != "") {
              this.lunchNumberSet = parseInt(data[i].iLunch);
            }
          }
          this.today.timeP1 = data[i].timeP1;
          this.today.timeP2 = data[i].timeP2;
          this.today.timeP3 = data[i].timeP3;
          this.today.timeP4 = data[i].timeP4;
          this.today.timeP5 = data[i].timeP5;
          this.today.timeP6 = data[i].timeP6;
          this.today.timeP7 = data[i].timeP7;
          this.today.timeP8 = data[i].timeP8;
        }

        if (this.periods.length < this.today.letters.length) {
          this.generateVisualPeriodArray();
          if (this.periods.length > this.today.letters.length) {
            this.periods = this.periods.slice(0, this.today.letters.length);
            this.currentDefaultFriendSchedule = this.currentDefaultFriendSchedule.slice(
              0,
              this.today.letters.length
            );
          }
        } else if (this.periods.length > this.today.letters.length) {
          this.periods = this.periods.slice(0, this.today.letters.length);
          this.currentDefaultFriendSchedule = this.currentDefaultFriendSchedule.slice(
            0,
            this.today.letters.length
          );
          console.log("splicing period array");
        }
        this.periodify();
        this.SLOG("Setting daySegCurrent to " + this.daySeg);
        this.daySegCurrent = this.daySeg;
      }
    }

    if (!found) {
      this.periods = [
        {
          number: "#",
          letter: "N/A",
          class: "No school today!",
          category: "N/A",
          class1: "No school today!",
          category1: "N/A",
          class2: "No school today!",
          category2: "N/A",
          class3: "No school today!",
          category3: "N/A",
          class4: "No school today!",
          category4: "N/A",
          class5: "No school today!",
          category5: "N/A",
          class6: "No school today!",
          category6: "N/A",
          class7: "No school today!",
          category7: "N/A",
          class8: "No school today!",
          category8: "N/A",
          isLunch: "0",
          timeStart: "",
          timeEnd: "",
        },
      ];
      this.SLOG("Setting daySegCurrent to " + this.daySeg);
      this.daySegCurrent = this.daySeg;
    }

    this.processFriendLunches();
    this.handleNotifications(overwrite);
  }

  generateVisualPeriodArray() {
    console.log("Re-gen period array");
    this.periods = [
      {
        number: "1",
        letter: "X",
        class: "Tap to change",
        category: "not chosen",
        class1: "Tap to change",
        category1: "not chosen",
        class2: "Tap to change",
        category2: "not chosen",
        class3: "Tap to change",
        category3: "not chosen",
        class4: "Tap to change",
        category4: "not chosen",
        class5: "Tap to change",
        category5: "not chosen",
        class6: "Tap to change",
        category6: "not chosen",
        class7: "Tap to change",
        category7: "not chosen",
        class8: "Tap to change",
        category8: "not chosen",
        isLunch: "0",
        timeStart: "",
        timeEnd: "",
      },
      {
        number: "2",
        letter: "X",
        class: "Tap to change",
        category: "not chosen",
        class1: "Tap to change",
        category1: "not chosen",
        class2: "Tap to change",
        category2: "not chosen",
        class3: "Tap to change",
        category3: "not chosen",
        class4: "Tap to change",
        category4: "not chosen",
        class5: "Tap to change",
        category5: "not chosen",
        class6: "Tap to change",
        category6: "not chosen",
        class7: "Tap to change",
        category7: "not chosen",
        class8: "Tap to change",
        category8: "not chosen",
        isLunch: "0",
        timeStart: "",
        timeEnd: "",
      },
      {
        number: "3",
        letter: "X",
        class: "Tap to change",
        category: "not chosen",
        class1: "Tap to change",
        category1: "not chosen",
        class2: "Tap to change",
        category2: "not chosen",
        class3: "Tap to change",
        category3: "not chosen",
        class4: "Tap to change",
        category4: "not chosen",
        class5: "Tap to change",
        category5: "not chosen",
        class6: "Tap to change",
        category6: "not chosen",
        class7: "Tap to change",
        category7: "not chosen",
        class8: "Tap to change",
        category8: "not chosen",
        isLunch: "0",
        timeStart: "",
        timeEnd: "",
      },
      {
        number: "4",
        letter: "X",
        class: "Tap to change",
        category: "not chosen",
        class1: "Tap to change",
        category1: "not chosen",
        class2: "Tap to change",
        category2: "not chosen",
        class3: "Tap to change",
        category3: "not chosen",
        class4: "Tap to change",
        category4: "not chosen",
        class5: "Tap to change",
        category5: "not chosen",
        class6: "Tap to change",
        category6: "not chosen",
        class7: "Tap to change",
        category7: "not chosen",
        class8: "Tap to change",
        category8: "not chosen",
        isLunch: "0",
        timeStart: "",
        timeEnd: "",
      },
      {
        number: "5",
        letter: "X",
        class: "Tap to change",
        category: "not chosen",
        class1: "Tap to change",
        category1: "not chosen",
        class2: "Tap to change",
        category2: "not chosen",
        class3: "Tap to change",
        category3: "not chosen",
        class4: "Tap to change",
        category4: "not chosen",
        class5: "Tap to change",
        category5: "not chosen",
        class6: "Tap to change",
        category6: "not chosen",
        class7: "Tap to change",
        category7: "not chosen",
        class8: "Tap to change",
        category8: "not chosen",
        isLunch: "0",
        timeStart: "",
        timeEnd: "",
      },
      {
        number: "6",
        letter: "X",
        class: "Tap to change",
        category: "not chosen",
        class1: "Tap to change",
        category1: "not chosen",
        class2: "Tap to change",
        category2: "not chosen",
        class3: "Tap to change",
        category3: "not chosen",
        class4: "Tap to change",
        category4: "not chosen",
        class5: "Tap to change",
        category5: "not chosen",
        class6: "Tap to change",
        category6: "not chosen",
        class7: "Tap to change",
        category7: "not chosen",
        class8: "Tap to change",
        category8: "not chosen",
        isLunch: "0",
        timeStart: "",
        timeEnd: "",
      },
      {
        number: "7",
        letter: "X",
        class: "Tap to change",
        category: "not chosen",
        class1: "Tap to change",
        category1: "not chosen",
        class2: "Tap to change",
        category2: "not chosen",
        class3: "Tap to change",
        category3: "not chosen",
        class4: "Tap to change",
        category4: "not chosen",
        class5: "Tap to change",
        category5: "not chosen",
        class6: "Tap to change",
        category6: "not chosen",
        class7: "Tap to change",
        category7: "not chosen",
        class8: "Tap to change",
        category8: "not chosen",
        isLunch: "0",
        timeStart: "",
        timeEnd: "",
      },
      {
        number: "8",
        letter: "X",
        class: "Tap to change",
        category: "not chosen",
        class1: "Tap to change",
        category1: "not chosen",
        class2: "Tap to change",
        category2: "not chosen",
        class3: "Tap to change",
        category3: "not chosen",
        class4: "Tap to change",
        category4: "not chosen",
        class5: "Tap to change",
        category5: "not chosen",
        class6: "Tap to change",
        category6: "not chosen",
        class7: "Tap to change",
        category7: "not chosen",
        class8: "Tap to change",
        category8: "not chosen",
        isLunch: "0",
        timeStart: "",
        timeEnd: "",
      },
    ];
  }

  calculateLunch(category): string {
    var lunch: string = "0";
    for (var i = 0; i < this.classConfig.length; i++) {
      if (category == this.classConfig[i].name) {
        lunch = this.classConfig[i].lunch;
      }
    }

    console.log("Calculated lunch: " + lunch);
    return lunch;
  }

  getTimeStartComp(input: string): string {
    //HH:MM-HH:MM
    return input.split("-")[0];
  }

  getTimeEndComp(input: string): string {
    return input.split("-")[1];
  }

  getTimeStart(period: number): string {
    console.log(
      "Getting time for period " +
        period +
        " for day time type " +
        this.today.timeType
    );
    if (this.today.timeType == "R") {
      if (this.today.type == "R") {
        if (this.today.letters.includes("Z")) {
          return this.timeRegularWithAPR[period - 1].timeStart.toString();
        } else {
          return this.timeRegularR[period - 1].timeStart.toString();
        }
      } else if (this.today.type == "L") {
        return this.timeLateStartR[period - 1].timeStart.toString();
      } else if (this.today.type == "E") {
        if (this.today.letters.includes("Z")) {
          return this.timeEarlyReleaseWithAPR[period - 1].timeStart.toString();
        } else {
          if (this.today.letters.length == 7) {
            return this.timeEarlyReleaseAllWithoutAPR[
              period - 1
            ].timeStart.toString();
          } else {
            return this.timeEarlyReleaseWithoutAPR[
              period - 1
            ].timeStart.toString();
          }
        }
      }
    } else if (this.today.timeType == "I") {
      var ret: string = "";
      switch (period) {
        case 1:
          ret = this.getTimeStartComp(this.today.timeP1);
          break;
        case 2:
          ret = this.getTimeStartComp(this.today.timeP2);
          break;
        case 3:
          ret = this.getTimeStartComp(this.today.timeP3);
          break;
        case 4:
          ret = this.getTimeStartComp(this.today.timeP4);
          break;
        case 5:
          ret = this.getTimeStartComp(this.today.timeP5);
          break;
        case 6:
          ret = this.getTimeStartComp(this.today.timeP6);
          break;
        case 7:
          ret = this.getTimeStartComp(this.today.timeP7);
          break;
        case 8:
          ret = this.getTimeStartComp(this.today.timeP8);
          break;
      }
      return ret;
    }
    return "HH:MM";
  }

  getTimeEnd(period: number): string {
    if (this.today.timeType == "R") {
      if (this.today.type == "R") {
        if (this.today.letters.includes("Z")) {
          return this.timeRegularWithAPR[period - 1].timeEnd.toString();
        } else {
          return this.timeRegularR[period - 1].timeEnd.toString();
        }
      } else if (this.today.type == "L") {
        return this.timeLateStartR[period - 1].timeEnd.toString();
      } else if (this.today.type == "E") {
        if (this.today.letters.includes("Z")) {
          return this.timeEarlyReleaseWithAPR[period - 1].timeEnd.toString();
        } else {
          if (this.today.letters.length == 7) {
            return this.timeEarlyReleaseAllWithoutAPR[
              period - 1
            ].timeEnd.toString();
          } else {
            return this.timeEarlyReleaseWithoutAPR[
              period - 1
            ].timeEnd.toString();
          }
        }
      }
    } else if (this.today.timeType == "I") {
      var ret: string = "";
      switch (period) {
        case 1:
          ret = this.getTimeEndComp(this.today.timeP1);
          break;
        case 2:
          ret = this.getTimeEndComp(this.today.timeP2);
          break;
        case 3:
          ret = this.getTimeEndComp(this.today.timeP3);
          break;
        case 4:
          ret = this.getTimeEndComp(this.today.timeP4);
          break;
        case 5:
          ret = this.getTimeEndComp(this.today.timeP5);
          break;
        case 6:
          ret = this.getTimeEndComp(this.today.timeP6);
          break;
        case 7:
          ret = this.getTimeEndComp(this.today.timeP7);
          break;
        case 8:
          ret = this.getTimeEndComp(this.today.timeP8);
          break;
      }
      return ret;
    }
    return "HH:MM";
  }

  convertTimeForPeriod(time: string): string {
    if (time.startsWith("0")) {
      return time.substring(1, time.length);
    }
    return time;
  }

  convertPeriodTimeForPeriod(time: string): string {
    if (time.split(":")[0].length < 2) {
      return "0" + time;
    }
    return time;
  }

  getLunchNumberFromPData(p): number {
    var l: number = -1;
    for (var i: number = 0; i < p.length; i++) {
      if (parseInt(p[i].isLunch) > 0) {
        l = parseInt(p[i].isLunch);
      }
    }
    return l;
  }

  periodifyData(type, number, letters): Object {
    var p = [
      {
        letter: "",
        name: "",
        category: "",
        isLunch: "",
        number: number,
      },
      {
        letter: "",
        name: "",
        category: "",
        isLunch: "",
        number: number,
      },
      {
        letter: "",
        name: "",
        category: "",
        isLunch: "",
        number: number,
      },
      {
        letter: "",
        name: "",
        category: "",
        isLunch: "",
        number: number,
      },
      {
        letter: "",
        name: "",
        category: "",
        isLunch: "",
        number: number,
      },
      {
        letter: "",
        name: "",
        category: "",
        isLunch: "",
        number: number,
      },
      {
        letter: "",
        name: "",
        category: "",
        isLunch: "",
        number: number,
      },
      {
        letter: "",
        name: "",
        category: "",
        isLunch: "",
        number: number,
      },
    ];
    if (type == "R" || type == "E" || type == "L" || type == "X") {
      if (p.length > letters.length) {
        p = p.slice(0, letters.length);
      }
    } else {
    }
    for (var i: number = 0; i < letters.length; i++) {
      var classDataSelected = this.getSelectedData(number);
      switch (letters[i]) {
        case "A":
          p[i].letter = "A";
          p[i].name = classDataSelected[0].className;
          p[i].category = classDataSelected[0].classCategory;
          break;
        case "B":
          p[i].letter = "B";
          p[i].name = classDataSelected[1].className;
          p[i].category = classDataSelected[1].classCategory;
          break;
        case "C":
          p[i].letter = "C";
          p[i].name = classDataSelected[2].className;
          p[i].category = classDataSelected[2].classCategory;
          break;
        case "D":
          p[i].letter = "D";
          p[i].name = classDataSelected[3].className;
          p[i].category = classDataSelected[3].classCategory;
          break;
        case "E":
          p[i].letter = "E";
          p[i].name = classDataSelected[4].className;
          p[i].category = classDataSelected[4].classCategory;
          break;
        case "F":
          p[i].letter = "F";
          p[i].name = classDataSelected[5].className;
          p[i].category = classDataSelected[5].classCategory;
          break;
        case "G":
          p[i].letter = "G";
          p[i].name = classDataSelected[6].className;
          p[i].category = classDataSelected[6].classCategory;
          break;
        case "Z":
          p[i].letter = "AP";
          p[i].name = "Activity Period";
          p[i].category = "X";
          break;
      }
      if (type == "R") {
        if (i == p.length - 3) {
          p[i].isLunch = this.calculateLunch(p[i].category);
        } else {
          p[i].isLunch = "-1";
        }
      } else if (type == "L") {
        if (i == p.length - 3) {
          p[i].isLunch = this.calculateLunch(p[i].category);
        } else {
          p[i].isLunch = "-1";
        }
      } else {
        p[i].isLunch = "-1";
      }
    }
    return p;
  }

  periodify() {
    console.log("Periodify");
    if (
      this.today.type == "R" ||
      this.today.type == "E" ||
      this.today.type == "L" ||
      this.today.type == "X"
    ) {
      for (var i: number = 0; i < this.periods.length; i++) {
        this.periods[i].number = (i + 1).toString();
        this.periods[i].letter = this.today.letters.substring(i, i + 1);
        console.log("loading JSON for " + this.periods[i].letter);

        var classDataSelected;
        console.log(
          "Using number " + this.today.number + " to determine visible"
        );
        classDataSelected = this.getSelectedData(this.today.number);
        console.log("today is #: " + this.today.number);

        switch (this.periods[i].letter) {
          case "A":
            this.periods[i].class = classDataSelected[0].className;
            this.periods[i].category = classDataSelected[0].classCategory;
            break;
          case "B":
            this.periods[i].class = classDataSelected[1].className;
            this.periods[i].category = classDataSelected[1].classCategory;
            break;
          case "C":
            this.periods[i].class = classDataSelected[2].className;
            this.periods[i].category = classDataSelected[2].classCategory;
            break;
          case "D":
            this.periods[i].class = classDataSelected[3].className;
            this.periods[i].category = classDataSelected[3].classCategory;
            break;
          case "E":
            this.periods[i].class = classDataSelected[4].className;
            this.periods[i].category = classDataSelected[4].classCategory;
            break;
          case "F":
            this.periods[i].class = classDataSelected[5].className;
            this.periods[i].category = classDataSelected[5].classCategory;
            break;
          case "G":
            this.periods[i].class = classDataSelected[6].className;
            this.periods[i].category = classDataSelected[6].classCategory;
            break;
          case "Z":
            this.periods[i].letter = "AP";
            this.periods[i].class = "Activity Period";
            this.periods[i].category = "N/A";
            break;
        }
        console.log(
          "loaded JSON [" +
            this.today.number +
            "]: " +
            this.periods[i].class +
            " " +
            this.periods[i].category
        );
        this.periods[i].timeStart = this.convertTimeForPeriod(
          this.getTimeStart(i + 1)
        );
        this.periods[i].timeEnd = this.convertTimeForPeriod(
          this.getTimeEnd(i + 1)
        );
        console.log(
          "Found time Start[" +
            this.periods[i].timeStart +
            "] End[" +
            this.periods[i].timeEnd +
            "]"
        );
        if (this.today.type == "R") {
          if (i == this.lunchNumberSet) {
            this.lunchPeriod = this.periods[i].letter + this.today.number;
            this.today.lunchNumber = this.calculateLunch(
              this.periods[i].category
            );
            this.periods[i].isLunch = this.today.lunchNumber;
          } else {
            this.periods[i].isLunch = "0";
          }
        } else if (this.today.type == "L") {
          if (i == this.lunchNumberSet) {
            this.lunchPeriod = this.periods[i].letter + this.today.number;
            this.today.lunchNumber = this.calculateLunch(
              this.periods[i].category
            );
            this.periods[i].isLunch = this.today.lunchNumber;
          } else {
            this.periods[i].isLunch = "0";
          }
        } else if (this.today.type == "X") {
          if (i == this.lunchNumberSet) {
            this.lunchPeriod = this.periods[i].letter + this.today.number;
            this.today.lunchNumber = this.calculateLunch(
              this.periods[i].category
            );
            this.periods[i].isLunch = this.today.lunchNumber;
          } else {
            this.periods[i].isLunch = "0";
          }
        } else {
          this.periods[i].isLunch = "0";
        }
      }
      if (this.periods[i] != undefined) {
        console.log("Lunch? ", this.periods[i].isLunch);
      }
      if (this.showingFriendSchedule) {
        this.friendify();
      }
    } else {
      this.periods = [
        {
          number: "#",
          letter: "N/A",
          class: "No school today!",
          category: "N/A",
          class1: "No school today!",
          category1: "N/A",
          class2: "No school today!",
          category2: "N/A",
          class3: "No school today!",
          category3: "N/A",
          class4: "No school today!",
          category4: "N/A",
          class5: "No school today!",
          category5: "N/A",
          class6: "No school today!",
          category6: "N/A",
          class7: "No school today!",
          category7: "N/A",
          class8: "No school today!",
          category8: "N/A",
          isLunch: "0",
          timeStart: "",
          timeEnd: "",
        },
      ];
    }
  }

  getYear(dateMod): number {
    return parseInt(dateMod.substring(0, 4));
  }

  getMonth(dateMod): number {
    return parseInt(dateMod.substring(5, 7));
  }

  getDay(dateMod): number {
    return parseInt(dateMod.substring(8, 10));
  }

  tabClick(day) {
    console.log("User clicked " + day + " currently: " + this.daySegCurrent);
    this.daySeg = day;
    if (day != this.daySegCurrent) {
      switch (day) {
        case "monday":
          this.setVisibleData(this.weekDataDateMods[0].dateMod, false, false);
          break;
        case "tuesday":
          this.setVisibleData(this.weekDataDateMods[1].dateMod, false, false);
          break;
        case "wednesday":
          this.setVisibleData(this.weekDataDateMods[2].dateMod, false, false);
          break;
        case "thursday":
          this.setVisibleData(this.weekDataDateMods[3].dateMod, false, false);
          break;
        case "friday":
          this.setVisibleData(this.weekDataDateMods[4].dateMod, false, false);
          break;
        case "monday2":
          this.setVisibleData(this.weekDataDateMods[5].dateMod, false, false);
          break;
      }
    }
  }

  updatePeriodData(period) {
    var sClass;
    var sCategory;
    switch (this.today.number.toString()) {
      case "1":
        sClass = period.class1;
        sCategory = period.category1;
        break;
      case "2":
        sClass = period.class2;
        sCategory = period.category2;
        break;
      case "3":
        sClass = period.class3;
        sCategory = period.category3;
        break;
      case "4":
        sClass = period.class4;
        sCategory = period.category4;
        break;
      case "5":
        sClass = period.class5;
        sCategory = period.category5;
        break;
      case "6":
        sClass = period.class6;
        sCategory = period.category6;
        break;
      case "7":
        sClass = period.class7;
        sCategory = period.category7;
        break;
      case "8":
        sClass = period.class8;
        sCategory = period.category8;
        break;
    }
    period.class = sClass;
    period.category = sCategory;

    var cdNumber: number = -1;
    switch (period.letter) {
      case "A":
        cdNumber = 0;
        break;
      case "B":
        cdNumber = 1;
        break;
      case "C":
        cdNumber = 2;
        break;
      case "D":
        cdNumber = 3;
        break;
      case "E":
        cdNumber = 4;
        break;
      case "F":
        cdNumber = 5;
        break;
      case "G":
        cdNumber = 6;
        break;
    }

    this.us.classDataDay1[cdNumber].className = period.class1;
    this.us.classDataDay1[cdNumber].classCategory = period.category1;
    this.us.classDataDay2[cdNumber].className = period.class2;
    this.us.classDataDay2[cdNumber].classCategory = period.category2;
    this.us.classDataDay3[cdNumber].className = period.class3;
    this.us.classDataDay3[cdNumber].classCategory = period.category3;
    this.us.classDataDay4[cdNumber].className = period.class4;
    this.us.classDataDay4[cdNumber].classCategory = period.category4;
    this.us.classDataDay5[cdNumber].className = period.class5;
    this.us.classDataDay5[cdNumber].classCategory = period.category5;
    this.us.classDataDay6[cdNumber].className = period.class6;
    this.us.classDataDay6[cdNumber].classCategory = period.category6;
    this.us.classDataDay7[cdNumber].className = period.class7;
    this.us.classDataDay7[cdNumber].classCategory = period.category7;
    this.us.classDataDay8[cdNumber].className = period.class8;
    this.us.classDataDay8[cdNumber].classCategory = period.category8;

    console.log("Set class data arrays");
    console.log(
      "New setup for period: " + period.class + " " + period.category
    );
    if (this.today.type == "R") {
      if (period.number == (this.lunchNumberSet + 1).toString()) {
        this.lunchPeriod = period.letter + this.today.number;
        this.today.lunchNumber = this.calculateLunch(period.category);
        period.isLunch = this.today.lunchNumber;
      } else {
        period.isLunch = "0";
      }
    } else if (this.today.type == "L") {
      if (period.number == (this.lunchNumberSet + 1).toString()) {
        this.lunchPeriod = period.letter + this.today.number;
        this.today.lunchNumber = this.calculateLunch(period.category);
        period.isLunch = this.today.lunchNumber;
      } else {
        period.isLunch = "0";
      }
    } else {
      period.isLunch = "0";
    }
    this.setVisibleData(this.dateModC, true, false); //TODO change to current datemod
    /*for(var i : number = 0; i < this.periods.length; i++) {
      console.log("letter:" + this.periods[i].letter + " name:" + this.periods[i].class + " category:" + this.periods[i].category);
    }*/
  }

  cardClicked(event, period) {
    console.log("" + event + " PERIOD:" + period.number + period.letter);
    this.openClassEditor(period);
  }

  getSelectedData(number): Object {
    var classDataSelected;
    switch (number.toString()) {
      case "1":
        classDataSelected = this.us.classDataDay1;
        break;
      case "2":
        classDataSelected = this.us.classDataDay2;
        break;
      case "3":
        classDataSelected = this.us.classDataDay3;
        break;
      case "4":
        classDataSelected = this.us.classDataDay4;
        break;
      case "5":
        classDataSelected = this.us.classDataDay5;
        break;
      case "6":
        classDataSelected = this.us.classDataDay6;
        break;
      case "7":
        classDataSelected = this.us.classDataDay7;
        break;
      case "8":
        classDataSelected = this.us.classDataDay8;
        break;
    }
    console.log("Class data selected", classDataSelected);
    return classDataSelected;
  }

  getFriendSelectedData(number, userNumber) {
    var classDataSelected;
    var cDataN = this.us.convertScheduleLtoN(
      this.us.friendArrayDSorted[userNumber].dA,
      this.us.friendArrayDSorted[userNumber].dB,
      this.us.friendArrayDSorted[userNumber].dC,
      this.us.friendArrayDSorted[userNumber].dD,
      this.us.friendArrayDSorted[userNumber].dE,
      this.us.friendArrayDSorted[userNumber].dF,
      this.us.friendArrayDSorted[userNumber].dG
    );
    //console.log("cDataN", cDataN);
    switch (number.toString()) {
      case "1":
        classDataSelected = cDataN[0];
        break;
      case "2":
        classDataSelected = cDataN[1];
        break;
      case "3":
        classDataSelected = cDataN[2];
        break;
      case "4":
        classDataSelected = cDataN[3];
        break;
      case "5":
        classDataSelected = cDataN[4];
        break;
      case "6":
        classDataSelected = cDataN[5];
        break;
      case "7":
        classDataSelected = cDataN[6];
        break;
      case "8":
        classDataSelected = cDataN[7];
        break;
    }
    console.log("Class data selected friend", classDataSelected);
    return classDataSelected;
  }

  setValuesForClassData(letter, num, name, category) {
    this.setValuesForClassDataRaw(letter + "" + num, name, category);
  }

  setValuesForClassDataRaw(letterNum, name, category) {
    console.log("Set values class raw [" + letterNum + "]", [name, category]);
    var letter: string = letterNum.substring(0, 1);
    var number: string = letterNum.substring(1, 2);
    var cdNumber: number = -1;
    switch (letter) {
      case "A":
        cdNumber = 0;
        break;
      case "B":
        cdNumber = 1;
        break;
      case "C":
        cdNumber = 2;
        break;
      case "D":
        cdNumber = 3;
        break;
      case "E":
        cdNumber = 4;
        break;
      case "F":
        cdNumber = 5;
        break;
      case "G":
        cdNumber = 6;
        break;
    }
    console.log("Class Raw numbers", [cdNumber, number]);
    switch (number) {
      case "1":
        this.us.classDataDay1[cdNumber].className = name;
        this.us.classDataDay1[cdNumber].classCategory = category;
        console.log("Set raw", this.us.classDataDay1);
        break;
      case "2":
        this.us.classDataDay2[cdNumber].className = name;
        this.us.classDataDay2[cdNumber].classCategory = category;
        console.log("Set raw", this.us.classDataDay2);
        break;
      case "3":
        this.us.classDataDay3[cdNumber].className = name;
        this.us.classDataDay3[cdNumber].classCategory = category;
        console.log("Set raw", this.us.classDataDay3);
        break;
      case "4":
        this.us.classDataDay4[cdNumber].className = name;
        this.us.classDataDay4[cdNumber].classCategory = category;
        console.log("Set raw", this.us.classDataDay4);
        break;
      case "5":
        this.us.classDataDay5[cdNumber].className = name;
        this.us.classDataDay5[cdNumber].classCategory = category;
        console.log("Set raw", this.us.classDataDay5);
        break;
      case "6":
        this.us.classDataDay6[cdNumber].className = name;
        this.us.classDataDay6[cdNumber].classCategory = category;
        console.log("Set raw", this.us.classDataDay6);
        break;
      case "7":
        this.us.classDataDay7[cdNumber].className = name;
        this.us.classDataDay7[cdNumber].classCategory = category;
        console.log("Set raw", this.us.classDataDay7);
        break;
      case "8":
        this.us.classDataDay8[cdNumber].className = name;
        this.us.classDataDay8[cdNumber].classCategory = category;
        console.log("Set raw", this.us.classDataDay8);
        break;
    }

    console.log("ClassDataDay", [
      this.us.classDataDay1,
      this.us.classDataDay2,
      this.us.classDataDay3,
      this.us.classDataDay4,
      this.us.classDataDay5,
      this.us.classDataDay6,
      this.us.classDataDay7,
      this.us.classDataDay8,
    ]);
  }

  openClassEditor(period) {
    if (period.letter == "AP" || period.letter == "N/A") {
    } else {
      var cdNumber: number = -1;
      switch (period.letter) {
        case "A":
          cdNumber = 0;
          break;
        case "B":
          cdNumber = 1;
          break;
        case "C":
          cdNumber = 2;
          break;
        case "D":
          cdNumber = 3;
          break;
        case "E":
          cdNumber = 4;
          break;
        case "F":
          cdNumber = 5;
          break;
        case "G":
          cdNumber = 6;
          break;
      }

      let cePage = this.modalCtrl.create(ClassEditorPage, {
        classConfig: this.classConfig,
        letter: period.letter,
        name1: this.us.classDataDay1[cdNumber].className,
        category1: this.us.classDataDay1[cdNumber].classCategory,
        name2: this.us.classDataDay2[cdNumber].className,
        category2: this.us.classDataDay2[cdNumber].classCategory,
        name3: this.us.classDataDay3[cdNumber].className,
        category3: this.us.classDataDay3[cdNumber].classCategory,
        name4: this.us.classDataDay4[cdNumber].className,
        category4: this.us.classDataDay4[cdNumber].classCategory,
        name5: this.us.classDataDay5[cdNumber].className,
        category5: this.us.classDataDay5[cdNumber].classCategory,
        name6: this.us.classDataDay6[cdNumber].className,
        category6: this.us.classDataDay6[cdNumber].classCategory,
        name7: this.us.classDataDay7[cdNumber].className,
        category7: this.us.classDataDay7[cdNumber].classCategory,
        name8: this.us.classDataDay8[cdNumber].className,
        category8: this.us.classDataDay8[cdNumber].classCategory,
      });
      cePage.present();
      cePage.onDidDismiss((data) => {
        console.log("DISMISSED. start data save");
        if (data != undefined) {
          if (data.modifier != "xxx") {
            this.receivedClassName1 = data.className1;
            this.receivedClassCategory1 = data.classCategory1;
            this.receivedClassName2 = data.className2;
            this.receivedClassCategory2 = data.classCategory2;
            this.receivedClassName3 = data.className3;
            this.receivedClassCategory3 = data.classCategory3;
            this.receivedClassName4 = data.className4;
            this.receivedClassCategory4 = data.classCategory4;
            this.receivedClassName5 = data.className5;
            this.receivedClassCategory5 = data.classCategory5;
            this.receivedClassName6 = data.className6;
            this.receivedClassCategory6 = data.classCategory6;
            this.receivedClassName7 = data.className7;
            this.receivedClassCategory7 = data.classCategory7;
            this.receivedClassName8 = data.className8;
            this.receivedClassCategory8 = data.classCategory8;
            period.class1 =
              this.receivedClassName1 != undefined
                ? this.receivedClassName1
                : period.class1;
            period.category1 =
              this.receivedClassCategory1 != undefined
                ? this.receivedClassCategory1
                : period.category1;
            period.class2 =
              this.receivedClassName2 != undefined
                ? this.receivedClassName2
                : period.class2;
            period.category2 =
              this.receivedClassCategory2 != undefined
                ? this.receivedClassCategory2
                : period.category2;
            period.class3 =
              this.receivedClassName3 != undefined
                ? this.receivedClassName3
                : period.class3;
            period.category3 =
              this.receivedClassCategory3 != undefined
                ? this.receivedClassCategory3
                : period.category3;
            period.class4 =
              this.receivedClassName4 != undefined
                ? this.receivedClassName4
                : period.class4;
            period.category4 =
              this.receivedClassCategory4 != undefined
                ? this.receivedClassCategory4
                : period.category4;
            period.class5 =
              this.receivedClassName5 != undefined
                ? this.receivedClassName5
                : period.class5;
            period.category5 =
              this.receivedClassCategory5 != undefined
                ? this.receivedClassCategory5
                : period.category5;
            period.class6 =
              this.receivedClassName6 != undefined
                ? this.receivedClassName6
                : period.class6;
            period.category6 =
              this.receivedClassCategory6 != undefined
                ? this.receivedClassCategory6
                : period.category6;
            period.class7 =
              this.receivedClassName7 != undefined
                ? this.receivedClassName7
                : period.class7;
            period.category7 =
              this.receivedClassCategory7 != undefined
                ? this.receivedClassCategory7
                : period.category7;
            period.class8 =
              this.receivedClassName8 != undefined
                ? this.receivedClassName8
                : period.class8;
            period.category8 =
              this.receivedClassCategory8 != undefined
                ? this.receivedClassCategory8
                : period.category8;

            var c = -1;
            switch (period.letter) {
              case "A":
                c = 0;
                break;
              case "B":
                c = 1;
                break;
              case "C":
                c = 2;
                break;
              case "D":
                c = 3;
                break;
              case "E":
                c = 4;
                break;
              case "F":
                c = 5;
                break;
              case "G":
                c = 6;
                break;
            }

            console.log("Attempting to save period", period);
            this.us.classDataDay1[c].className = period.class1;
            this.us.classDataDay1[c].classCategory = period.category1;

            this.us.classDataDay2[c].className = period.class2;
            this.us.classDataDay2[c].classCategory = period.category2;

            this.us.classDataDay3[c].className = period.class3;
            this.us.classDataDay3[c].classCategory = period.category3;

            this.us.classDataDay4[c].className = period.class4;
            this.us.classDataDay4[c].classCategory = period.category4;

            this.us.classDataDay5[c].className = period.class5;
            this.us.classDataDay5[c].classCategory = period.category5;

            this.us.classDataDay6[c].className = period.class6;
            this.us.classDataDay6[c].classCategory = period.category6;

            this.us.classDataDay7[c].className = period.class7;
            this.us.classDataDay7[c].classCategory = period.category7;

            this.us.classDataDay8[c].className = period.class8;
            this.us.classDataDay8[c].classCategory = period.category8;

            this.us.pushPersonalSchedule(this.sql).then((res) => {
              if (res[0].status && this.us.authorized && !this.us.suspended) {
                this.updatePeriodData(period);
                this.sendToast("Success", "Schedule saved!");
                //this.handleNotifications(true);
                this.needsOverwrite = true;
              } else {
                var response = res[0].response;
                this.sendToast(
                  "Uh Oh!",
                  "There was a problem saving your schedule. You must be logged in!"
                );
              }
            });
          } else {
            console.log("Canceled");
          }
        } else {
          console.log("Canceled");
        }
      });
    }
    //console.log(this.receivedClassName);
  }

  devVars = [
    {
      key: "source",
      value: "0",
    },
  ];

  getDevValue(key: string): string {
    for (var i: number = 0; i < this.devVars.length; i++) {
      if (this.devVars[i].key == key) {
        return this.devVars[i].value;
      }
    }
    return "null";
  }

  saveInitialDev(i) {
    return new Promise((resolve, err) => {
      this.sql
        .query("INSERT INTO devData (devKey, devValue) VALUES (?, ?)", [
          this.devVars[i].key,
          this.devVars[i].value,
        ])
        .then((res) => {
          if (i + 1 < this.devVars.length) {
            this.saveInitialDev(i + 1).then((res) => {
              if (res == "T") {
                resolve("T");
              }
            });
          } else {
            resolve("T");
          }
        })
        .catch((error) => {
          console.log("Initial Dev SQL error", error);
        });
    });
  }

  loadDevValues() {
    return new Promise((resolve, err) => {
      this.sql.query("SELECT * FROM devData").then(
        (data) => {
          console.log("FOUND DEV SQL TABLE");
          if (data.res.rows.length > 0) {
            console.log("FOUND DEV SQL DATA SET");
            console.log("Dev Rows", data.res.rows);
            for (let i = 0; i < data.res.rows.length; i++) {
              this.devVars[i].key = data.res.rows.item(i).devKey;
              this.devVars[i].value = data.res.rows.item(i).devValue;
            }
            resolve("T");
          } else {
            //create new placeholder data
            this.saveInitialDev(0).then(
              (res) => {
                console.log("Save Initial Dev success");
                resolve("T");
              },
              (err) => {
                console.log("Save Initial Dev error", err);
              }
            );
          }
        },
        (error) => {
          console.log("SQL error", error);
        }
      );
    });
  }

  setDevValue(key: string, value: string) {
    return new Promise((resolve, err) => {
      this.sql
        .query(
          'UPDATE devData SET devKey = "' +
            key +
            '", devValue = "' +
            value +
            '" WHERE devKey = "' +
            key +
            '"'
        )
        .then(
          (sqldata) => {
            console.log("Dev Key [" + key + "] set", value);
            resolve("T");
          },
          (error) => {
            console.log("Dev Value Set error", error);
            resolve("F");
          }
        );
    });
  }

  devResetWebSource() {
    this.setDevValue("source", "0");
  }

  devTriggerUpdate() {
    this.setDevValue("source", "1");
  }
}
