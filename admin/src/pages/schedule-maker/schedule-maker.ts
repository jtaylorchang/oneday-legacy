import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  ModalController,
  ActionSheetController,
  AlertController,
  ToastController,
} from "ionic-angular";
import { UserService } from "../../providers/user-service";
import { DtService } from "../../providers/dt-service";

@IonicPage()
@Component({
  selector: "page-schedule-maker",
  templateUrl: "schedule-maker.html",
})
export class ScheduleMaker {
  authorized: boolean = false;
  showJSONUploader: boolean = false;

  public loader: any;

  jsonTextArea: any;

  editSeg: string = "schedule";

  loaded: boolean = false;

  needsUpdate: boolean = false;
  startDate: string = "YYYY-MM-DD";
  endDate: string = "YYYY-MM-DD";

  week = [];
  dataWeek = [];
  dateModCurrent = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public us: UserService,
    public dt: DtService,
    public lc: LoadingController,
    public asc: ActionSheetController,
    public tc: ToastController,
    public ac: AlertController
  ) {}

  markDirty(day) {
    day.changed = true;
    this.needsUpdate = true;
  }

  updateParentKeys() {
    this.us.updateParentKeys();
    this.refreshWeek();
  }

  onClickFirstWeek() {}

  onClickPrevWeek() {
    var dateMod = this.dt.getDeltaDate(this.dateModCurrent, -7);
    this.showWeek(dateMod);
  }

  onClickNextWeek() {
    var dateMod = this.dt.getDeltaDate(this.dateModCurrent, 7);
    this.showWeek(dateMod);
  }

  onClickLastWeek() {}

  showWeekCurrent() {
    var dateMod = this.dt.shiftOffWeekends();
    this.showWeek(dateMod);
  }

  showWeek(dateMod) {
    this.week = this.dt.getWorkWeek(dateMod);
    console.log("DateMod of week", this.week);
    this.startDate = this.week[0];
    this.endDate = this.week[this.week.length - 1];
    var dWeek = this.us.getScheduleWeek(this.week);
    console.log("Schedule week", dWeek);
    this.dataWeek = dWeek;
    this.dateModCurrent = dateMod;
  }

  onChangeAutoEdit(day) {
    if (day.autoEdit && (day.type == "R" || day.type == "L")) {
      this.markDirty(day);
      this.us.autoUpdate("");
      this.refreshWeek();
    } else {
      day.autoEdit = false;
      this.markDirty(day);
      this.us.autoUpdate("");
      this.refreshWeek();
    }
  }

  onChangeAutoTime(day) {
    if (day.autoTime) {
      day.timeType = "R";
    } else {
      day.timeType = "I";
    }
  }

  onChangeAnchorPoint() {
    this.us.updateParentKeys();
    this.us.autoUpdate("");
    this.refreshWeek();
  }

  onClickEditScheduleTime(day, period) {
    /*var placeholder = "hh:mm";
    if(period.startTime != "" && period.startTime != undefined && period.startTime != "hh:mm") {
      placeholder = period.startTime;
    }

    this.us.createPromptAlert("Start Time", "startTime", placeholder, "text").then(res => {

    });*/

    var c = {
      timeStart: "hh:mm",
      timeEnd: "hh:mm",
    };
    if (period.timeStart != "" && period.timeStart != undefined) {
      c.timeStart = period.timeStart;
    }
    if (period.timeEnd != "" && period.timeEnd != undefined) {
      c.timeEnd = period.timeEnd;
    }
    this.us
      .createPromptAlert(
        "Edit Time",
        "time",
        c.timeStart + "-" + c.timeEnd,
        "text"
      )
      .then((res) => {
        if (res != undefined && res != "") {
          var splits = ("" + res[0]).split("-");
          if (
            splits.length == 2 &&
            splits[0].length == 5 &&
            splits[0].indexOf(":") > 0 &&
            splits[1].length == 5 &&
            splits[1].indexOf(":") > 0
          ) {
            var start = splits[0];
            var end = splits[1];
            c.timeStart = start;
            c.timeEnd = end;
            period.timeStart = start;
            period.timeEnd = end;
            var pNum = -1;
            for (var i = 0; i < day.periods.length; i++) {
              if (day.periods[i].num == period.num) {
                console.log("Found matching periods", [day.periods[i], period]);
                day.periods[i].timeStart = start;
                day.periods[i].timeEnd = end;
                pNum = i + 1;
              }
            }
            if (pNum >= 1) {
              day["timeP" + pNum] = start + "-" + end;
              day["timeP" + pNum + "S"] = start;
              day["timeP" + pNum + "E"] = end;
            }
            console.log("New day", day);
            this.markDirty(day);
            this.us.updatePeriods(day);
            this.refreshWeek();
            console.log("Times updated", splits);
          } else {
            this.us.sendToast("Incorrect input format (HH:MM-HH:MM) required");
          }
        }
      });
  }

  onClickScheduleEditDayType(day) {
    this.us
      .createRadioAlertCustom(
        "Type",
        ["Regular", "Late Start", "Early Release", "Exam", "No School"],
        ["R", "L", "E", "X", "N"]
      )
      .then((res) => {
        if (res != undefined && res != "") {
          var type = res;
          var fatal: boolean = type != day.type;
          day.type = res;
          this.us.updateProperties(day, fatal);
          this.updateParentKeys();
          this.us.autoUpdate("");
          this.markDirty(day);
          this.refreshWeek();
          if (type != "R" || type != "L") {
            this.onClickScheduleEditDayLetters(day);
          }
        }
      });
  }

  onClickScheduleEditILunch(day) {
    var placeholder = "# >= 0";
    if (day.iLunch != "" && day.iLunch != undefined) {
      placeholder = day.iLunch;
    }
    this.us
      .createPromptAlert("Irregular Lunch", "lunch", placeholder, "number")
      .then((res) => {
        if (res != undefined && res >= 0) {
          var iLunch = res[0];
          if (iLunch >= 0) {
            day.iLunch = iLunch;
            this.markDirty(day);
            this.refreshWeek();
          }
        }
      });
  }

  onClickScheduleEditDayNumber(day) {
    this.us
      .createPromptAlert("Number", "num", day.number, "number")
      .then((res) => {
        if (res != undefined && res > 0) {
          console.log("Set number", res);
          var n = res[0];
          if (day.autoEdit) {
            this.us
              .createRadioAlert("This turns off AutoEdit", [
                "Proceed",
                "Cancel",
              ])
              .then((res) => {
                if (res == "Proceed") {
                  day.autoEdit = false;
                  day.number = n;
                  this.markDirty(day);
                  this.us.autoUpdate("");
                  this.refreshWeek();
                }
              });
          } else {
            day.number = n;
            this.markDirty(day);
            this.us.autoUpdate("");
            this.refreshWeek();
          }
        }
      });
  }

  onClickScheduleEditDayLetters(day) {
    if (day.type != "N") {
      var l = "";
      for (var i = 0; i < day.letters.length; i++) {
        l += day.letters[i];
      }
      this.us.createPromptAlert("Letters", "letters", l, "text").then((res) => {
        if (res != undefined) {
          var lArray = res[0];
          if (lArray != undefined && lArray != "") {
            if (day.autoEdit) {
              this.us
                .createRadioAlert("This turns off AutoEdit", [
                  "Proceed",
                  "Cancel",
                ])
                .then((res) => {
                  if (res == "Proceed") {
                    day.autoEdit = false;
                    day.letters = this.us.getCharacterArray(lArray);
                    this.us.updatePeriods(day);
                    this.markDirty(day);
                    this.us.autoUpdate("");
                    this.refreshWeek();
                  }
                });
            } else {
              day.letters = this.us.getCharacterArray(lArray);
              this.us.updatePeriods(day);
              this.markDirty(day);
              this.us.autoUpdate("");
              this.refreshWeek();
            }
          }
        }
      });
    }
  }

  onChangeOrtho(day) {
    if (!day.ortho) {
    }
  }

  onClickScheduleAdd(day) {
    /*
    this.us.createRadioAlert("Type of Day", ["Regular", "Late Start", "Early Release", "No School", "Exam"]).then(res => {
      if(res != undefined && res != "") {
        var type = res;
        switch(type) {
          case "Regular":
            type = "R";
            break;
          case "Late Start":
            type = "L";
            break;
          case "Early Release":
            type = "E";
            break;
          case "No School":
            type = "N";
            break;
          case "Exam":
            type = "X";
            break;
        }
        this.us.createRadioAlert("Type of Time", ["Reg/Auto", "Irregular"]).then(res => {
          if(res != undefined && res != "") {
            var timeType = res;
            console.log("Add Response", [type, timeType]);
            switch(timeType) {
              case "Reg/Auto":
                timeType = "R";
                break;
              case "Irregular":
                timeType = "I";
                break;
            }
            this.us.createPromptAlert("Letters", "letters", "ex: ABCDEFG", "text").then(res => {
              if(res != undefined) {
                var letters = this.us.getCharacterArray(res[0]);
                this.us.addScheduleDay(day.date, type, timeType, letters);
                this.dataWeek = this.us.getScheduleWeek(this.week);
              }
            })
          }
        })
      }
    });*/
    this.us.addScheduleDayAuto(day.date);
    this.refreshWeek();
    this.needsUpdate = true;
  }

  refreshWeek() {
    this.dataWeek = this.us.getScheduleWeek(this.week);
    console.log("Week refreshed", this.dataWeek);
  }

  onEditSegChanged() {}

  onClickTimeEdit(c) {
    this.us
      .createPromptAlert(
        "Edit Time",
        "time",
        c.timeStart + "-" + c.timeEnd,
        "text"
      )
      .then((res) => {
        if (res != undefined && res != "") {
          var splits = ("" + res[0]).split("-");
          if (
            splits.length == 2 &&
            splits[0].length == 5 &&
            splits[0].indexOf(":") > 0 &&
            splits[1].length == 5 &&
            splits[1].indexOf(":") > 0
          ) {
            var start = splits[0];
            var end = splits[1];
            c.timeStart = start;
            c.timeEnd = end;
            this.us.autoUpdate("timing");
            this.refreshWeek();
            console.log("Times updated", splits);
          } else {
            this.us.sendToast("Incorrect input format (HH:MM-HH:MM) required");
          }
        }
      });
  }

  onClickTimeDelete(type, c) {
    switch (type) {
      case "timeRegularR":
        var timing = this.us.dataSettings.timeRegularR;
        for (var i = 0; i < timing.length; i++) {
          if (
            timing[i].timeStart == c.timeStart &&
            timing[i].timeEnd == c.timeEnd
          ) {
            this.us.dataSettings.timeRegularR.splice(i, 1);
            this.needsUpdate = true;
          }
        }
        break;
      case "timeRegularWithAPR":
        var timing = this.us.dataSettings.timeRegularWithAPR;
        for (var i = 0; i < timing.length; i++) {
          if (
            timing[i].timeStart == c.timeStart &&
            timing[i].timeEnd == c.timeEnd
          ) {
            this.us.dataSettings.timeRegularWithAPR.splice(i, 1);
            this.needsUpdate = true;
          }
        }
        break;
      case "timeLateStartR":
        var timing = this.us.dataSettings.timeLateStartR;
        for (var i = 0; i < timing.length; i++) {
          if (
            timing[i].timeStart == c.timeStart &&
            timing[i].timeEnd == c.timeEnd
          ) {
            this.us.dataSettings.timeLateStartR.splice(i, 1);
            this.needsUpdate = true;
          }
        }
        break;
      case "timeEarlyReleaseWithAPR":
        var timing = this.us.dataSettings.timeEarlyReleaseWithAPR;
        for (var i = 0; i < timing.length; i++) {
          if (
            timing[i].timeStart == c.timeStart &&
            timing[i].timeEnd == c.timeEnd
          ) {
            this.us.dataSettings.timeEarlyReleaseWithAPR.splice(i, 1);
            this.needsUpdate = true;
          }
        }
        break;
      case "timeEarlyReleaseWithoutAPR":
        var timing = this.us.dataSettings.timeEarlyReleaseWithoutAPR;
        for (var i = 0; i < timing.length; i++) {
          if (
            timing[i].timeStart == c.timeStart &&
            timing[i].timeEnd == c.timeEnd
          ) {
            this.us.dataSettings.timeEarlyReleaseWithoutAPR.splice(i, 1);
            this.needsUpdate = true;
          }
        }
        break;
      case "timeEarlyReleaseAllWithoutAPR":
        var timing = this.us.dataSettings.timeEarlyReleaseAllWithoutAPR;
        for (var i = 0; i < timing.length; i++) {
          if (
            timing[i].timeStart == c.timeStart &&
            timing[i].timeEnd == c.timeEnd
          ) {
            this.us.dataSettings.timeEarlyReleaseAllWithoutAPR.splice(i, 1);
            this.needsUpdate = true;
          }
        }
        break;
    }
  }

  onClickTimeAdd(type) {
    switch (type) {
      case "timeRegularR":
        this.us.dataSettings.timeRegularR.push({
          timeStart: "HH:MM",
          timeEnd: "HH:MM",
        });
        this.needsUpdate = true;
        break;
      case "timeRegularWithAPR":
        this.us.dataSettings.timeRegularWithAPR.push({
          timeStart: "HH:MM",
          timeEnd: "HH:MM",
        });
        this.needsUpdate = true;
        break;
      case "timeLateStartR":
        this.us.dataSettings.timeLateStartR.push({
          timeStart: "HH:MM",
          timeEnd: "HH:MM",
        });
        this.needsUpdate = true;
        break;
      case "timeEarlyReleaseWithAPR":
        this.us.dataSettings.timeEarlyReleaseWithAPR.push({
          timeStart: "HH:MM",
          timeEnd: "HH:MM",
        });
        this.needsUpdate = true;
        break;
      case "timeEarlyReleaseWithoutAPR":
        this.us.dataSettings.timeEarlyReleaseWithoutAPR.push({
          timeStart: "HH:MM",
          timeEnd: "HH:MM",
        });
        this.needsUpdate = true;
        break;
      case "timeEarlyReleaseAllWithoutAPR":
        this.us.dataSettings.timeEarlyReleaseAllWithoutAPR.push({
          timeStart: "HH:MM",
          timeEnd: "HH:MM",
        });
        this.needsUpdate = true;
        break;
    }
  }

  onClickLunchDelete(lunch, name) {
    switch (lunch) {
      case "1":
        for (var i = 0; i < this.us.dataSettings.lunch1.length; i++) {
          if (this.us.dataSettings.lunch1[i] == name) {
            this.us.dataSettings.lunch1.splice(i, 1);
            this.needsUpdate = true;
          }
        }
        break;
      case "2":
        for (var i = 0; i < this.us.dataSettings.lunch2.length; i++) {
          if (this.us.dataSettings.lunch2[i] == name) {
            this.us.dataSettings.lunch2.splice(i, 1);
            this.needsUpdate = true;
          }
        }
        break;
      case "3":
        for (var i = 0; i < this.us.dataSettings.lunch3.length; i++) {
          if (this.us.dataSettings.lunch3[i] == name) {
            this.us.dataSettings.lunch3.splice(i, 1);
            this.needsUpdate = true;
          }
        }
        break;
      case "4":
        for (var i = 0; i < this.us.dataSettings.lunch4.length; i++) {
          if (this.us.dataSettings.lunch4[i] == name) {
            this.us.dataSettings.lunch4.splice(i, 1);
            this.needsUpdate = true;
          }
        }
        break;
      case "All":
        for (var i = 0; i < this.us.dataSettings.lunchAll.length; i++) {
          if (this.us.dataSettings.lunchAll[i] == name) {
            this.us.dataSettings.lunchAll.splice(i, 1);
            this.needsUpdate = true;
          }
        }
        break;
      case "Need a Category":
        break;
    }
  }

  onClickLunchAdd(lunch) {
    switch (lunch) {
      case "1":
        this.us
          .createPromptAlert("Class Name", "name", "Name", "text")
          .then((res) => {
            var found = false;
            for (var i = 0; i < this.us.dataSettings.lunch1.length; i++) {
              if (this.us.dataSettings.lunch1[i] == res[0]) {
                found = true;
              }
            }
            if (!found) {
              this.us.dataSettings.lunch1.push(res[0]);
              this.needsUpdate = true;
            }
          });
        break;
      case "2":
        this.us
          .createPromptAlert("Class Name", "name", "Name", "text")
          .then((res) => {
            var found = false;
            for (var i = 0; i < this.us.dataSettings.lunch2.length; i++) {
              if (this.us.dataSettings.lunch2[i] == res[0]) {
                found = true;
              }
            }
            if (!found) {
              this.us.dataSettings.lunch2.push(res[0]);
              this.needsUpdate = true;
            }
          });
        break;
      case "3":
        this.us
          .createPromptAlert("Class Name", "name", "Name", "text")
          .then((res) => {
            var found = false;
            for (var i = 0; i < this.us.dataSettings.lunch3.length; i++) {
              if (this.us.dataSettings.lunch3[i] == res[0]) {
                found = true;
              }
            }
            if (!found) {
              this.us.dataSettings.lunch3.push(res[0]);
              this.needsUpdate = true;
            }
          });
        break;
      case "4":
        this.us
          .createPromptAlert("Class Name", "name", "Name", "text")
          .then((res) => {
            var found = false;
            for (var i = 0; i < this.us.dataSettings.lunch4.length; i++) {
              if (this.us.dataSettings.lunch4[i] == res[0]) {
                found = true;
              }
            }
            if (!found) {
              this.us.dataSettings.lunch4.push(res[0]);
              this.needsUpdate = true;
            }
          });
        break;
      case "All":
        this.us
          .createPromptAlert("Class Name", "name", "Name", "text")
          .then((res) => {
            var found = false;
            for (var i = 0; i < this.us.dataSettings.lunchAll.length; i++) {
              if (this.us.dataSettings.lunchAll[i] == res[0]) {
                found = true;
              }
            }
            if (!found) {
              this.us.dataSettings.lunchAll.push(res[0]);
              this.needsUpdate = true;
            }
          });
        break;
      case "Need a Category":
        break;
    }
  }

  onClickEditVersion() {
    let alert = this.ac.create({
      title: "Edit Version",
      inputs: [
        {
          name: "Date",
          type: "date",
          value: this.us.dataSettings.version,
        },
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: (data) => {
            console.log("Cancel clicked");
          },
        },
        {
          text: "Save",
          handler: (data) => {
            //TODO validate the date
            this.us.dataSettings.version = data.Date;
            this.needsUpdate = true;
          },
        },
      ],
    });
    alert.present();
  }

  onClickEditReq() {
    this.us
      .createPromptAlert(
        "Edit Required",
        "req",
        this.us.dataSettings.req,
        "number"
      )
      .then((res) => {
        if (res > 0) {
          this.us.dataSettings.req = res[0];
          this.needsUpdate = true;
        }
      });
  }

  onClickEditMandatory() {
    this.us.createRadioAlert("Edit Mandatory", ["Y", "N"]).then((res) => {
      if (res == "Y") {
        this.us.dataSettings.mandatory = "Y";
        this.needsUpdate = true;
      } else if (res == "N") {
        this.us.dataSettings.mandatory = "N";
        this.needsUpdate = true;
      }
    });
  }

  onClickUpload() {
    console.log("Upload button clicked");
    this.showJSONUploader = !this.showJSONUploader;
  }

  onClickUploadJSON() {
    console.log("JSON to upload");
    this.us.createLoader("Uploading");
    var text: string = this.jsonTextArea;
    var json = JSON.parse(text);
    console.log(json);
    var schedule = json.schedule;
  }

  onClickDownload() {
    console.log("Download button clicked");
    this.us
      .createRadioAlert("This will erase unsaved changes", [
        "Proceed",
        "Cancel",
      ])
      .then((res) => {
        if (res != undefined && res == "Proceed") {
          this.us.createLoader("Updating");
          this.loaded = false;
          this.us.getSchedule().then((res) => {
            this.loaded = true;
            this.showWeekCurrent();
            this.us.destroyLoader();
          });
        }
      });
  }

  onClickSync() {
    if (this.us.dataSettings.version != this.us.lastSyncVersion) {
      console.log("Syncing as version", this.us.dataSettings.version);
      this.us.createLoader("Syncing");
      this.us.syncSettings().then((res) => {
        this.us.syncSchedule().then((res) => {
          this.us.getSchedule().then((res) => {
            this.needsUpdate = false;
            this.us.destroyLoader();
          });
        });
      });
    } else {
      let alert = this.ac.create({
        title: "Edit Version",
        inputs: [
          {
            name: "Date",
            type: "date",
            value: this.us.dataSettings.version,
          },
        ],
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            handler: (data) => {
              console.log("Cancel clicked");
            },
          },
          {
            text: "Save",
            handler: (data) => {
              //TODO validate the date
              this.us.dataSettings.version = data.Date;
              this.onClickSync();
            },
          },
        ],
      });
      alert.present();
    }
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ScheduleMaker");
  }

  ionViewWillEnter() {
    console.log("ionViewWillEnter ScheduleMaker");
    this.authorized = this.us.authorized;

    //DEV OVERRIDE
    //this.authorized = true;
    //DEV OVERRIDE

    if (this.authorized) {
      this.us.createLoader("Updating");
      this.loaded = false;
      this.us.getSchedule().then((res) => {
        this.loaded = true;
        this.showWeekCurrent();
        this.us.destroyLoader();
      });
    }
  }
}
