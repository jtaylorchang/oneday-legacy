import { Component } from "@angular/core";
import { NavController, NavParams, ViewController } from "ionic-angular";
import { AlertController } from "ionic-angular";

@Component({
  selector: "page-class-editor",
  templateUrl: "class-editor.html",
})
export class ClassEditorPage {
  inputAll: any;
  inputOdd: any;
  inputEven: any;
  inputOne: any;
  inputTwo: any;
  inputThree: any;
  inputFour: any;
  inputFive: any;
  inputSix: any;
  inputSeven: any;
  inputEight: any;

  modifier: any; //"same", "oe", "irregular"
  letterSelected: string;
  className1: string = "";
  classCategory1: string = "";
  className2: string = "";
  classCategory2: string = "";
  className3: string = "";
  classCategory3: string = "";
  className4: string = "";
  classCategory4: string = "";
  className5: string = "";
  classCategory5: string = "";
  className6: string = "";
  classCategory6: string = "";
  className7: string = "";
  classCategory7: string = "";
  className8: string = "";
  classCategory8: string = "";
  isMath: boolean;
  isScience: boolean;
  isSocialStudies: boolean;
  isEnglish: boolean;
  isLanguage: boolean;
  isArt: boolean;
  isTechnology: boolean;
  isMusic: boolean;
  isWellness: boolean;
  isFoods: boolean;
  isBusiness: boolean;
  isStudyHall: boolean;
  isNone: boolean;
  isCategory = [];
  classConfig = [];
  STYLE_COLOR_DARK = "#553A41";
  STYLE_COLOR_GREEN = "#76ab77";
  STYLE_COLOR_LIGHT = "#FFFFFF";
  STYLE_COLOR_UNDER = "#6a9a6b";
  ASTYLE_SEG_SAME = "";
  ASTYLE_SEG_OE = "";
  ASTYLE_SEG_IRREGULAR = "";

  constructor(
    public navCtrl: NavController,
    public params: NavParams,
    private vc: ViewController,
    public alertCtrl: AlertController
  ) {
    console.log("Receieved period params", this.params);
    this.classConfig = this.params.get("classConfig");
    this.letterSelected = this.params.get("letter");
    this.className1 = this.params.get("name1");
    this.classCategory1 = this.params.get("category1");
    this.className2 = this.params.get("name2");
    this.classCategory2 = this.params.get("category2");
    this.className3 = this.params.get("name3");
    this.classCategory3 = this.params.get("category3");
    this.className4 = this.params.get("name4");
    this.classCategory4 = this.params.get("category4");
    this.className5 = this.params.get("name5");
    this.classCategory5 = this.params.get("category5");
    this.className6 = this.params.get("name6");
    this.classCategory6 = this.params.get("category6");
    this.className7 = this.params.get("name7");
    this.classCategory7 = this.params.get("category7");
    this.className8 = this.params.get("name8");
    this.classCategory8 = this.params.get("category8");
    console.log(
      "LOG | Rec: letter:" + this.letterSelected + " data to MODAL window"
    );
    if (
      this.className1 == this.className2 &&
      this.className1 == this.className3 &&
      this.className1 == this.className4 &&
      this.className1 == this.className5 &&
      this.className1 == this.className5 &&
      this.className1 == this.className6 &&
      this.className1 == this.className7 &&
      this.className1 == this.className8
    ) {
      this.modifier = "same";
    } else if (
      this.className1 == this.className3 &&
      this.className1 == this.className5 &&
      this.className1 == this.className7 &&
      this.className2 == this.className4 &&
      this.className2 == this.className6 &&
      this.className2 == this.className8
    ) {
      this.modifier = "oe";
    } else {
      this.modifier = "irregular";
    }
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ClassEditorPage");
  }

  onBlur(inputName: string, inputValue) {
    console.log("Blur: " + inputName);
    switch (inputName) {
      case "all":
        if (inputValue == "") {
          this.className1 = "Tap to change";
          this.className2 = "Tap to change";
          this.className3 = "Tap to change";
          this.className4 = "Tap to change";
          this.className5 = "Tap to change";
          this.className6 = "Tap to change";
          this.className7 = "Tap to change";
          this.className8 = "Tap to change";
        }
        break;
      case "odd":
        if (inputValue == "") {
          this.className1 = "Tap to change";
          this.className3 = "Tap to change";
          this.className5 = "Tap to change";
          this.className7 = "Tap to change";
        }
        break;
      case "even":
        if (inputValue == "") {
          this.className2 = "Tap to change";
          this.className4 = "Tap to change";
          this.className6 = "Tap to change";
          this.className8 = "Tap to change";
        }
        break;
      case "1":
        if (inputValue == "") {
          this.className1 = "Tap to change";
        }
        break;
      case "2":
        if (inputValue == "") {
          this.className2 = "Tap to change";
        }
        break;
      case "3":
        if (inputValue == "") {
          this.className3 = "Tap to change";
        }
        break;
      case "4":
        if (inputValue == "") {
          this.className4 = "Tap to change";
        }
        break;
      case "5":
        if (inputValue == "") {
          this.className5 = "Tap to change";
        }
        break;
      case "6":
        if (inputValue == "") {
          this.className6 = "Tap to change";
        }
        break;
      case "7":
        if (inputValue == "") {
          this.className7 = "Tap to change";
        }
        break;
      case "8":
        if (inputValue == "") {
          this.className8 = "Tap to change";
        }
        break;
    }
  }

  onFocus(inputName: string, inputValue) {
    console.log("Focus: " + inputName);
    switch (inputName) {
      case "all":
        if (this.className1 == "Tap to change") {
          this.className1 = "";
          this.className2 = "";
          this.className3 = "";
          this.className4 = "";
          this.className5 = "";
          this.className6 = "";
          this.className7 = "";
          this.className8 = "";
        }
        break;
      case "odd":
        if (this.className1 == "Tap to change") {
          this.className1 = "";
          this.className3 = "";
          this.className5 = "";
          this.className7 = "";
        }
        break;
      case "even":
        if (this.className2 == "Tap to change") {
          this.className2 = "";
          this.className4 = "";
          this.className6 = "";
          this.className8 = "";
        }
        break;
      case "1":
        if (this.className1 == "Tap to change") {
          this.className1 = "";
        }
        break;
      case "2":
        if (this.className2 == "Tap to change") {
          this.className2 = "";
        }
        break;
      case "3":
        if (this.className3 == "Tap to change") {
          this.className3 = "";
        }
        break;
      case "4":
        if (this.className4 == "Tap to change") {
          this.className4 = "";
        }
        break;
      case "5":
        if (this.className5 == "Tap to change") {
          this.className5 = "";
        }
        break;
      case "6":
        if (this.className6 == "Tap to change") {
          this.className6 = "";
        }
        break;
      case "7":
        if (this.className7 == "Tap to change") {
          this.className7 = "";
        }
        break;
      case "8":
        if (this.className8 == "Tap to change") {
          this.className8 = "";
        }
        break;
    }
  }

  onSubmit(value1, value2, value3, value4, value5, value6, value7, value8) {
    //************************************EDITING HERE******************************
    console.log("LOG | submitted");
    this.className1 = this.processClassName(value1)
      .replace(/-/g, "")
      .replace(/~/g, "");
    this.classCategory1 = this.processClassCategory(
      this.classCategory1
    ).replace(/-/g, "");
    this.className2 = this.processClassName(value2)
      .replace(/-/g, "")
      .replace(/~/g, "");
    this.classCategory2 = this.processClassCategory(this.classCategory2)
      .replace(/-/g, "")
      .replace(/~/g, "");
    this.className3 = this.processClassName(value3)
      .replace(/-/g, "")
      .replace(/~/g, "");
    this.classCategory3 = this.processClassCategory(this.classCategory3)
      .replace(/-/g, "")
      .replace(/~/g, "");
    this.className4 = this.processClassName(value4)
      .replace(/-/g, "")
      .replace(/~/g, "");
    this.classCategory4 = this.processClassCategory(this.classCategory4)
      .replace(/-/g, "")
      .replace(/~/g, "");
    this.className5 = this.processClassName(value5)
      .replace(/-/g, "")
      .replace(/~/g, "");
    this.classCategory5 = this.processClassCategory(this.classCategory5)
      .replace(/-/g, "")
      .replace(/~/g, "");
    this.className6 = this.processClassName(value6)
      .replace(/-/g, "")
      .replace(/~/g, "");
    this.classCategory6 = this.processClassCategory(this.classCategory6)
      .replace(/-/g, "")
      .replace(/~/g, "");
    this.className7 = this.processClassName(value7)
      .replace(/-/g, "")
      .replace(/~/g, "");
    this.classCategory7 = this.processClassCategory(this.classCategory7)
      .replace(/-/g, "")
      .replace(/~/g, "");
    this.className8 = this.processClassName(value8)
      .replace(/-/g, "")
      .replace(/~/g, "");
    this.classCategory8 = this.processClassCategory(this.classCategory8)
      .replace(/-/g, "")
      .replace(/~/g, "");
    this.popBack(false);
  }

  onCancel() {
    this.popBack(true);
  }

  processClassName(value) {
    var ret: string = "-1";
    if (value == "" || value == undefined) {
      ret = "Tap to change";
    } else {
      ret = value;
    }
    console.log("LOG | Processed className return: " + ret);
    return ret;
  }

  processClassCategory(value) {
    var ret: string = "-1";
    if (value == "" || value == undefined) {
      ret = "not chosen";
    } else {
      ret = value;
    }
    console.log("LOG | Processed classCategory return: " + ret);
    return ret;
  }

  popBack(cancel: boolean) {
    let data;
    var pbMod: string = this.modifier;
    if (cancel) {
      pbMod = "xxx";
    }
    switch (this.modifier) {
      case "same":
        data = {
          className1: this.className1,
          classCategory1: this.classCategory1,
          className2: this.className1,
          classCategory2: this.classCategory1,
          className3: this.className1,
          classCategory3: this.classCategory1,
          className4: this.className1,
          classCategory4: this.classCategory1,
          className5: this.className1,
          classCategory5: this.classCategory1,
          className6: this.className1,
          classCategory6: this.classCategory1,
          className7: this.className1,
          classCategory7: this.classCategory1,
          className8: this.className1,
          classCategory8: this.classCategory1,
          modifier: pbMod,
        };
        break;
      case "oe":
        data = {
          className1: this.className1,
          classCategory1: this.classCategory1,
          className2: this.className2,
          classCategory2: this.classCategory2,
          className3: this.className1,
          classCategory3: this.classCategory1,
          className4: this.className2,
          classCategory4: this.classCategory2,
          className5: this.className1,
          classCategory5: this.classCategory1,
          className6: this.className2,
          classCategory6: this.classCategory2,
          className7: this.className1,
          classCategory7: this.classCategory1,
          className8: this.className2,
          classCategory8: this.classCategory2,
          modifier: pbMod,
        };
        break;
      case "irregular":
        data = {
          className1: this.className1,
          classCategory1: this.classCategory1,
          className2: this.className2,
          classCategory2: this.classCategory2,
          className3: this.className3,
          classCategory3: this.classCategory3,
          className4: this.className4,
          classCategory4: this.classCategory4,
          className5: this.className5,
          classCategory5: this.classCategory5,
          className6: this.className6,
          classCategory6: this.classCategory6,
          className7: this.className7,
          classCategory7: this.classCategory7,
          className8: this.className8,
          classCategory8: this.classCategory8,
          modifier: pbMod,
        };
        break;
    }

    console.log("Class Editor pop back period", data);

    this.vc.dismiss(data);
  }

  setModifier(type) {
    this.modifier = type;
    this.ASTYLE_SEG_SAME = this.STYLE_COLOR_LIGHT;
    this.ASTYLE_SEG_OE = this.STYLE_COLOR_LIGHT;
    this.ASTYLE_SEG_IRREGULAR = this.STYLE_COLOR_LIGHT;
    switch (type) {
      case "same":
        //this.ASTYLE_SEG_SAME = this.STYLE_COLOR_LIGHT;
        break;
      case "oe":
        break;
      case "irregular":
        break;
    }
  }

  focusInput(input) {
    input.setFocus();
  }

  showRadio(number, mod) {
    var classCategory;
    switch (mod) {
      case "same": //=======================================================================================================================
        classCategory = this.classCategory1;
        break;
      case "oe":
        if (number == "1") {
          classCategory = this.classCategory1;
        } else if (number == "2") {
          classCategory = this.classCategory2;
        }
        break;
      case "irregular":
        classCategory = this.getClassCategory(number);
        break;
    }
    let alert = this.alertCtrl.create();
    alert.setTitle("Class Category");
    this.isCategory = [];
    for (var i = 0; i < this.classConfig.length; i++) {
      if (classCategory == this.classConfig[i].name) {
        this.isCategory.push(true);
      } else {
        this.isCategory.push(false);
      }
      alert.addInput({
        type: "radio",
        label: this.classConfig[i].name,
        value: this.classConfig[i].name,
        checked: this.isCategory[i],
      });
      alert.setCssClass("alertClass");
    }

    alert.addButton("Cancel");
    alert.addButton({
      text: "OK",
      handler: (data) => {
        if (data != undefined) {
          console.log("LOG | category chosen: " + data);
          if (data == "") {
            switch (mod) {
              case "same":
                this.setClassName(1, "not chosen");
                this.setClassCategory(1, "N/A");
                this.setClassName(2, "not chosen");
                this.setClassCategory(2, "N/A");
                this.setClassName(3, "not chosen");
                this.setClassCategory(3, "N/A");
                this.setClassName(4, "not chosen");
                this.setClassCategory(4, "N/A");
                this.setClassName(5, "not chosen");
                this.setClassCategory(5, "N/A");
                this.setClassName(6, "not chosen");
                this.setClassCategory(6, "N/A");
                this.setClassName(7, "not chosen");
                this.setClassCategory(7, "N/A");
                this.setClassName(8, "not chosen");
                this.setClassCategory(8, "N/A");
                break;
              case "oe":
                if (number == "1") {
                  this.setClassName(1, "not chosen");
                  this.setClassCategory(1, "N/A");
                  this.setClassName(3, "not chosen");
                  this.setClassCategory(3, "N/A");
                  this.setClassName(5, "not chosen");
                  this.setClassCategory(5, "N/A");
                  this.setClassName(7, "not chosen");
                  this.setClassCategory(7, "N/A");
                } else if (number == "2") {
                  this.setClassName(2, "not chosen");
                  this.setClassCategory(2, "N/A");
                  this.setClassName(4, "not chosen");
                  this.setClassCategory(4, "N/A");
                  this.setClassName(6, "not chosen");
                  this.setClassCategory(6, "N/A");
                  this.setClassName(8, "not chosen");
                  this.setClassCategory(8, "N/A");
                }
                break;
              case "irregular":
                this.setClassName(number, "not chosen");
                this.setClassCategory(number, "N/A");
                break;
            }
          } else {
            switch (mod) {
              case "same":
                this.setClassCategory(1, data);
                this.setClassCategory(2, data);
                this.setClassCategory(3, data);
                this.setClassCategory(4, data);
                this.setClassCategory(5, data);
                this.setClassCategory(6, data);
                this.setClassCategory(7, data);
                this.setClassCategory(8, data);
                break;
              case "oe":
                if (number == "1") {
                  this.setClassCategory(1, data);
                  this.setClassCategory(3, data);
                  this.setClassCategory(5, data);
                  this.setClassCategory(7, data);
                } else if (number == "2") {
                  this.setClassCategory(2, data);
                  this.setClassCategory(4, data);
                  this.setClassCategory(6, data);
                  this.setClassCategory(8, data);
                }
                break;
              case "irregular":
                this.setClassCategory(number, data);
                break;
            }
          }
        } else {
          switch (mod) {
            case "same":
              this.setClassName(1, "not chosen");
              this.setClassCategory(1, "N/A");
              this.setClassName(2, "not chosen");
              this.setClassCategory(2, "N/A");
              this.setClassName(3, "not chosen");
              this.setClassCategory(3, "N/A");
              this.setClassName(4, "not chosen");
              this.setClassCategory(4, "N/A");
              this.setClassName(5, "not chosen");
              this.setClassCategory(5, "N/A");
              this.setClassName(6, "not chosen");
              this.setClassCategory(6, "N/A");
              this.setClassName(7, "not chosen");
              this.setClassCategory(7, "N/A");
              this.setClassName(8, "not chosen");
              this.setClassCategory(8, "N/A");
              break;
            case "oe":
              if (number == "1") {
                this.setClassName(1, "not chosen");
                this.setClassCategory(1, "N/A");
                this.setClassName(3, "not chosen");
                this.setClassCategory(3, "N/A");
                this.setClassName(5, "not chosen");
                this.setClassCategory(5, "N/A");
                this.setClassName(7, "not chosen");
                this.setClassCategory(7, "N/A");
              } else if (number == "2") {
                this.setClassName(2, "not chosen");
                this.setClassCategory(2, "N/A");
                this.setClassName(4, "not chosen");
                this.setClassCategory(4, "N/A");
                this.setClassName(6, "not chosen");
                this.setClassCategory(6, "N/A");
                this.setClassName(8, "not chosen");
                this.setClassCategory(8, "N/A");
              }
              break;
            case "irregular":
              this.setClassName(number, "not chosen");
              this.setClassCategory(number, "N/A");
              break;
          }
        }
      },
    });
    alert.present();
  }

  setClassName(number, value) {
    switch (number.toString()) {
      case "1":
        this.className1 = value;
        break;
      case "2":
        this.className2 = value;
        break;
      case "3":
        this.className3 = value;
        break;
      case "4":
        this.className4 = value;
        break;
      case "5":
        this.className5 = value;
        break;
      case "6":
        this.className6 = value;
        break;
      case "7":
        this.className7 = value;
        break;
      case "8":
        this.className8 = value;
        break;
    }
  }

  getClassName(number): string {
    var name: string = "-1";
    switch (number.toString()) {
      case "1":
        name = this.className1;
        break;
      case "2":
        name = this.className2;
        break;
      case "3":
        name = this.className3;
        break;
      case "4":
        name = this.className4;
        break;
      case "5":
        name = this.className5;
        break;
      case "6":
        name = this.className6;
        break;
      case "7":
        name = this.className7;
        break;
      case "8":
        name = this.className8;
        break;
    }
    return name;
  }

  setClassCategory(number, value) {
    switch (number.toString()) {
      case "1":
        this.classCategory1 = value;
        break;
      case "2":
        this.classCategory2 = value;
        break;
      case "3":
        this.classCategory3 = value;
        break;
      case "4":
        this.classCategory4 = value;
        break;
      case "5":
        this.classCategory5 = value;
        break;
      case "6":
        this.classCategory6 = value;
        break;
      case "7":
        this.classCategory7 = value;
        break;
      case "8":
        this.classCategory8 = value;
        break;
    }
  }

  getClassCategory(number): string {
    var category: string = "-1";
    switch (number.toString()) {
      case "1":
        category = this.classCategory1;
        break;
      case "2":
        category = this.classCategory2;
        break;
      case "3":
        category = this.classCategory3;
        break;
      case "4":
        category = this.classCategory4;
        break;
      case "5":
        category = this.classCategory5;
        break;
      case "6":
        category = this.classCategory6;
        break;
      case "7":
        category = this.classCategory7;
        break;
      case "8":
        category = this.classCategory8;
        break;
    }
    return category;
  }
}
