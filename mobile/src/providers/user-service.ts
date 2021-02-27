import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import "rxjs/add/operator/map";
import { Device } from "ionic-native";
import { Platform } from "ionic-angular";

@Injectable()
export class UserService {
  public uid: string = "";

  public suspended: boolean = false;

  public authorized: boolean = false;
  public bypass: boolean = false;
  public loadedLocal: boolean = false;
  public reqUpdate: boolean = false;
  public needsAuthorization: boolean = false;

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
  public privacy: number = 2;
  public autoLoggedIn: boolean = false;
  public updateNew: boolean = false;

  classDataDay1 = [];
  classDataDay2 = [];
  classDataDay3 = [];
  classDataDay4 = [];
  classDataDay5 = [];
  classDataDay6 = [];
  classDataDay7 = [];
  classDataDay8 = [];

  friendsInLunch1 = [];
  friendsInLunch2 = [];
  friendsInLunch3 = [];
  friendsInLunch4 = [];

  constructor(public http: Http, public platform: Platform) {
    this.http = http;
    platform.ready().then(() => {
      this.uid = Device.uuid;
      console.log("US: UID", this.uid);
    });
  }

  stressTestInitiate(i, max) {
    this.register(
      "stestusern" + i,
      "tester",
      "Test",
      "User" + i,
      "2021",
      this.compactA,
      this.compactB,
      this.compactC,
      this.compactD,
      this.compactE,
      this.compactF,
      this.compactG
    ).then((res) => {
      var s = res[0].data.status;
      console.log("Stress test " + i, s);
      if (s) {
        if (i < max - 1) {
          console.log("Next test");
          this.stressTestInitiate(i + 1, max);
        }
      }
    });
  }

  getSuspended() {
    return new Promise((resolve) => {
      this.platform.ready().then(() => {
        this.uid = Device.uuid;
        var target: string =
          "https://jefftc.com/oneday/us/getSuspended.php?uid=" + this.uid;
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
    });
  }

  authenticate(username: string, password: string, sql) {
    return new Promise((resolve) => {
      var target: string =
        "https://jefftc.com/oneday/us/login.php?username=" +
        username +
        "&password=" +
        password +
        "&uid=" +
        this.uid;
      this.http
        .get(target)
        .map((res) => res.json())
        .subscribe(
          (data) => {
            if (data != undefined) {
              console.log("Authenticate response", data);
              if (data.status) {
                this.suspended = data.suspended == 1;
                this.getSuspended().then((res) => {
                  if (this.suspended) {
                    resolve([{ data: data }]);
                  } else {
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
                    this.verified = data.verified == 1;
                    this.privacy = data.privacy;
                    console.log("Verified", this.verified);

                    this.saveCredentialsToSQL(sql).then((res) => {
                      this.savePersonalSchedule(sql).then((res) => {
                        resolve([{ data: data }]);
                      });
                    });
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
            console.log("Bypass", this.bypass);
            sql.query("SELECT * FROM personalData").then((data) => {
              if (data.res.rows.length > 0) {
                console.log("FOUND SQL DATA SET");
                var dataNumber: string;
                var dataLetter: string;
                console.log("Personal Rows", data.res.rows);
                var rows = [];
                for (var i = 0; i < data.res.rows.length; i++) {
                  rows.push({
                    letter: data.res.rows.item(i).letter,
                    name: data.res.rows.item(i).name,
                    category: data.res.rows.item(i).category,
                  });
                }
                console.log("Raw ", rows);
                this.classDataDay1 = [];
                this.classDataDay2 = [];
                this.classDataDay3 = [];
                this.classDataDay4 = [];
                this.classDataDay5 = [];
                this.classDataDay6 = [];
                this.classDataDay7 = [];
                this.classDataDay8 = [];
                for (var i = 0; i < 7; i++) {
                  this.classDataDay1.push({ className: "", classCategory: "" });
                  this.classDataDay2.push({ className: "", classCategory: "" });
                  this.classDataDay3.push({ className: "", classCategory: "" });
                  this.classDataDay4.push({ className: "", classCategory: "" });
                  this.classDataDay5.push({ className: "", classCategory: "" });
                  this.classDataDay6.push({ className: "", classCategory: "" });
                  this.classDataDay7.push({ className: "", classCategory: "" });
                  this.classDataDay8.push({ className: "", classCategory: "" });
                }
                this.setValuesForClassDataRaw(rows, 0);

                this.loadedLocal = true;
              }
            });
            resolve([
              { data: { status: false, response: "connection_error" } },
            ]);
          }
        );
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

  register(
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    gradYear: string,
    compactA: string,
    compactB: string,
    compactC: string,
    compactD: string,
    compactE: string,
    compactF: string,
    compactG: string
  ) {
    return new Promise((resolve) => {
      this.getSuspended().then((res) => {
        if (this.suspended) {
          resolve();
        } else {
          var target: string =
            "https://jefftc.com/oneday/us/register.php" +
            "?username=" +
            username +
            "&password=" +
            password +
            "&firstName=" +
            firstName +
            "&lastName=" +
            lastName +
            "&gradYear=" +
            gradYear +
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
            compactG +
            "&uid=" +
            this.uid;
          console.log("Register target", target);
          this.http
            .get(target)
            .map((res) => res.json())
            .subscribe((data) => {
              if (data != undefined) {
                console.log("Register response", data);
                resolve([
                  {
                    data: data,
                  },
                ]);
              }
            });
        }
      });
    });
  }

  logout(sql) {
    return new Promise((resolve) => {
      sql.query("DROP TABLE authData").then((data) => {
        sql
          .query(
            "CREATE TABLE IF NOT EXISTS authData (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)"
          )
          .then((res) => {
            sql
              .query(
                "INSERT into authData (username, password) VALUES ('', '')"
              )
              .then((res) => {
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
          });
      });
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

  pullCredentialsFromSQL(sql) {
    return new Promise((resolve) => {
      sql.query("SELECT * from authData").then((data) => {
        var username = "";
        var password = "";
        if (data.res.rows.length > 0) {
          username = data.res.rows.item(0).username;
          password = data.res.rows.item(0).password;
          this.username = username;
          this.password = password;
          if (username.length > 0 && password.length > 0) {
            console.log("Found authData", username + ", " + password);
            resolve([
              {
                status: true,
                username: username,
                password: password,
              },
            ]);
          } else {
            resolve([{ status: false }]);
          }
        } else {
          resolve([{ status: false }]);
        }
      });
    });
  }

  saveCredentialsToSQL(sql) {
    return new Promise((resolve) => {
      sql.query("DROP TABLE authData").then((data) => {
        sql
          .query(
            "CREATE TABLE IF NOT EXISTS authData (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)"
          )
          .then((res) => {
            sql
              .query(
                "INSERT into authData (username, password) VALUES ('" +
                  this.username +
                  "', '" +
                  this.password +
                  "')"
              )
              .then((res) => {
                resolve();
              });
          });
      });
    });
  }

  savePersonalSchedule(sql) {
    return new Promise((resolve) => {
      sql.query("SELECT * from personalData").then((data) => {
        if (data.res.rows.length > 0) {
          this.sPL(sql, false, 0).then((res) => {
            resolve();
          });
        } else {
          this.sPL(sql, true, 0).then((res) => {
            resolve();
          });
        }
      });
    });
  }

  sPL(sql, insertTrueUpdateFalse, iLetter) {
    return new Promise((resolve) => {
      var letters = ["A", "B", "C", "D", "E", "F", "G"];
      var saveLetter = letters[iLetter] + "1";
      var query = "";
      if (insertTrueUpdateFalse) {
        query =
          "INSERT INTO personalData (letter, name, category) VALUES ('" +
          saveLetter +
          "', '" +
          this.classDataDay1[iLetter].className +
          "', '" +
          this.classDataDay1[iLetter].classCategory +
          "')";
      } else {
        query =
          'UPDATE personalData SET letter = "' +
          saveLetter +
          '", name = "' +
          this.classDataDay1[iLetter].className +
          '", category = "' +
          this.classDataDay1[iLetter].classCategory +
          '" WHERE letter = "' +
          saveLetter +
          '"';
      }
      sql.query(query).then(
        (sqldata) => {
          saveLetter = letters[iLetter] + "2";
          if (insertTrueUpdateFalse) {
            query =
              "INSERT INTO personalData (letter, name, category) VALUES ('" +
              saveLetter +
              "', '" +
              this.classDataDay2[iLetter].className +
              "', '" +
              this.classDataDay2[iLetter].classCategory +
              "')";
          } else {
            query =
              'UPDATE personalData SET letter = "' +
              saveLetter +
              '", name = "' +
              this.classDataDay2[iLetter].className +
              '", category = "' +
              this.classDataDay2[iLetter].classCategory +
              '" WHERE letter = "' +
              saveLetter +
              '"';
          }
          sql.query(query).then(
            (sqldata2) => {
              saveLetter = letters[iLetter] + "3";
              if (insertTrueUpdateFalse) {
                query =
                  "INSERT INTO personalData (letter, name, category) VALUES ('" +
                  saveLetter +
                  "', '" +
                  this.classDataDay3[iLetter].className +
                  "', '" +
                  this.classDataDay3[iLetter].classCategory +
                  "')";
              } else {
                query =
                  'UPDATE personalData SET letter = "' +
                  saveLetter +
                  '", name = "' +
                  this.classDataDay3[iLetter].className +
                  '", category = "' +
                  this.classDataDay3[iLetter].classCategory +
                  '" WHERE letter = "' +
                  saveLetter +
                  '"';
              }
              sql.query(query).then(
                (sqldata3) => {
                  saveLetter = letters[iLetter] + "4";
                  if (insertTrueUpdateFalse) {
                    query =
                      "INSERT INTO personalData (letter, name, category) VALUES ('" +
                      saveLetter +
                      "', '" +
                      this.classDataDay4[iLetter].className +
                      "', '" +
                      this.classDataDay4[iLetter].classCategory +
                      "')";
                  } else {
                    query =
                      'UPDATE personalData SET letter = "' +
                      saveLetter +
                      '", name = "' +
                      this.classDataDay4[iLetter].className +
                      '", category = "' +
                      this.classDataDay4[iLetter].classCategory +
                      '" WHERE letter = "' +
                      saveLetter +
                      '"';
                  }
                  sql.query(query).then(
                    (sqldata4) => {
                      saveLetter = letters[iLetter] + "5";
                      if (insertTrueUpdateFalse) {
                        query =
                          "INSERT INTO personalData (letter, name, category) VALUES ('" +
                          saveLetter +
                          "', '" +
                          this.classDataDay5[iLetter].className +
                          "', '" +
                          this.classDataDay5[iLetter].classCategory +
                          "')";
                      } else {
                        query =
                          'UPDATE personalData SET letter = "' +
                          saveLetter +
                          '", name = "' +
                          this.classDataDay5[iLetter].className +
                          '", category = "' +
                          this.classDataDay5[iLetter].classCategory +
                          '" WHERE letter = "' +
                          saveLetter +
                          '"';
                      }
                      sql.query(query).then(
                        (sqldata5) => {
                          saveLetter = letters[iLetter] + "6";
                          if (insertTrueUpdateFalse) {
                            query =
                              "INSERT INTO personalData (letter, name, category) VALUES ('" +
                              saveLetter +
                              "', '" +
                              this.classDataDay6[iLetter].className +
                              "', '" +
                              this.classDataDay6[iLetter].classCategory +
                              "')";
                          } else {
                            query =
                              'UPDATE personalData SET letter = "' +
                              saveLetter +
                              '", name = "' +
                              this.classDataDay6[iLetter].className +
                              '", category = "' +
                              this.classDataDay6[iLetter].classCategory +
                              '" WHERE letter = "' +
                              saveLetter +
                              '"';
                          }
                          sql.query(query).then(
                            (sqldata6) => {
                              saveLetter = letters[iLetter] + "7";
                              if (insertTrueUpdateFalse) {
                                query =
                                  "INSERT INTO personalData (letter, name, category) VALUES ('" +
                                  saveLetter +
                                  "', '" +
                                  this.classDataDay7[iLetter].className +
                                  "', '" +
                                  this.classDataDay7[iLetter].classCategory +
                                  "')";
                              } else {
                                query =
                                  'UPDATE personalData SET letter = "' +
                                  saveLetter +
                                  '", name = "' +
                                  this.classDataDay7[iLetter].className +
                                  '", category = "' +
                                  this.classDataDay7[iLetter].classCategory +
                                  '" WHERE letter = "' +
                                  saveLetter +
                                  '"';
                              }
                              sql.query(query).then(
                                (sqldata7) => {
                                  saveLetter = letters[iLetter] + "8";
                                  if (insertTrueUpdateFalse) {
                                    query =
                                      "INSERT INTO personalData (letter, name, category) VALUES ('" +
                                      saveLetter +
                                      "', '" +
                                      this.classDataDay8[iLetter].className +
                                      "', '" +
                                      this.classDataDay8[iLetter]
                                        .classCategory +
                                      "')";
                                  } else {
                                    query =
                                      'UPDATE personalData SET letter = "' +
                                      saveLetter +
                                      '", name = "' +
                                      this.classDataDay8[iLetter].className +
                                      '", category = "' +
                                      this.classDataDay8[iLetter]
                                        .classCategory +
                                      '" WHERE letter = "' +
                                      saveLetter +
                                      '"';
                                  }
                                  sql.query(query).then(
                                    (sqldata8) => {
                                      /* */

                                      if (iLetter < letters.length - 1) {
                                        this.sPL(
                                          sql,
                                          insertTrueUpdateFalse,
                                          iLetter + 1
                                        ).then((res) => {
                                          if (res[0].status) {
                                            resolve([{ status: true }]);
                                          }
                                        });
                                      } else {
                                        resolve([{ status: true }]);
                                      }

                                      /* */
                                    },
                                    (error8) => {
                                      console.log(error8);
                                    }
                                  );
                                },
                                (error7) => {
                                  console.log(error7);
                                }
                              );
                            },
                            (error6) => {
                              console.log(error6);
                            }
                          );
                        },
                        (error5) => {
                          console.log(error5);
                        }
                      );
                    },
                    (error4) => {
                      console.log(error4);
                    }
                  );
                },
                (error3) => {
                  console.log(error3);
                }
              );
            },
            (error2) => {
              console.log(error2);
            }
          );
        },
        (error) => {
          console.log(error);
        }
      );
    });
  }

  pushPersonalSchedule(sql) {
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
}
