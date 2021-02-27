import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import {
  AlertController,
  ToastController,
  LoadingController,
} from "ionic-angular";
import { DtService } from "../providers/dt-service";
import "rxjs/add/operator/map";

@Injectable()
export class UserService {
  public suspended: boolean = false;

  public authorized: boolean = false;
  public bypass: boolean = false;
  public loadedLocal: boolean = false;
  public reqUpdate: boolean = false;
  public needsAuthorization: boolean = false;

  public loader: any;

  public username: string = "";
  public password: string = "";
  public gradYear: string = "";
  public firstName: string = "";
  public lastName: string = "";
  public people: string = "";
  public peopleArray = [];
  public friends: string = "";
  public friendArray = [];
  public friendArrayD = [];
  public friendArrayDSorted = [];
  public nonfriendArray = [];
  public requests: string = "";
  public requestArray = [];
  public requestArrayR = [];
  public requestArrayS = [];
  public requestNumber: number = 0;
  public compactA: string = "";
  public compactB: string = "";
  public compactC: string = "";
  public compactD: string = "";
  public compactE: string = "";
  public compactF: string = "";
  public compactG: string = "";
  public verified: boolean = false;
  public superUser: boolean = false;
  public privacy: number = 2;
  public autoLoggedIn: boolean = false;
  public updateNew: boolean = false;

  public users = [];

  classDataDay1 = [];
  classDataDay2 = [];
  classDataDay3 = [];
  classDataDay4 = [];
  classDataDay5 = [];
  classDataDay6 = [];
  classDataDay7 = [];
  classDataDay8 = [];

  public dataSchedule = [];
  public dataSettings;

  public lastSyncVersion = "YYYY-MM-DD";

  constructor(
    public http: Http,
    public dt: DtService,
    public ac: AlertController,
    public tc: ToastController,
    public lc: LoadingController
  ) {
    this.http = http;
  }

  /*
$targetVersion = $_GET["version"];
$targetReq = $_GET["req"];
$targetMandatory = $_GET["mandatory"];
$targetLunch1 = $_GET["lunch1"];
$targetLunch2 = $_GET["lunch2"];
$targetLunch3 = $_GET["lunch3"];
$targetLunch4 = $_GET["lunch4"];
$targetTimeRegularR = $_GET["timeRegularR"];
$targetTimeRegularWithAPR = $_GET["timeRegularWithAPR"];
$targetTimeLateStartR = $_GET["timeLateStartR"];
$targetTimeEarlyReleaseWithAPR = $_GET["timeEarlyReleaseWithAPR"];
$targetTimeEarlyReleaseWithoutAPR = $_GET["timeEarlyReleaseWithoutAPR"];
$targetTimeEarlyReleaseAllWithoutAPR = $_GET["timeEarlyReleaseAllWithoutAPR"];
  */

  syncSettings() {
    return new Promise((resolve) => {
      var lunches = this.compressLunches(this.dataSettings);
      var target: string =
        "https://jefftc.com/oneday/us/updateSettings.php" +
        "?username=" +
        this.username +
        "&password=" +
        this.password +
        "&version=" +
        this.dataSettings.version +
        "&req=" +
        this.dataSettings.req +
        "&mandatory=" +
        this.dataSettings.mandatory +
        "&lunch1=" +
        lunches[0] +
        "&lunch2=" +
        lunches[1] +
        "&lunch3=" +
        lunches[2] +
        "&lunch4=" +
        lunches[3] +
        "&timeRegularR=" +
        this.compressTime(this.dataSettings.timeRegularR) +
        "&timeRegularWithAPR=" +
        this.compressTime(this.dataSettings.timeRegularWithAPR) +
        "&timeLateStartR=" +
        this.compressTime(this.dataSettings.timeLateStartR) +
        "&timeEarlyReleaseWithAPR=" +
        this.compressTime(this.dataSettings.timeEarlyReleaseWithAPR) +
        "&timeEarlyReleaseWithoutAPR=" +
        this.compressTime(this.dataSettings.timeEarlyReleaseWithoutAPR) +
        "&timeEarlyReleaseAllWithoutAPR=" +
        this.compressTime(this.dataSettings.timeEarlyReleaseAllWithoutAPR);
      console.log("Settings target", [target]);
      this.http
        .get(target)
        .map((res) => res.json())
        .subscribe((data) => {
          if (data != undefined) {
            if (data.status) {
              console.log("Settings updated", this.dataSettings, data);
              resolve([true]);
            } else {
              console.log("Settings update failed", this.dataSettings, data);
              resolve([false]);
            }
          } else {
            console.log("Settings update failed", this.dataSettings, data);
            resolve([false]);
          }
        });
    });
  }

  compressLunches(data) {
    var l1 = data.lunch1.slice();
    var l2 = data.lunch2.slice();
    var l3 = data.lunch3.slice();
    var l4 = data.lunch4.slice();
    var lNAC = data.lunchNAC;
    var lAll = data.lunchAll;
    var lunches = [l1, l2, l3, l4];
    var lunchString = ["", "", "", ""];

    for (var i = 0; i < lAll.length; i++) {
      lunches[0].push(lAll[i]);
      lunches[1].push(lAll[i]);
      lunches[2].push(lAll[i]);
      lunches[3].push(lAll[i]);
    }

    for (var i = 0; i < lunches.length; i++) {
      for (var c = 0; c < lunches[i].length; c++) {
        lunchString[i] += "~~" + lunches[i][c];
      }
      lunchString[i] += "~~";
    }

    return lunchString;
  }

  compressTime(time) {
    var timeString = "~~";
    for (var i = 0; i < time.length; i++) {
      timeString += time[i].timeStart + "-" + time[i].timeEnd + "~~";
    }
    return timeString;
  }

  syncScheduleDay(day) {
    return new Promise((resolve) => {
      var target: string =
        "https://jefftc.com/oneday/us/updateSchedule.php" +
        "?username=" +
        this.username +
        "&password=" +
        this.password +
        "&date=" +
        day.date +
        "&type=" +
        day.type +
        "&letters=" +
        this.getStringFromArray(day.letters) +
        "&number=" +
        day.number +
        "&timeType=" +
        day.timeType +
        "&iLunch=" +
        day.iLunch +
        "&timeP1=" +
        day.timeP1S +
        "-" +
        day.timeP1E +
        "&timeP2=" +
        day.timeP2S +
        "-" +
        day.timeP2E +
        "&timeP3=" +
        day.timeP3S +
        "-" +
        day.timeP3E +
        "&timeP4=" +
        day.timeP4S +
        "-" +
        day.timeP4E +
        "&timeP5=" +
        day.timeP5S +
        "-" +
        day.timeP5E +
        "&timeP6=" +
        day.timeP6S +
        "-" +
        day.timeP6E +
        "&timeP7=" +
        day.timeP7S +
        "-" +
        day.timeP7E +
        "&timeP8=" +
        day.timeP8S +
        "-" +
        day.timeP8E +
        "&autoEdit=" +
        day.autoEdit +
        "&anchor=" +
        day.anchor +
        "&countNumber=" +
        day.countNumber;
      console.log("Schedule target", [target]);
      this.http
        .get(target)
        .map((res) => res.json())
        .subscribe((data) => {
          if (data != undefined) {
            if (data.status) {
              console.log("Schedule updated", day, data);
              day.changed = false;
              resolve([true]);
            } else {
              console.log("Schedule update failed", day, data);
              resolve([false]);
            }
          } else {
            console.log("Schedule update failed", day, data);
            resolve([false]);
          }
        });
    });
  }

  syncScheduleArray(index) {
    return new Promise((resolve) => {
      if (index < this.dataSchedule.length) {
        if (this.dataSchedule[index].changed) {
          this.syncScheduleDay(this.dataSchedule[index]).then((res) => {
            this.syncScheduleArray(index + 1).then((res) => {
              resolve();
            });
          });
        } else {
          this.syncScheduleArray(index + 1).then((res) => {
            resolve();
          });
        }
      } else {
        resolve();
      }
    });
  }

  syncSchedule() {
    return new Promise((resolve) => {
      console.log("Schedule sync starting");
      this.syncScheduleArray(0).then((res) => {
        console.log("Schedule sync finished");
        resolve();
      });
    });
  }

  getSchedule() {
    return new Promise((resolve) => {
      var target: string = "https://jefftc.com/oneday/us/getSchedule.php";
      this.http
        .get(target)
        .map((res) => res.json())
        .subscribe((data) => {
          if (data != undefined) {
            console.log("GetSchedule data", data);
            this.processSchedule(data.schedule);
            resolve();
          }
        });
    });
  }

  sortSchedule(data) {
    console.log("Pre Sort", data);
    var d = data.slice();
    d.sort(function (a, b) {
      console.log("Sorting", [a, b]);
      var aL = a.date;
      var bL = b.date;
      return aL < bL ? -1 : aL > bL ? 1 : 0;
    });
    console.log("Post Sort", data);
    return d;
  }

  convertDateToNumber(date: string): number {
    //2016-12-14
    console.log(date);
    var year = this.dt.getYear(date);
    var month = this.dt.getMonth(date);
    var day = this.dt.getDay(date);
    var idNumber: number = month * 100 + day;
    return idNumber;
  }

  processSchedule(data) {
    console.log("Processing schedule");
    if (data != undefined) {
      this.dataSchedule = [];
      for (var i = 0; i < data.length; i++) {
        if (data[i].date == "SETTINGS") {
          this.processSettingsData(data[i]);
        } else {
          this.processScheduleData(data[i]);
        }
      }
    }
    this.dataSchedule = this.sortSchedule(this.dataSchedule);
    console.log("SETTINGS DATA", this.dataSettings);
    console.log("SCHEDULE DATA", this.dataSchedule);
  }

  processSettingsData(data) {
    this.dataSettings = data;
    var classes = this.dataSettings.classes;
    this.dataSettings.lunch1 = [];
    this.dataSettings.lunch2 = [];
    this.dataSettings.lunch3 = [];
    this.dataSettings.lunch4 = [];
    this.dataSettings.lunchAll = [];
    this.dataSettings.lunchNAC = [];
    this.dataSettings.lunchMax = 0;
    this.lastSyncVersion = this.dataSettings.version;
    for (var i = 0; i < classes.length; i++) {
      switch (classes[i].lunch) {
        case "1":
          this.dataSettings.lunch1.push(classes[i].name);
          if (this.dataSettings.lunch1.length > this.dataSettings.lunchMax) {
            this.dataSettings.lunchMax = this.dataSettings.lunch1.length;
          }
          break;
        case "2":
          this.dataSettings.lunch2.push(classes[i].name);
          if (this.dataSettings.lunch2.length > this.dataSettings.lunchMax) {
            this.dataSettings.lunchMax = this.dataSettings.lunch2.length;
          }
          break;
        case "3":
          this.dataSettings.lunch3.push(classes[i].name);
          if (this.dataSettings.lunch3.length > this.dataSettings.lunchMax) {
            this.dataSettings.lunchMax = this.dataSettings.lunch3.length;
          }
          break;
        case "4":
          this.dataSettings.lunch4.push(classes[i].name);
          if (this.dataSettings.lunch4.length > this.dataSettings.lunchMax) {
            this.dataSettings.lunchMax = this.dataSettings.lunch4.length;
          }
          break;
        case "All":
          this.dataSettings.lunchAll.push(classes[i].name);
          if (this.dataSettings.lunchAll.length > this.dataSettings.lunchMax) {
            this.dataSettings.lunchMax = this.dataSettings.lunchAll.length;
          }
          break;
        case "Need a Category":
          this.dataSettings.lunchNAC.push(classes[i].name);
          if (this.dataSettings.lunchNAC.length > this.dataSettings.lunchMax) {
            this.dataSettings.lunchMax = this.dataSettings.lunchNAC.length;
          }
          break;
      }
    }
  }

  processScheduleData(d) {
    var data = undefined;
    var tp1 = d.timeP1.split("-");
    var tp2 = d.timeP2.split("-");
    var tp3 = d.timeP3.split("-");
    var tp4 = d.timeP4.split("-");
    var tp5 = d.timeP5.split("-");
    var tp6 = d.timeP6.split("-");
    var tp7 = d.timeP7.split("-");
    var tp8 = d.timeP8.split("-");
    if (tp1.length < 2) {
      tp1.push("");
      tp1.push("");
    }
    if (tp2.length < 2) {
      tp2.push("");
      tp2.push("");
    }
    if (tp3.length < 2) {
      tp3.push("");
      tp3.push("");
    }
    if (tp4.length < 2) {
      tp4.push("");
      tp4.push("");
    }
    if (tp5.length < 2) {
      tp5.push("");
      tp5.push("");
    }
    if (tp6.length < 2) {
      tp6.push("");
      tp6.push("");
    }
    if (tp7.length < 2) {
      tp7.push("");
      tp7.push("");
    }
    if (tp8.length < 2) {
      tp8.push("");
      tp8.push("");
    }
    var tp = [];
    tp.push({ timeStart: tp1[0], timeEnd: tp1[1] });
    tp.push({ timeStart: tp2[0], timeEnd: tp2[1] });
    tp.push({ timeStart: tp3[0], timeEnd: tp3[1] });
    tp.push({ timeStart: tp4[0], timeEnd: tp4[1] });
    tp.push({ timeStart: tp5[0], timeEnd: tp5[1] });
    tp.push({ timeStart: tp6[0], timeEnd: tp6[1] });
    tp.push({ timeStart: tp7[0], timeEnd: tp7[1] });
    tp.push({ timeStart: tp8[0], timeEnd: tp8[1] });
    console.log("TP:", tp);
    var letters = this.getCharacterArray(d.letters);
    var periods = [];
    for (var l = 0; l < letters.length; l++) {
      var time = this.computeTime(
        l,
        d.letters,
        d.type,
        d.timeType,
        tp[l].timeStart,
        tp[l].timeEnd
      );
      periods.push({
        letter: letters[l],
        timeStart: time[0],
        timeEnd: time[1],
        num: l,
      });
    }
    var num = d.number;
    if (num == undefined || num == "u") {
      num = "";
      d.number = "";
    }
    data = {
      date: d.date,
      day: this.dt.getDayOfWeekLetter(this.dt.getDayOfWeek(d.date)),
      type: d.type,
      number: num,
      letters: letters,
      timeType: d.timeType,
      iLunch: d.iLunch,
      timeP1: d.timeP1,
      timeP2: d.timeP2,
      timeP3: d.timeP3,
      timeP4: d.timeP4,
      timeP5: d.timeP5,
      timeP6: d.timeP6,
      timeP7: d.timeP7,
      timeP8: d.timeP8,
      timeP1S: tp1[0],
      timeP1E: tp1[1],
      timeP2S: tp2[0],
      timeP2E: tp2[1],
      timeP3S: tp3[0],
      timeP3E: tp3[1],
      timeP4S: tp4[0],
      timeP4E: tp4[1],
      timeP5S: tp5[0],
      timeP5E: tp5[1],
      timeP6S: tp6[0],
      timeP6E: tp6[1],
      timeP7S: tp7[0],
      timeP7E: tp7[1],
      timeP8S: tp8[0],
      timeP8E: tp8[1],
      periods: periods,
      changed: false,
      autoTime: d.timeType == "R",
      anchor: d.anchor == "true", //(d.type == "R"),
      anchorDate: "",
      numberDate: "",
      countNumber: d.countNumber == "true",
      anchorLetter: d.letters.substring(0, 1),
      autoEdit: d.autoEdit == "true", //(d.type == "R" && d.timeType == "R")
    };
    this.dataSchedule.push(data);
  }

  updatePeriods(d) {
    var updateAnchorLetter = false;
    if (d.letters.length > 0) {
      if (d.letters[0] == d.anchorLetter) {
        updateAnchorLetter = true;
      }
    }
    var tp1 = d.timeP1.split("-");
    var tp2 = d.timeP2.split("-");
    var tp3 = d.timeP3.split("-");
    var tp4 = d.timeP4.split("-");
    var tp5 = d.timeP5.split("-");
    var tp6 = d.timeP6.split("-");
    var tp7 = d.timeP7.split("-");
    var tp8 = d.timeP8.split("-");
    if (tp1.length < 2) {
      tp1.push("");
      tp1.push("");
    }
    if (tp2.length < 2) {
      tp2.push("");
      tp2.push("");
    }
    if (tp3.length < 2) {
      tp3.push("");
      tp3.push("");
    }
    if (tp4.length < 2) {
      tp4.push("");
      tp4.push("");
    }
    if (tp5.length < 2) {
      tp5.push("");
      tp5.push("");
    }
    if (tp6.length < 2) {
      tp6.push("");
      tp6.push("");
    }
    if (tp7.length < 2) {
      tp7.push("");
      tp7.push("");
    }
    if (tp8.length < 2) {
      tp8.push("");
      tp8.push("");
    }
    var tp = [];
    tp.push({ timeStart: tp1[0], timeEnd: tp1[1] });
    tp.push({ timeStart: tp2[0], timeEnd: tp2[1] });
    tp.push({ timeStart: tp3[0], timeEnd: tp3[1] });
    tp.push({ timeStart: tp4[0], timeEnd: tp4[1] });
    tp.push({ timeStart: tp5[0], timeEnd: tp5[1] });
    tp.push({ timeStart: tp6[0], timeEnd: tp6[1] });
    tp.push({ timeStart: tp7[0], timeEnd: tp7[1] });
    tp.push({ timeStart: tp8[0], timeEnd: tp8[1] });
    var periods = [];
    for (var l = 0; l < d.letters.length; l++) {
      var time = this.computeTime(
        l,
        this.getStringFromArray(d.letters),
        d.type,
        d.timeType,
        tp[l].timeStart,
        tp[l].timeEnd
      );
      periods.push({
        letter: d.letters[l],
        timeStart: time[0],
        timeEnd: time[1],
        num: l,
      });
    }
    d.periods = periods;
    if (periods.length > 0) {
      if (updateAnchorLetter) {
        d.anchorLetter = periods[0].letter;
      }
    }
  }

  addScheduleDay(date, type, timeType, letters) {
    if (!(this.getScheduleDay(date) != undefined)) {
      this.dataSchedule.push({
        date: date,
        day: this.dt.getDayOfWeekLetter(this.dt.getDayOfWeek(date)),
        type: type,
        number: "",
        letters: letters,
        timeType: timeType,
        iLunch: "",
        timeP1: "",
        timeP2: "",
        timeP3: "",
        timeP4: "",
        timeP5: "",
        timeP6: "",
        timeP7: "",
        timeP8: "",
        timeP1S: "",
        timeP1E: "",
        timeP2S: "",
        timeP2E: "",
        timeP3S: "",
        timeP3E: "",
        timeP4S: "",
        timeP4E: "",
        timeP5S: "",
        timeP5E: "",
        timeP6S: "",
        timeP6E: "",
        timeP7S: "",
        timeP7E: "",
        timeP8S: "",
        timeP8E: "",
        periods: [],
        changed: true,
        anchor: type == "R" || type == "L",
        anchorDate: "",
        numberDate: "",
        countNumber: type == "R" || type == "L" || type == "E" || type == "X",
        autoTime: timeType == "R",
        ortho: type == "R" && timeType == "R",
        autoEdit: (type == "R" || type == "L") && timeType == "R",
      });
      this.updatePeriods(this.dataSchedule[this.dataSchedule.length - 1]);
      this.dataSchedule = this.sortSchedule(this.dataSchedule);
      this.updateParentKeys();
      this.autoUpdate("");
    }
  }

  updateProperties(day, fatalChange: boolean) {
    console.log("Updating properties", [day, fatalChange]);
    day.anchor = day.type == "R" || day.type == "L";
    if (day.type == "X") {
      day.timeType = "I";
    } else {
      day.timeType = "R";
    }
    day.autoTime = day.timeType == "R";
    day.autoEdit = (day.type == "R" || day.type == "L") && day.timeType == "R";
    day.countNumber =
      day.type == "R" || day.type == "L" || day.type == "E" || day.type == "X";
    if (day.type == "N") {
      day.countNumber = false;
      day.number = undefined;
    }
    if (fatalChange) {
      day.letters = [];
      day.periods = [];
      this.updateParentKeys();
      this.autoUpdate("");
    }
    console.log("This day:", day);
  }

  containsAP(letters) {
    for (var i = 0; i < letters.length; i++) {
      if (letters[i] == "Z") {
        return true;
      }
    }
    return false;
  }

  removeAP(letters) {
    var l = [];
    for (var i = 0; i < letters.length; i++) {
      if (letters[i] != "Z") {
        l.push(letters[i]);
      }
    }
    return l;
  }

  shiftSchedule(letters, forward: boolean, thisType, type) {
    if (thisType == "R") {
      if (type == "R") {
        var l = letters.slice();
        if (this.containsAP(letters)) {
          for (var i = 0; i < letters.length; i++) {
            if (i == 0) {
              if (letters[i] != "Z") {
                if (l[l.length - 1] != "Z") {
                  l[l.length - 1] = letters[i];
                } else {
                  l[l.length - 2] = letters[i];
                }
              }
            } else {
              if (letters[i] != "Z") {
                if (letters[i - 1] != "Z") {
                  l[i - 1] = letters[i];
                } else {
                  if (i == 1) {
                    l[l.length - 1] = letters[i];
                  } else {
                    l[i - 2] = letters[i];
                  }
                }
              }
            }
          }
        } else {
          for (var i = 0; i < letters.length; i++) {
            if (i == 0) {
              l[l.length - 1] = letters[i];
            } else {
              l[i - 1] = letters[i];
            }
          }
        }
        return l;
      } else {
        if (letters.length >= 5) {
          var longBlock = letters[2];
          var lNaut = this.getScheduleFromLongBlock(longBlock);
          return this.shiftSchedule(lNaut, forward, thisType, "R");
        } else {
          return [];
        }
      }
    } else if (thisType == "L") {
      console.log("Updating type L");
      var nLetters = letters.slice();
      for (var i = 0; i < nLetters.length; i++) {
        if (nLetters[i] == "Z") {
          nLetters.splice(i, 1);
        }
      }
      if (nLetters.length == this.dataSettings.timeRegularR.length) {
        var nSched = this.shiftSchedule(nLetters, forward, "R", "R");
        console.log("Base schedule type L", nSched);
        var longBlock = nSched[4];
        console.log("Long block type L", longBlock);
        return this.createLSScheduleFromLongBlock(longBlock);
      } else {
        return [];
      }
    }
    return [];
  }

  getScheduleFromLongBlock(letter) {
    var s = [];
    switch (letter) {
      case "E":
        s = ["A", "B", "C", "D", "E", "F", "G"];
        break;
      case "F":
        s = ["B", "C", "D", "E", "F", "G", "A"];
        break;
      case "G":
        s = ["C", "D", "E", "F", "G", "A", "B"];
        break;
      case "A":
        s = ["D", "E", "F", "G", "A", "B", "C"];
        break;
      case "B":
        s = ["E", "F", "G", "A", "B", "C", "D"];
        break;
      case "C":
        s = ["F", "G", "A", "B", "C", "D", "E"];
        break;
      case "D":
        s = ["G", "A", "B", "C", "D", "E", "F"];
        break;
    }
    return s;
  }

  createLSScheduleFromLongBlock(letter) {
    var l = this.getScheduleFromLongBlock(letter);
    var n = l.slice();
    n.splice(0, 2);
    console.log("Created schedule from long block type L", [l, n]);
    return n;
  }

  shiftNumber(n, forward: boolean) {
    if (parseInt(n) == 8) {
      return "1";
    } else {
      return "" + (parseInt(n) + 1);
    }
  }

  addScheduleDayAuto(date) {
    if (!(this.getScheduleDay(date) != undefined)) {
      this.addScheduleDay(date, "R", "R", []);
    }
  }

  getScheduleWeek(week) {
    var dWeek = [];
    for (var i = 0; i < week.length; i++) {
      var d = this.getScheduleDay(week[i]);
      if (d != undefined) {
        dWeek.push(d);
      } else {
        dWeek.push({
          date: week[i],
          day: this.dt.getDayOfWeekLetter(i + 1),
          type: "",
          number: "",
          letters: [],
          timeType: "",
          iLunch: "",
          timeP1: "",
          timeP2: "",
          timeP3: "",
          timeP4: "",
          timeP5: "",
          timeP6: "",
          timeP7: "",
          timeP8: "",
          timeP1S: "",
          timeP1E: "",
          timeP2S: "",
          timeP2E: "",
          timeP3S: "",
          timeP3E: "",
          timeP4S: "",
          timeP4E: "",
          timeP5S: "",
          timeP5E: "",
          timeP6S: "",
          timeP6E: "",
          timeP7S: "",
          timeP7E: "",
          timeP8S: "",
          timeP8E: "",
          periods: [],
          changed: false,
          anchor: false,
          anchorDate: "",
          anchorLetter: "",
          autoTime: false,
          autoEdit: false,
          numberDate: "",
          countNumber: false,
        });
      }
    }
    return dWeek;
  }

  getIndexOfDay(day) {
    for (var i = 0; i < this.dataSchedule.length; i++) {
      if (day.date == this.dataSchedule[i].date) {
        return i;
      }
    }
    return -1;
  }

  updateParentKeys() {
    console.log("Updating parent keys", this.dataSchedule);
    var lastAnchor = "";
    var lastNumber = "";
    for (var i = 0; i < this.dataSchedule.length; i++) {
      if (lastAnchor != undefined && lastAnchor != "") {
        this.dataSchedule[i].anchorDate = lastAnchor;
        if (this.dataSchedule[i].anchor) {
          lastAnchor = this.dataSchedule[i].date;
        } else {
        }
      } else {
        if (this.dataSchedule[i].anchor) {
          lastAnchor = this.dataSchedule[i].date;
        }
      }
      if (lastNumber != undefined && lastNumber != "") {
        this.dataSchedule[i].numberDate = lastNumber;
        if (this.dataSchedule[i].countNumber) {
          lastNumber = this.dataSchedule[i].date;
        } else {
        }
      } else {
        if (this.dataSchedule[i].countNumber) {
          lastNumber = this.dataSchedule[i].date;
        }
      }
    }
    console.log("Updated parent keys", this.dataSchedule);
    /*for(var i = this.getIndexOfDay(day); i >= 0; i++) {
      if(this.dataSchedule[i].anchor) {

      }
    }*/
  }

  autoUpdate(type) {
    console.log("Auto updating type", type);
    for (var i = 0; i < this.dataSchedule.length; i++) {
      if (this.dataSchedule[i].autoEdit && this.dataSchedule[i].type != "N") {
        if (this.dataSchedule[i].anchorDate != "") {
          console.log(
            "Updating [" + this.dataSchedule[i].date + "]",
            this.dataSchedule[i].anchorDate
          );
          var anchor = this.getScheduleDay(this.dataSchedule[i].anchorDate);
          this.dataSchedule[i].letters = this.shiftSchedule(
            this.removeAP(anchor.letters),
            true,
            this.dataSchedule[i].type,
            anchor.type
          );
        } else if (type == "timing") {
          this.updatePeriods(this.dataSchedule[i]);
          this.dataSchedule[i].changed = true;
        }
        if (this.dataSchedule[i].numberDate != "") {
          var num = this.getScheduleDay(this.dataSchedule[i].numberDate);
          this.dataSchedule[i].number = this.shiftNumber(num.number, true);
        }
        if (
          this.dataSchedule[i].anchorDate != "" ||
          this.dataSchedule[i].numberDate != ""
        ) {
          this.updatePeriods(this.dataSchedule[i]);
          this.dataSchedule[i].changed = true;
        }
      } else {
        if (this.dataSchedule[i].type != "N") {
          if (this.dataSchedule[i].numberDate != "") {
            var num = this.getScheduleDay(this.dataSchedule[i].numberDate);
            this.dataSchedule[i].number = this.shiftNumber(num.number, true);
          }
          if (type == "timing") {
            this.updatePeriods(this.dataSchedule[i]);
            this.dataSchedule[i].changed = true;
          }
        }
      }
    }
    console.log("Post auto update", this.dataSchedule);
  }

  getFullSchedule(firstLetter) {
    var s = "";
    switch (firstLetter) {
      case "A":
        break;
      case "B":
        break;
      case "C":
        break;
      case "D":
        break;
      case "E":
        break;
      case "F":
        break;
      case "G":
        break;
    }
    return s;
  }

  computeTime(period, letters, type, timeType, timeStart, timeEnd) {
    //console.log("Compute time", [period, letters, type, timeType, timeStart, timeEnd]);
    var time = ["hh:mm", "hh:mm"];
    if (timeType == "I") {
      time[0] = timeStart;
      time[1] = timeEnd;
    } else if (timeType == "R") {
      if (type == "R") {
        if (letters.includes("Z")) {
          time[0] = this.dataSettings.timeRegularWithAPR[
            period
          ].timeStart.toString();
          time[1] = this.dataSettings.timeRegularWithAPR[
            period
          ].timeEnd.toString();
        } else {
          time[0] = this.dataSettings.timeRegularR[period].timeStart.toString();
          time[1] = this.dataSettings.timeRegularR[period].timeEnd.toString();
        }
      } else if (type == "L") {
        time[0] = this.dataSettings.timeLateStartR[period].timeStart.toString();
        time[1] = this.dataSettings.timeLateStartR[period].timeEnd.toString();
      } else if (type == "E") {
        if (letters.includes("Z")) {
          time[0] = this.dataSettings.timeEarlyReleaseWithAPR[
            period
          ].timeStart.toString();
          time[1] = this.dataSettings.timeEarlyReleaseWithAPR[
            period
          ].timeEnd.toString();
        } else {
          if (letters.length == 7) {
            time[0] = this.dataSettings.timeEarlyReleaseAllWithoutAPR[
              period
            ].timeStart.toString();
            time[1] = this.dataSettings.timeEarlyReleaseAllWithoutAPR[
              period
            ].timeEnd.toString();
          } else {
            time[0] = this.dataSettings.timeEarlyReleaseWithoutAPR[
              period
            ].timeStart.toString();
            time[1] = this.dataSettings.timeEarlyReleaseWithoutAPR[
              period
            ].timeEnd.toString();
          }
        }
      }
    }
    return time;
  }

  getCharacterArray(s) {
    var c = [];
    for (var i = 0; i < s.length; i++) {
      c.push(s.substring(i, i + 1));
    }
    return c;
  }

  getStringFromArray(c) {
    var s = "";
    for (var i = 0; i < c.length; i++) {
      s += c[i];
    }
    return s;
  }

  getScheduleDay(day) {
    for (var i = 0; i < this.dataSchedule.length; i++) {
      if (this.dataSchedule[i].date == day) {
        return this.dataSchedule[i];
      }
    }
    return undefined;
  }

  getSuspended(uid: string) {
    return new Promise((resolve) => {
      var target: string =
        "https://jefftc.com/oneday/us/getSuspended.php?uid=" + uid;
      this.http
        .get(target)
        .map((res) => res.json())
        .subscribe((data) => {
          if (data != undefined) {
            console.log("Suspension response", data);
            if (data.status) {
              this.suspended = true;
            }
            resolve();
          }
        });
    });
  }

  authenticate(username: string, password: string) {
    return new Promise((resolve) => {
      var target: string =
        "https://jefftc.com/oneday/us/login.php?username=" +
        username +
        "&password=" +
        password;
      this.http
        .get(target)
        .map((res) => res.json())
        .subscribe(
          (data) => {
            if (data != undefined) {
              console.log("Authenticate response", data);
              if (data.status) {
                this.suspended = data.suspended == 1;
                this.getSuspended("dev").then((res) => {
                  if (this.suspended) {
                    resolve([{ data: data }]);
                  } else {
                    this.verified = data.verified == 1;
                    if (this.verified) {
                      this.username = username;
                      this.password = password;

                      if (this.autoLoggedIn) {
                        this.updateNew = false;
                      } else {
                        this.updateNew = true;
                      }
                      console.log("US Updated New", this.updateNew);

                      var cA = this.decompressSchedule(data.compactA);
                      var cB = this.decompressSchedule(data.compactB);
                      var cC = this.decompressSchedule(data.compactC);
                      var cD = this.decompressSchedule(data.compactD);
                      var cE = this.decompressSchedule(data.compactE);
                      var cF = this.decompressSchedule(data.compactF);
                      var cG = this.decompressSchedule(data.compactG);
                      var n = this.convertScheduleLtoN(
                        cA,
                        cB,
                        cC,
                        cD,
                        cE,
                        cF,
                        cG
                      );
                      this.classDataDay1 = n[0];
                      this.classDataDay2 = n[1];
                      this.classDataDay3 = n[2];
                      this.classDataDay4 = n[3];
                      this.classDataDay5 = n[4];
                      this.classDataDay6 = n[5];
                      this.classDataDay7 = n[6];
                      this.classDataDay8 = n[7];

                      this.privacy = data.privacy;
                      console.log("Verified", this.verified);
                      this.getSuperUser().then((res) => {
                        console.log("Super user", this.superUser);
                        this.pullPeople().then((res) => {
                          resolve([{ data: data }]);
                        });
                      });
                    } else {
                      resolve([{ data: data }]);
                    }
                  }
                });
              } else {
                resolve([{ data: data }]);
              }
            }
          },
          (error) => {
            console.log("Loading without connection");
            this.bypass = true;
            resolve([
              { data: { status: false, response: "connection_error" } },
            ]);
          }
        );
    });
  }

  getSuperUser() {
    return new Promise((resolve) => {
      var target: string =
        "https://jefftc.com/oneday/us/getSuperUser.php?username=" +
        this.username;
      this.http
        .get(target)
        .map((res) => res.json())
        .subscribe((data) => {
          if (data != undefined) {
            console.log("Super user response", data);
            if (data.status) {
              this.superUser = true;
            } else {
              this.superUser = false;
            }
            resolve();
          }
        });
    });
  }

  setValuesForClassDataRaw(rows, n) {
    //console.log("Set values class raw [" + letterNum + "]", [name, category]);
    var letter: string = rows[n].letter.substring(0, 1);
    var number: string = rows[n].letter.substring(1, 2);
    var name: string = rows[n].name;
    var category: string = rows[n].category;
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
    console.log("Class Raw numbers", [cdNumber, number, name, category]);
    switch (number) {
      case "1":
        this.classDataDay1[cdNumber].className = name;
        this.classDataDay1[cdNumber].classCategory = category;
        break;
      case "2":
        this.classDataDay2[cdNumber].className = name;
        this.classDataDay2[cdNumber].classCategory = category;
        break;
      case "3":
        this.classDataDay3[cdNumber].className = name;
        this.classDataDay3[cdNumber].classCategory = category;
        break;
      case "4":
        this.classDataDay4[cdNumber].className = name;
        this.classDataDay4[cdNumber].classCategory = category;
        break;
      case "5":
        this.classDataDay5[cdNumber].className = name;
        this.classDataDay5[cdNumber].classCategory = category;
        break;
      case "6":
        this.classDataDay6[cdNumber].className = name;
        this.classDataDay6[cdNumber].classCategory = category;
        break;
      case "7":
        this.classDataDay7[cdNumber].className = name;
        this.classDataDay7[cdNumber].classCategory = category;
        break;
      case "8":
        this.classDataDay8[cdNumber].className = name;
        this.classDataDay8[cdNumber].classCategory = category;
        break;
    }

    if (n < rows.length - 1) {
      this.setValuesForClassDataRaw(rows, n + 1);
    }

    //console.log("ClassDataDay", [this.us.classDataDay1, this.us.classDataDay2, this.us.classDataDay3, this.us.classDataDay4, this.us.classDataDay5, this.us.classDataDay6, this.us.classDataDay7, this.us.classDataDay8]);
  }

  logout() {
    return new Promise((resolve) => {
      this.autoLoggedIn = false;
      this.username = "";
      this.password = "";
      this.authorized = false;
      this.verified = false;
      this.compactA = "";
      this.compactB = "";
      this.compactC = "";
      this.compactD = "";
      this.compactE = "";
      this.compactF = "";
      this.compactG = "";
      this.firstName = "";
      this.lastName = "";
      this.gradYear = "";
      this.friends = "";
      this.friendArray = [];
      this.requests = "";
      this.requestArray = [];
      this.requestArrayR = [];
      this.requestArrayS = [];
      this.people = "";
      this.peopleArray = [];
      this.requestNumber = 0;
      this.nonfriendArray = [];
      this.privacy = 2;
      resolve();
    });
  }

  changePassword(newPassword) {
    return new Promise((resolve) => {
      var target: string =
        "https://jefftc.com/oneday/us/changePassword.php?username=" +
        this.username +
        "&password=" +
        this.password +
        "&newpassword=" +
        newPassword;
      this.http
        .get(target)
        .map((res) => res.json())
        .subscribe((data) => {
          if (data != undefined) {
            console.log("Change Password response", data);
            if (data.status) {
              this.password = data.password;
              resolve([true]);
            } else {
              resolve([false]);
            }
          } else {
            resolve([false]);
          }
        });
    });
  }

  changeFirstName(newFirstName) {
    return new Promise((resolve) => {
      var target: string =
        "https://jefftc.com/oneday/us/changeFirstName.php?username=" +
        this.username +
        "&password=" +
        this.password +
        "&newfirstname=" +
        newFirstName;
      this.http
        .get(target)
        .map((res) => res.json())
        .subscribe((data) => {
          if (data != undefined) {
            console.log("Change Password response", data);
            if (data.status) {
              this.firstName = data.firstName;
              resolve([true]);
            } else {
              resolve([false]);
            }
          } else {
            resolve([false]);
          }
        });
    });
  }

  changeLastName(newLastName) {
    return new Promise((resolve) => {
      var target: string =
        "https://jefftc.com/oneday/us/changeLastName.php?username=" +
        this.username +
        "&password=" +
        this.password +
        "&newlastname=" +
        newLastName;
      this.http
        .get(target)
        .map((res) => res.json())
        .subscribe((data) => {
          if (data != undefined) {
            console.log("Change Password response", data);
            if (data.status) {
              this.lastName = data.lastName;
              resolve([true]);
            } else {
              resolve([false]);
            }
          } else {
            resolve([false]);
          }
        });
    });
  }

  changeGradYear(newGradYear) {
    return new Promise((resolve) => {
      var target: string =
        "https://jefftc.com/oneday/us/changeGradYear.php?username=" +
        this.username +
        "&password=" +
        this.password +
        "&newgradyear=" +
        newGradYear;
      this.http
        .get(target)
        .map((res) => res.json())
        .subscribe((data) => {
          if (data != undefined) {
            console.log("Change Password response", data);
            if (data.status) {
              this.gradYear = data.gradYear;
              resolve([true]);
            } else {
              resolve([false]);
            }
          } else {
            resolve([false]);
          }
        });
    });
  }

  changePrivacy(privacy) {
    return new Promise((resolve) => {
      var target: string =
        "https://jefftc.com/oneday/us/changePrivacy.php?username=" +
        this.username +
        "&password=" +
        this.password +
        "&privacy=" +
        privacy;
      this.http
        .get(target)
        .map((res) => res.json())
        .subscribe((data) => {
          if (data != undefined) {
            console.log("Change Privacy response", data);
            if (data.status) {
              this.privacy = data.privacy;
              resolve();
            } else {
              resolve();
            }
          }
        });
    });
  }

  convertScheduleLtoN(cA, cB, cC, cD, cE, cF, cG) {
    var n = [];
    console.log("Converted L to N (L):", [cA, cB, cC, cD, cE, cF, cG]);
    for (var i = 0; i < cA.length; i++) {
      n.push([
        {
          className: cA[i].className,
          classCategory: cA[i].classCategory,
        },
        {
          className: cB[i].className,
          classCategory: cB[i].classCategory,
        },
        {
          className: cC[i].className,
          classCategory: cC[i].classCategory,
        },
        {
          className: cD[i].className,
          classCategory: cD[i].classCategory,
        },
        {
          className: cE[i].className,
          classCategory: cE[i].classCategory,
        },
        {
          className: cF[i].className,
          classCategory: cF[i].classCategory,
        },
        {
          className: cG[i].className,
          classCategory: cG[i].classCategory,
        },
      ]);
    }
    console.log("Converted L to N (N):", n);
    return n;
  }

  convertScheduleNtoL(c1, c2, c3, c4, c5, c6, c7, c8) {
    var l = [];
    for (var i = 0; i < c1.length; i++) {
      l.push([
        {
          className: c1[i].className,
          classCategory: c1[i].classCategory,
        },
        {
          className: c2[i].className,
          classCategory: c2[i].classCategory,
        },
        {
          className: c3[i].className,
          classCategory: c3[i].classCategory,
        },
        {
          className: c4[i].className,
          classCategory: c4[i].classCategory,
        },
        {
          className: c5[i].className,
          classCategory: c5[i].classCategory,
        },
        {
          className: c6[i].className,
          classCategory: c6[i].classCategory,
        },
        {
          className: c7[i].className,
          classCategory: c7[i].classCategory,
        },
        {
          className: c8[i].className,
          classCategory: c8[i].classCategory,
        },
      ]);
    }
    console.log("Converted N to L", l);
    return l;
  }

  compressSchedule(input): string {
    var c: string = "";
    for (var i = 0; i < input.length; i++) {
      c +=
        "~~" +
        (i + 1 + "~" + input[i].className + "~" + input[i].classCategory);
    }
    c += "~~";
    console.log("Compression input", input);
    console.log("Compression output", c);
    return c;
  }

  decompressSchedule(input: string) {
    var c = [];
    var numSplits = input.split("~~");
    for (var i = 1; i < numSplits.length - 1; i++) {
      var iSplits = numSplits[i].split("~");
      c.push({
        className: iSplits[1],
        classCategory: iSplits[2],
      });
    }
    console.log("Decompression input", input);
    console.log("Decompression output", c);
    return c;
  }

  decompressFriendArray(input) {
    var c = input;
    for (var i = 0; i < c.length; i++) {
      var dA = this.decompressSchedule(c[i].cA);
      var dB = this.decompressSchedule(c[i].cB);
      var dC = this.decompressSchedule(c[i].cC);
      var dD = this.decompressSchedule(c[i].cD);
      var dE = this.decompressSchedule(c[i].cE);
      var dF = this.decompressSchedule(c[i].cF);
      var dG = this.decompressSchedule(c[i].cG);
      c[i].dA = dA;
      c[i].dB = dB;
      c[i].dC = dC;
      c[i].dD = dD;
      c[i].dE = dE;
      c[i].dF = dF;
      c[i].dG = dG;
    }
    console.log("Decompression input", input);
    console.log("Decompression output", c);
    return c;
  }

  decompressPeople(input: string, data) {
    var c = [];
    var numSplits = input.split("~~");
    for (var i = 1; i < numSplits.length - 1; i++) {
      var iSplits = numSplits[i].split("~");
      var friendCount = 0;
      if (parseInt(iSplits[5]) > 0) {
        friendCount = parseInt(iSplits[5]);
      }
      c.push({
        username: iSplits[0],
        firstName: iSplits[1],
        lastName: iSplits[2],
        gradYear: iSplits[3],
        verified: parseInt(iSplits[4]) == 1,
        friendCount: friendCount,
        privacy: parseInt(iSplits[6]),
        cA: "",
        cB: "",
        cC: "",
        cD: "",
        cE: "",
        cF: "",
        cG: "",
        id: -1,
        lastActive: "",
        uid: "",
        super: false,
        statusType: "",
        inactivity: 0,
        expired: false,
      });
    }
    console.log("Compression input", input);
    console.log("Compression output", c);
    return c;
  }

  compressFriends(input): string {
    var c: string = "";
    for (var i = 0; i < input.length; i++) {
      c += "~~" + input[i].username;
    }
    c += "~~";
    console.log("Compression input", input);
    console.log("Compression output", c);
    return c;
  }

  decompressFriends(peopleArray, input: string, data) {
    var c = [];
    var numSplits = input.split("~~");
    for (var i = 1; i < numSplits.length - 1; i++) {
      var iSplits = numSplits[i].split("~");
      for (var j = 0; j < peopleArray.length; j++) {
        if (peopleArray[j].username == iSplits[0]) {
          var cA = data[iSplits[0] + "~A"];
          var cB = data[iSplits[0] + "~B"];
          var cC = data[iSplits[0] + "~C"];
          var cD = data[iSplits[0] + "~D"];
          var cE = data[iSplits[0] + "~E"];
          var cF = data[iSplits[0] + "~F"];
          var cG = data[iSplits[0] + "~G"];
          c.push({
            username: iSplits[0],
            firstName: peopleArray[j].firstName,
            lastName: peopleArray[j].lastName,
            gradYear: peopleArray[j].gradYear,
            verified: peopleArray[j].verified,
            privacy: peopleArray[j].privacy,
            cA: cA,
            cB: cB,
            cC: cC,
            cD: cD,
            cE: cE,
            cF: cF,
            cG: cG,
            dA: [],
            dB: [],
            dC: [],
            dD: [],
            dE: [],
            dF: [],
            dG: [],
          });
        }
      }
    }
    console.log("Decompression input", input);
    console.log("Decompression output", c);
    return c;
  }

  compressRequests(input): string {
    var c: string = "";
    for (var i = 0; i < input.length; i++) {
      c += "~~" + (input[i].username + "~" + input[i].direction);
    }
    c += "~~";
    console.log("Compression input", input);
    console.log("Compression output", c);
    return c;
  }

  decompressRequests(peopleArray, input: string) {
    var c = [];
    var numSplits = input.split("~~");
    for (var i = 1; i < numSplits.length - 1; i++) {
      var iSplits = numSplits[i].split("~");
      for (var j = 0; j < peopleArray.length; j++) {
        if (peopleArray[j].username == iSplits[0]) {
          c.push({
            username: iSplits[0],
            direction: iSplits[1],
            firstName: peopleArray[j].firstName,
            lastName: peopleArray[j].lastName,
            gradYear: peopleArray[j].gradYear,
            verified: peopleArray[j].verified,
            id: -1,
          });
        }
      }
    }
    console.log("Decompression input", input);
    console.log("Decompression output", c);
    return c;
  }

  getDetails() {
    return new Promise((resolve) => {
      var target: string = "https://jefftc.com/oneday/us/getDetails.php";
      this.http
        .get(target)
        .map((res) => res.json())
        .subscribe((data) => {
          if (data != undefined) {
            var status = data.status;
            if (status) {
              for (var i = 0; i < this.peopleArray.length; i++) {
                var username = this.peopleArray[i].username;
                this.peopleArray[i].lastActive = data[username + "~lastActive"];
                if (this.peopleArray[i].lastActive.indexOf("0000-00-00") >= 0) {
                  this.peopleArray[i].inactivity = 365;
                  this.peopleArray[i].expired = true;
                } else {
                  //console.log(this.peopleArray[i].lastActive);
                  var firstDate = this.dt.getDateFromDateMod(
                    this.peopleArray[i].lastActive
                  );
                  var oneDay = 24 * 60 * 60 * 1000;
                  var secondDate = new Date();
                  var diffDays = Math.round(
                    Math.abs(
                      (firstDate.getTime() - secondDate.getTime()) / oneDay
                    )
                  );
                  this.peopleArray[i].inactivity = diffDays;
                  if (diffDays > 180) {
                    this.peopleArray[i].expired = true;
                  } else {
                    this.peopleArray[i].expired = false;
                  }
                }

                this.peopleArray[i].suspended = data[username + "~suspended"];
                this.peopleArray[i].uid = data[username + "~uid"];
                this.peopleArray[i].super =
                  parseInt(data[username + "~super"]) == 1;
                if (this.peopleArray[i].uid.indexOf("-") > 0) {
                  this.peopleArray[i].statusType += "~~ios~~";
                } else {
                  if (this.peopleArray[i].uid == "###") {
                    this.peopleArray[i].statusType += "~~NA~~";
                  } else {
                    this.peopleArray[i].statusType += "~~android~~";
                  }
                }
              }
              resolve();
            } else {
            }
          }
        });
    });
  }

  terminate(user) {
    return new Promise((resolve) => {
      var target: string =
        "https://jefftc.com/oneday/us/terminate.php" +
        "?username=" +
        this.username +
        "&password=" +
        this.password +
        "&target=" +
        user.username;
      console.log("Attempting terminate", target);
      this.http
        .get(target)
        .map((res) => res.json())
        .subscribe((data) => {
          if (data != undefined) {
            var status = data.status;
            if (status) {
              resolve();
            }
          }
        });
    });
  }

  block(user) {
    return new Promise((resolve) => {
      var target: string =
        "https://jefftc.com/oneday/us/blacklist.php" +
        "?username=" +
        this.username +
        "&password=" +
        this.password +
        "&target=" +
        user.username;
      console.log("Attempting block", target);
      this.http
        .get(target)
        .map((res) => res.json())
        .subscribe((data) => {
          if (data != undefined) {
            var status = data.status;
            if (status) {
              resolve();
            }
          }
        });
    });
  }

  unblock(user) {
    return new Promise((resolve) => {
      var target: string =
        "https://jefftc.com/oneday/us/whitelist.php" +
        "?username=" +
        this.username +
        "&password=" +
        this.password +
        "&target=" +
        user.username;
      console.log("Attempting unblock", target);
      this.http
        .get(target)
        .map((res) => res.json())
        .subscribe((data) => {
          if (data != undefined) {
            var status = data.status;
            if (status) {
              resolve();
            }
          }
        });
    });
  }

  promote(user) {
    return new Promise((resolve) => {
      var target: string =
        "https://jefftc.com/oneday/us/promoteUser.php" +
        "?username=" +
        this.username +
        "&password=" +
        this.password +
        "&target=" +
        user.username;
      console.log("Attempting promote", target);
      this.http
        .get(target)
        .map((res) => res.json())
        .subscribe((data) => {
          if (data != undefined) {
            var status = data.status;
            if (status) {
              resolve();
            }
          }
        });
    });
  }

  demote(user) {
    return new Promise((resolve) => {
      var target: string =
        "https://jefftc.com/oneday/us/demoteUser.php" +
        "?username=" +
        this.username +
        "&password=" +
        this.password +
        "&target=" +
        user.username;
      console.log("Attempting demote", target);
      this.http
        .get(target)
        .map((res) => res.json())
        .subscribe((data) => {
          if (data != undefined) {
            var status = data.status;
            if (status) {
              resolve();
            }
          }
        });
    });
  }

  pushPersonalSchedule() {
    return new Promise((resolve) => {
      var l = this.convertScheduleNtoL(
        this.classDataDay1,
        this.classDataDay2,
        this.classDataDay3,
        this.classDataDay4,
        this.classDataDay5,
        this.classDataDay6,
        this.classDataDay7,
        this.classDataDay8
      );
      var compactA: string = this.compressSchedule(l[0]);
      var compactB: string = this.compressSchedule(l[1]);
      var compactC: string = this.compressSchedule(l[2]);
      var compactD: string = this.compressSchedule(l[3]);
      var compactE: string = this.compressSchedule(l[4]);
      var compactF: string = this.compressSchedule(l[5]);
      var compactG: string = this.compressSchedule(l[6]);
      console.log("Push personal schedule", l);
      var target: string =
        "https://jefftc.com/oneday/us/pushSchedule.php?username=" +
        this.username +
        "&password=" +
        this.password +
        "&compactA=" +
        compactA +
        "&compactB=" +
        compactB +
        "&compactC=" +
        compactC +
        "&compactD=" +
        compactD +
        "&compactE=" +
        compactE +
        "&compactF=" +
        compactF +
        "&compactG=" +
        compactG;
      this.http
        .get(target)
        .map((res) => res.json())
        .subscribe((data) => {
          if (data != undefined) {
            var status = data.status;
            if (status) {
              var compactA = data.compactA;
              var compactB = data.compactB;
              var compactC = data.compactC;
              var compactD = data.compactD;
              var compactE = data.compactE;
              var compactF = data.compactF;
              var compactG = data.compactG;
              var cA = this.decompressSchedule(compactA);
              var cB = this.decompressSchedule(compactB);
              var cC = this.decompressSchedule(compactC);
              var cD = this.decompressSchedule(compactD);
              var cE = this.decompressSchedule(compactE);
              var cF = this.decompressSchedule(compactF);
              var cG = this.decompressSchedule(compactG);
              var n = this.convertScheduleLtoN(cA, cB, cC, cD, cE, cF, cG);
              this.classDataDay1 = n[0];
              this.classDataDay2 = n[1];
              this.classDataDay3 = n[2];
              this.classDataDay4 = n[3];
              this.classDataDay5 = n[4];
              this.classDataDay6 = n[5];
              this.classDataDay7 = n[6];
              this.classDataDay8 = n[7];
              resolve([{ status: true, response: "" }]);
            } else {
              var response = data.response;
              resolve([{ status: false, response: response }]);
            }
          }
        });
    });
  }

  sortFriendArrayDAlpha() {
    this.friendArrayDSorted = this.friendArrayD.slice();
    this.friendArrayDSorted.sort(function (a, b) {
      var aL = a.lastName.toLowerCase();
      var bL = b.lastName.toLowerCase();
      var aF = a.firstName.toLowerCase();
      var bF = a.firstName.toLowerCase();
      if (!(aL != bL)) {
        return aF < bF ? -1 : aF > bF ? 1 : 0;
      } else {
        return aL < bL ? -1 : aL > bL ? 1 : 0;
      }
    });
  }

  pullPeople() {
    return new Promise((resolve) => {
      var target: string =
        "https://jefftc.com/oneday/us/getPeople.php?username=" +
        this.username +
        "&password=" +
        this.password;
      this.http
        .get(target)
        .map((res) => res.json())
        .subscribe((data) => {
          var status = data.status;
          if (status) {
            console.log("GetPeople Data", data);
            this.people = data.people;
            this.peopleArray = this.decompressPeople(this.people, data);
            this.getDetails();
            this.friends = data.friends;
            this.friendArray = this.decompressFriends(
              this.peopleArray,
              this.friends,
              data
            );
            this.friendArrayD = this.decompressFriendArray(this.friendArray);
            this.sortFriendArrayDAlpha();
            this.requests = data.requests;
            this.requestArray = this.decompressRequests(
              this.peopleArray,
              this.requests
            );
            this.requestArrayR = [];
            this.requestArrayS = [];
            for (var i = 0; i < this.requestArray.length; i++) {
              if (this.requestArray[i].direction == "S") {
                this.requestArrayS.push(this.requestArray[i]);
              } else if (this.requestArray[i].direction == "R") {
                this.requestArrayR.push(this.requestArray[i]);
              }
            }
            console.log("Requests sent", this.requestArrayS);
            console.log("Requests received", this.requestArrayR);
            this.requestNumber = this.requestArrayR.length;
            this.nonfriendArray = [];

            for (var i = 0; i < this.peopleArray.length; i++) {
              var exists = false;
              var isRequest = false;
              var dir = "";
              for (var j = 0; j < this.requestArray.length; j++) {
                if (this.requestArray[j].direction == "S") {
                  if (
                    this.requestArray[j].username.toLowerCase() ==
                    this.peopleArray[i].username.toLowerCase()
                  ) {
                    exists = true;
                  }
                } else {
                  if (
                    this.requestArray[j].username.toLowerCase() ==
                    this.peopleArray[i].username.toLowerCase()
                  ) {
                    isRequest = true;
                    dir = "R";
                  }
                }
              }
              for (var j = 0; j < this.friendArray.length; j++) {
                if (
                  this.friendArray[j].username.toLowerCase() ==
                  this.peopleArray[i].username.toLowerCase()
                ) {
                  exists = true;
                }
              }
              if (
                this.peopleArray[i].username.toLowerCase() ==
                this.username.toLowerCase()
              ) {
                exists = true;
              }
              if (!exists) {
                this.nonfriendArray.push({
                  username: this.peopleArray[i].username,
                  firstName: this.peopleArray[i].firstName,
                  lastName: this.peopleArray[i].lastName,
                  gradYear: this.peopleArray[i].gradYear,
                  verified: this.peopleArray[i].verified,
                  privacy: this.peopleArray[i].privacy,
                  friendCount: this.peopleArray[i].friendCount,
                  direction: dir,
                  id: -1,
                });
              }
            }
            console.log("People", this.peopleArray);
            console.log("Friends", this.friendArray);
            console.log("Requests", this.requestArray);
            this.peopleArray.sort(function (a, b) {
              var aL = a.lastName.toLowerCase();
              var bL = b.lastName.toLowerCase();
              var aF = a.firstName.toLowerCase();
              var bF = a.firstName.toLowerCase();
              if (!(aL != bL)) {
                return aF < bF ? -1 : aF > bF ? 1 : 0;
              } else {
                return aL < bL ? -1 : aL > bL ? 1 : 0;
              }
            });
            resolve();
          }
        });
    });
  }

  getFriendSchedule(friend) {
    return new Promise((resolve) => {
      var target: string =
        "https://jefftc.com/oneday/us/getFriendSchedule.php?username=" +
        this.username +
        "&password=" +
        this.password +
        "&friend=" +
        friend;
      this.http
        .get(target)
        .map((res) => res.json())
        .subscribe((data) => {
          if (data.status) {
            var compactA = data.compactA;
            var compactB = data.compactB;
            var compactC = data.compactC;
            var compactD = data.compactD;
            var compactE = data.compactE;
            var compactF = data.compactF;
            var compactG = data.compactG;
            var cA = this.decompressSchedule(compactA);
            var cB = this.decompressSchedule(compactB);
            var cC = this.decompressSchedule(compactC);
            var cD = this.decompressSchedule(compactD);
            var cE = this.decompressSchedule(compactE);
            var cF = this.decompressSchedule(compactF);
            var cG = this.decompressSchedule(compactG);
            resolve([cA, cB, cC, cD, cE, cF, cG]);
          } else {
          }
        });
    });
  }

  checkForBadWords(input: string): boolean {
    var found: boolean = false;
    var swearwords = [
      "ahole",
      "anus",
      "ash0le",
      "ash0les",
      "asholes",
      "ass",
      "Ass Monkey",
      "Assface",
      "assh0le",
      "assh0lez",
      "asshole",
      "assholes",
      "assholz",
      "asswipe",
      "azzhole",
      "bassterds",
      "bastard",
      "bastards",
      "bastardz",
      "basterds",
      "basterdz",
      "Biatch",
      "bitch",
      "bitches",
      "Blow Job",
      "boffing",
      "butthole",
      "buttwipe",
      "c0ck",
      "c0cks",
      "c0k",
      "Carpet Muncher",
      "cawk",
      "cawks",
      "Clit",
      "cnts",
      "cntz",
      "cock",
      "cockhead",
      "cock-head",
      "cocks",
      "CockSucker",
      "cock-sucker",
      "crap",
      "cum",
      "cunt",
      "cunts",
      "cuntz",
      "dick",
      "dild0",
      "dild0s",
      "dildo",
      "dildos",
      "dilld0",
      "dilld0s",
      "dominatricks",
      "dominatrics",
      "dominatrix",
      "dyke",
      "enema",
      "fuck",
      "fucker",
      "f u c k",
      "f u c k e r",
      "fag",
      "fag1t",
      "faget",
      "fagg1t",
      "faggit",
      "faggot",
      "fagit",
      "fags",
      "fagz",
      "faig",
      "faigs",
      "fart",
      "flipping the bird",
      "fuck",
      "fucker",
      "fuckin",
      "fucking",
      "fucks",
      "Fudge Packer",
      "fuk",
      "Fukah",
      "Fuken",
      "fuker",
      "Fukin",
      "Fukk",
      "Fukkah",
      "Fukken",
      "Fukker",
      "Fukkin",
      "g00k",
      "gay",
      "gayboy",
      "gaygirl",
      "gays",
      "gayz",
      "God-damned",
      "h00r",
      "h0ar",
      "h0re",
      "hells",
      "hoar",
      "hoor",
      "hoore",
      "jackoff",
      "jap",
      "japs",
      "jerk-off",
      "jisim",
      "jiss",
      "jizm",
      "jizz",
      "knob",
      "knobs",
      "knobz",
      "kunt",
      "kunts",
      "kuntz",
      "Lesbian",
      "Lezzian",
      "Lipshits",
      "Lipshitz",
      "masochist",
      "masokist",
      "massterbait",
      "masstrbait",
      "masstrbate",
      "masterbaiter",
      "masterbate",
      "masterbates",
      "MothaFucker",
      "MothaFuker",
      "MothaFukkah",
      "MothaFukker",
      "MotherFucker",
      "MotherFukah",
      "MotherFuker",
      "MotherFukkah",
      "MotherFukker",
      "mother-fucker",
      "Mutha Fucker",
      "Mutha Fukah",
      "Mutha Fuker",
      "Mutha Fukkah",
      "Mutha Fukker",
      "n1gr",
      "nastt",
      "nigger",
      "nigur",
      "niiger",
      "niigr",
      "orafis",
      "orgasim",
      "orgasm",
      "orgasum",
      "oriface",
      "orifice",
      "orifiss",
      "packi",
      "packie",
      "packy",
      "paki",
      "pakie",
      "paky",
      "pecker",
      "peeenus",
      "peeenusss",
      "peenus",
      "peinus",
      "pen1s",
      "penas",
      "penis",
      "penis-breath",
      "penus",
      "penuus",
      "Phuc",
      "Phuck",
      "Phuk",
      "Phuker",
      "Phukker",
      "polac",
      "polack",
      "polak",
      "Poonani",
      "pr1c",
      "pr1ck",
      "pr1k",
      "pusse",
      "pussee",
      "pussy",
      "puuke",
      "puuker",
      "queer",
      "queers",
      "queerz",
      "qweers",
      "qweerz",
      "qweir",
      "recktum",
      "rectum",
      "retard",
      "sadist",
      "scank",
      "schlong",
      "screwing",
      "semen",
      "sex",
      "sexy",
      "Sh!t",
      "sh1t",
      "sh1ter",
      "sh1ts",
      "sh1tter",
      "sh1tz",
      "shit",
      "shits",
      "shitter",
      "Shitty",
      "Shity",
      "shitz",
      "Shyt",
      "Shyte",
      "Shytty",
      "Shyty",
      "skanck",
      "skank",
      "skankee",
      "skankey",
      "skanks",
      "Skanky",
      "slut",
      "sluts",
      "Slutty",
      "slutz",
      "son-of-a-bitch",
      "tit",
      "turd",
      "va1jina",
      "vag1na",
      "vagiina",
      "vagina",
      "vaj1na",
      "vajina",
      "vullva",
      "vulva",
      "w0p",
      "wh00r",
      "wh0re",
      "whore",
      "xrated",
      "xxx",
      "b!+ch",
      "bitch",
      "blowjob",
      "clit",
      "arschloch",
      "fuck",
      "shit",
      "ass",
      "asshole",
      "b!tch",
      "b17ch",
      "b1tch",
      "bastard",
      "bi+ch",
      "boiolas",
      "buceta",
      "c0ck",
      "cawk",
      "chink",
      "cipa",
      "clits",
      "cock",
      "cum",
      "cunt",
      "dildo",
      "dirsa",
      "ejakulate",
      "fatass",
      "fcuk",
      "fuk",
      "fux0r",
      "hoer",
      "hore",
      "jism",
      "kawk",
      "l3itch",
      "3i+ch",
      "lesbian",
      "masturbate",
      "masterbat",
      "masterbat3",
      "motherfucker",
      "s.o.b.",
      "mofo",
      "nazi",
      "nigga",
      "nigger",
      "nutsack",
      "phuck",
      "pimpis",
      "pusse",
      "pussy",
      "scrotum",
      "sh!t",
      "shemale",
      "shi+",
      "sh!+",
      "slut",
      "smut",
      "teets",
      "tits",
      "boobs",
      "b00bs",
      "teez",
      "testical",
      "testicle",
      "titt",
      "w00se",
      "jackoff",
      "wank",
      "whoar",
      "whore",
      "damn",
      "dyke",
      "fuck",
      "shit",
      "@$$",
      "amcik",
      "andskota",
      "arse",
      "assrammer",
      "ayir",
      "bi7ch",
      "bitch",
      "bollock",
      "breasts",
      "butt-pirate",
      "cabron",
      "cazzo",
      "chraa",
      "chuj",
      "Cock",
      "cunt",
      "d4mn",
      "daygo",
      "dego",
      "dick",
      "dike",
      "dupa",
      "dziwka",
      "ejackulate",
      "Ekrem",
      "Ekto",
      "enculer",
      "faen",
      "fag",
      "fanculo",
      "fanny",
      "feces",
      "feg",
      "Felcher",
      "ficken",
      "fitt",
      "Flikker",
      "foreskin",
      "Fotze",
      "Fu",
      "fuk",
      "futkretzn",
      "gay",
      "gook",
      "guiena",
      "h0r",
      "h4x0r",
      "hell",
      "helvete",
      "hoer",
      "honkey",
      "Huevon",
      "hui",
      "injun",
      "jizz",
      "kanker",
      "kike",
      "klootzak",
      "kraut",
      "knulle",
      "kuk",
      "kuksuger",
      "Kurac",
      "kurwa",
      "kusi",
      "kyrpa",
      "lesbo",
      "mamhoon",
      "masturbat",
      "merd",
      "mibun",
      "monkleigh",
      "mouliewop",
      "muie",
      "mulkku",
      "muschi",
      "nazis",
      "nepesaurio",
      "nigger",
      "orospu",
      "paska",
      "perse",
      "picka",
      "pierdol",
      "pillu",
      "pimmel",
      "piss",
      "pizda",
      "poontsee",
      "poop",
      "porn",
      "p0rn",
      "pr0n",
      "preteen",
      "pula",
      "pule",
      "puta",
      "puto",
      "qahbeh",
      "queef",
      "rautenberg",
      "schaffer",
      "scheiss",
      "schlampe",
      "schmuck",
      "screw",
      "sh!t",
      "sharmuta",
      "sharmute",
      "shipal",
      "shiz",
      "skribz",
      "skurwysyn",
      "sphencter",
      "spic",
      "spierdalaj",
      "splooge",
      "suka",
      "b00b",
      "testicle",
      "titt",
      "twat",
      "vittu",
      "wank",
      "wetback",
      "wichser",
      "wop",
      "yed",
      "zabourah",
    ];

    for (var i = 0; i < swearwords.length; i++) {
      if (input.indexOf(swearwords[i]) >= 0) {
        found = true;
      }
    }

    return found;
  }

  createPromptAlert(aTitle, aName, aPlaceholder, aType) {
    return new Promise((resolve) => {
      let alert = this.ac.create({
        title: aTitle,
        inputs: [
          {
            name: aName,
            placeholder: aPlaceholder,
            type: aType,
          },
        ],
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            handler: (data) => {
              console.log("Cancel clicked");
              resolve([""]);
            },
          },
          {
            text: "OK",
            handler: (data) => {
              console.log("Returned result", data[aName]);
              resolve([data[aName]]);
            },
          },
        ],
      });
      alert.present();
    });
  }

  createRadioAlert(title, optionTitles) {
    return new Promise((resolve) => {
      var aInputs = [];
      for (var i = 0; i < optionTitles.length; i++) {
        aInputs.push({
          name: optionTitles[i],
          label: optionTitles[i],
          value: optionTitles[i],
          type: "radio",
        });
      }
      let alert = this.ac.create({
        title: title,
        inputs: aInputs,
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            handler: (data) => {
              console.log("Cancel clicked");
            },
          },
          {
            text: "OK",
            handler: (data) => {
              console.log("User clicked button", "Alert-" + data);
              resolve(data);
            },
          },
        ],
      });
      alert.present();
    });
  }

  createRadioAlertCustom(title, optionTitles, valueTitles) {
    return new Promise((resolve) => {
      var aInputs = [];
      for (var i = 0; i < optionTitles.length; i++) {
        aInputs.push({
          name: optionTitles[i],
          label: optionTitles[i],
          value: valueTitles[i],
          type: "radio",
        });
      }
      let alert = this.ac.create({
        title: title,
        inputs: aInputs,
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            handler: (data) => {
              console.log("Cancel clicked");
            },
          },
          {
            text: "OK",
            handler: (data) => {
              console.log("User clicked button", "Alert-" + data);
              resolve(data);
            },
          },
        ],
      });
      alert.present();
    });
  }

  sendToast(sText: string) {
    let toast = this.tc.create({
      message: sText,
      duration: 3500,
      showCloseButton: true,
      position: "bottom",
    });
    toast.present();
  }

  //creates a spinner object with the desired message
  createLoader(message) {
    this.loader = this.lc.create({
      content: message,
    });
    this.loader.present();
  }

  //destroys any active spinner object
  destroyLoader() {
    if (this.loader) {
      this.loader.dismiss();
    }
  }
}
