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

@IonicPage()
@Component({
  selector: "page-about-me",
  templateUrl: "about-me.html",
})
export class AboutMe {
  username: string = "";
  firstName: string = "";
  lastName: string = "";
  gradYear: string = "";
  friends: string = "";
  friendArray = [];
  requests: string = "";
  requestArray = [];
  loggedIn: boolean = false;
  LR: string = "login";
  verified: boolean = false;
  super: boolean = false;

  nPrivacy: number = 0;
  privacyLevel: string = "Average Joe";
  privacyDescription: string =
    "You can only be added by searching your exact username";

  nUsername: any = "";
  nPassword: any = "";

  nUsernameR: any = "";
  nPasswordR: any = "";
  nConfirmPasswordR: any = "";
  nFirstNameR: any = "";
  nLastNameR: any = "";
  nGradYearR: any;
  nAgree: any = false;

  errorCode: string = "";

  public loader: any;

  constructor(
    public us: UserService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public lc: LoadingController,
    public mc: ModalController,
    public asc: ActionSheetController,
    public ac: AlertController,
    public tc: ToastController
  ) {
    if (us.authorized) {
      this.loggedIn = true;
    } else {
      this.loggedIn = false;
    }
    var add = {
      className: "Tap to change",
      classCategory: "not chosen",
    };
    for (var i = 0; i < 7; i++) {
      this.us.classDataDay1.push(add);
      this.us.classDataDay2.push(add);
      this.us.classDataDay3.push(add);
      this.us.classDataDay4.push(add);
      this.us.classDataDay5.push(add);
      this.us.classDataDay6.push(add);
      this.us.classDataDay7.push(add);
      this.us.classDataDay8.push(add);
    }
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad AboutMePage");
  }

  ionViewWillEnter() {
    console.log("ionViewWillEnter AboutMePage");

    //DEV OVERRIDE
    //this.navCtrl.parent.select(1);
    //DEV OVERRIDE
  }

  onClickEdit() {
    let asc = this.asc.create({
      title: "Edit Profile",
      enableBackdropDismiss: true,
      buttons: [
        {
          text: "First Name",
          icon: "md-contact",
          cssClass: "ascBtnEdit",
          handler: () => {
            console.log("User clicked button", "AS-firstName");
            this.createPromptAlert(
              "First Name",
              "firstName",
              this.firstName,
              "text"
            ).then((res) => {
              console.log("Returned result", res);
              if (res != undefined) {
                var firstName: string = res[0];
                if (
                  firstName.length >= 1 &&
                  firstName.length <= 15 &&
                  !this.contains(
                    [firstName],
                    [
                      "~",
                      ":",
                      ";",
                      "+",
                      "=",
                      ".",
                      "!",
                      "@",
                      "#",
                      "$",
                      "%",
                      "^",
                      "&",
                      "*",
                      "(",
                      ")",
                      "[",
                      "]",
                      "{",
                      "}",
                      "|",
                      "<",
                      ">",
                      "?",
                      "/",
                      '"',
                      "'",
                      "\\",
                      "_",
                    ]
                  )
                ) {
                  if (!this.us.checkForBadWords(firstName)) {
                    this.loader = this.lc.create({
                      content: "Saving",
                    });
                    this.loader.present();
                    this.us.changeFirstName(firstName).then((res) => {
                      var r = res[0];
                      this.loader.dismiss();
                      if (r) {
                        this.sendToast(
                          "Success",
                          "Your first name has been changed!"
                        );
                        this.firstName = this.us.firstName;
                      } else {
                        this.sendToast(
                          "Sorry",
                          "Could not change your first name at this time"
                        );
                      }
                    });
                  } else {
                    this.sendToast(
                      "Sorry",
                      "You may not use prohibited language"
                    );
                  }
                } else {
                  this.sendToast(
                    "Sorry",
                    "Your first name cannot be blank, more than 15 characters, or contain invalid symbols"
                  );
                }
              }
            });
          },
        },
        {
          text: "Last Name",
          icon: "md-contact",
          cssClass: "ascBtnEdit",
          handler: () => {
            console.log("User clicked button", "AS-lastName");
            this.createPromptAlert(
              "Last Name",
              "lastName",
              this.lastName,
              "text"
            ).then((res) => {
              console.log("Returned result", res);
              if (res != undefined) {
                var lastName: string = res[0];
                if (
                  lastName.length >= 1 &&
                  lastName.length <= 20 &&
                  !this.contains(
                    [lastName],
                    [
                      "~",
                      ":",
                      ";",
                      "+",
                      "=",
                      ".",
                      "!",
                      "@",
                      "#",
                      "$",
                      "%",
                      "^",
                      "&",
                      "*",
                      "(",
                      ")",
                      "[",
                      "]",
                      "{",
                      "}",
                      "|",
                      "<",
                      ">",
                      "?",
                      "/",
                      '"',
                      "'",
                      "\\",
                      "_",
                    ]
                  )
                ) {
                  if (!this.us.checkForBadWords(lastName)) {
                    this.loader = this.lc.create({
                      content: "Saving",
                    });
                    this.loader.present();
                    this.us.changeLastName(lastName).then((res) => {
                      var r = res[0];
                      this.loader.dismiss();
                      if (r) {
                        this.sendToast(
                          "Success",
                          "Your last name has been changed!"
                        );
                        this.lastName = this.us.lastName;
                      } else {
                        this.sendToast(
                          "Sorry",
                          "Could not change your last name at this time"
                        );
                      }
                    });
                  } else {
                    this.sendToast(
                      "Sorry",
                      "You may not use prohibited language"
                    );
                  }
                } else {
                  this.sendToast(
                    "Sorry",
                    "Your last name cannot be blank, more than 20 characters, or contain invalid symbols"
                  );
                }
              }
            });
          },
        },
        {
          text: "Grad Year",
          icon: "md-school",
          cssClass: "ascBtnEdit",
          handler: () => {
            console.log("User clicked button", "AS-gradYear");
            this.createPromptAlert(
              "Grad Year",
              "gradYear",
              this.gradYear,
              "number"
            ).then((res) => {
              console.log("Returned result", res);
              if (res != undefined) {
                var gradYear: number = res[0];
                if (
                  gradYear >= 2017 &&
                  gradYear <= new Date().getFullYear() + 5
                ) {
                  this.loader = this.lc.create({
                    content: "Saving",
                  });
                  this.loader.present();
                  this.us.changeGradYear(gradYear).then((res) => {
                    this.loader.dismiss();
                    var r = res[0];
                    if (r) {
                      this.sendToast(
                        "Success",
                        "Your grad year has been changed!"
                      );
                      this.gradYear = this.us.gradYear;
                    } else {
                      this.sendToast(
                        "Sorry",
                        "Could not change your grad year at this time"
                      );
                    }
                  });
                } else {
                  this.sendToast("Sorry", "Your grad year is invalid");
                }
              }
            });
          },
        },
        {
          text: "Password",
          icon: "md-lock",
          cssClass: "ascBtnEdit",
          handler: () => {
            console.log("User clicked button", "AS-password");
            this.createPromptAlert(
              "Current Password",
              "password",
              "",
              "password"
            ).then((res) => {
              console.log("Returned result", res);
              if (res != undefined) {
                var cp: string = res[0];
                if (cp == this.us.password) {
                  console.log("Password matches");
                  this.createPromptAlert(
                    "Password",
                    "password",
                    "",
                    "password"
                  ).then((res) => {
                    console.log("Returned result", res);
                    if (res != undefined) {
                      var p: string = res[0];
                      if (
                        p.length >= 4 &&
                        p.length <= 20 &&
                        !this.contains(
                          [p],
                          [
                            "~",
                            ":",
                            ";",
                            "+",
                            "=",
                            ".",
                            "!",
                            "@",
                            "#",
                            "$",
                            "%",
                            "^",
                            "&",
                            "*",
                            "(",
                            ")",
                            "[",
                            "]",
                            "{",
                            "}",
                            "|",
                            "<",
                            ">",
                            "?",
                            "/",
                            '"',
                            "'",
                            "\\",
                            "_",
                          ]
                        )
                      ) {
                        this.loader = this.lc.create({
                          content: "Saving",
                        });
                        this.loader.present();
                        this.us.changePassword(p).then((res) => {
                          this.loader.dismiss();
                          var r = res[0];
                          if (r) {
                            this.sendToast(
                              "Success",
                              "Your password has been changed!"
                            );
                          } else {
                            this.sendToast(
                              "Sorry",
                              "Could not change your password at this time"
                            );
                          }
                        });
                      } else {
                        this.sendToast(
                          "Sorry",
                          "Your password must be between 4 and 20 characters, and cannot contain invalid symbols"
                        );
                      }
                    }
                  });
                } else {
                  console.log("Password does not match");
                  this.sendToast("Failure", "Password incorrect!");
                }
              }
            });
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
              resolve(undefined);
            },
          },
          {
            text: "OK",
            handler: (data) => {
              switch (aName) {
                case "firstName":
                  console.log("User clicked button", "Alert-" + data.firstName);
                  resolve([data.firstName]);
                  break;
                case "lastName":
                  console.log("User clicked button", "Alert-" + data.lastName);
                  resolve([data.lastName]);
                  break;
                case "password":
                  console.log("User clicked button", "Alert-" + data.password);
                  resolve([data.password]);
                  break;
                case "gradYear":
                  console.log("User clicked button", "Alert-" + data.gradYear);
                  resolve([data.gradYear]);
                  break;
              }
            },
          },
        ],
      });
      alert.present();
    });
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

  onPrivacyChange() {}

  onClickPrivacySave() {
    console.log("Clicked Privacy Save");
    this.loader = this.lc.create({
      content: "Saving",
    });
    this.loader.present();
    this.us.changePrivacy(this.nPrivacy).then((res) => {
      console.log("Privacy changed", [this.nPrivacy, this.us.privacy]);
      this.nPrivacy = this.us.privacy;
      this.loader.dismiss();
      this.sendToast("Success", "Privacy settings updated!");
    });
  }

  onClickLogout() {
    this.loader = this.lc.create({
      content: "Logging Out",
    });
    this.loader.present();
    this.us.logout().then((res) => {
      this.loader.dismiss();
      this.nUsername = "";
      this.nPassword = "";
      this.nGradYearR = "";
      this.nAgree = false;
      this.nPasswordR = "";
      this.nUsernameR = "";
      this.nConfirmPasswordR = "";
      this.nFirstNameR = "";
      this.nLastNameR = "";
      this.sendToast("Success", "You are now logged out");
      this.loggedIn = false;
      this.LR = "login";
      this.username = "";
      this.firstName = "";
      this.lastName = "";
      this.gradYear = "";
      this.username = "";
      this.friends = "";
      this.friendArray = [];
      this.requests = "";
      this.requestArray = [];
      this.verified = false;
      this.super = false;
      this.nPrivacy = 2;
    });
  }

  onSubmitLogin(username, password) {
    if (username.length >= 1) {
      if (password.length >= 1) {
        this.loader = this.lc.create({
          content: "Logging In",
        });
        this.loader.present();
        this.us.authorized = false;
        this.us.authenticate(username.toLowerCase(), password).then((res) => {
          this.loader.dismiss();
          this.errorCode = "";
          var data = res[0].data;
          if (data.status) {
            if (this.us.suspended) {
              this.us.authorized = false;
              this.sendAlert(
                "Access Denied",
                "This account and/or device has been permanently suspended for violating the terms of service"
              );
            } else {
              if (this.us.verified) {
                this.loggedIn = true;
                this.us.authorized = true;
                this.username = username.toLowerCase();
                this.gradYear = data.gradYear;
                this.firstName = data.firstName;
                this.lastName = data.lastName;
                this.friends = data.friends;
                this.requests = data.requests;
                this.us.username = username.toLowerCase();
                this.us.password = password;
                this.us.gradYear = data.gradYear;
                this.us.firstName = data.firstName;
                this.us.lastName = data.lastName;
                this.us.friends = data.friends;
                this.us.requests = data.requests;
                this.us.compactA = data.compactA;
                this.us.compactB = data.compactB;
                this.us.compactC = data.compactC;
                this.us.compactD = data.compactD;
                this.us.compactE = data.compactE;
                this.us.compactF = data.compactF;
                this.us.compactG = data.compactG;
                this.us.verified = data.verified == 1;
                this.verified = this.us.verified;
                this.super = this.us.superUser;
                this.nPrivacy = this.us.privacy;
                //this.us.stressTestInitiate(0, 1000);
                this.us.pullPeople().then((res) => {
                  this.friendArray = this.us.friendArray;
                  this.requestArray = this.us.requestArray;
                  console.log("Switching automatically to schedule view");
                  //this.navCtrl.parent.select(1);
                });
              } else {
                this.us.authorized = false;
                this.sendAlert(
                  "Not Authorized",
                  "You must be an admin to use this service"
                );
              }
            }
          } else {
            if (this.us.bypass) {
              this.errorCode = "Could not login, you are now offline";
              this.sendAlert(
                "Offline Mode",
                "Could not connect, you are now offline. You can view your schedule but must connect to change anything"
              );
              //this.navCtrl.parent.select(1);
            } else {
              this.errorCode = "The username or password is incorrect";
            }
          }
        });
      } else {
        this.errorCode = "Password field is blank";
      }
    } else {
      this.errorCode = "Username field is blank";
    }
  }

  contains(s, c): boolean {
    var con: boolean = false;
    for (var a = 0; a < s.length; a++) {
      var emoji: number = s[a].search(/[\uD800-\uDFFF]./);
      if (emoji >= 0) {
        con = true;
      }
      for (var i = 0; i < c.length; i++) {
        if (s[a] != undefined && c[i] != undefined) {
          if (s[a].indexOf(c[i]) >= 0) {
            con = true;
          }
        }
      }
    }
    return con;
  }
}
