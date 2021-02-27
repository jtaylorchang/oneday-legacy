import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  LoadingController,
  AlertController,
  ToastController,
} from "ionic-angular";
import { UserService } from "../../providers/user-service";
import { Sql } from "../providers/Sql";
import { Http } from "@angular/http";
import { ViewChild } from "@angular/core";

@Component({
  selector: "page-friends",
  templateUrl: "friends.html",
  queries: {
    content: new ViewChild("content"),
  },
})
export class FriendsPage {
  public loader: any;

  shouldShowCancel = "true";
  friendSeg: any = "friends";
  sortAlpha: boolean = false;
  sortPopularity: boolean = true;
  sortGradYear: boolean = false;
  searchBar: any = "";
  showSearch: boolean = false;
  searchParam: string = "";
  searchFoundUser: boolean = false;
  searchedUser: any;

  loggedIn: boolean = false;
  peopleArray = [];
  friendArray = [];
  nonfriendArray = [];
  requestArray = [];
  requestArrayR = [];
  requestArrayS = [];

  friendArraySorted = [];
  friendArrayPages = [];
  requestArrayRSorted = [];
  requestArrayRPages = [];
  requestArraySSorted = [];
  requestArraySPages = [];
  nonfriendArrayVisible = [];
  nonfriendArraySorted = [];
  nonfriendArraySearched = [];
  nonfriendArrayPages = [];
  currentPage: number = 0;
  currentPageF: number = 0;
  currentPageR: number = 0;
  currentPageS: number = 0;
  totalPages: number = 0;
  totalPagesF: number = 0;
  totalPagesR: number = 0;
  totalPagesS: number = 0;

  sortOptions = [
    "By First Name",
    "By Last Name",
    "By Username",
    "By Graduation Year",
    "By Popularity",
  ];

  @ViewChild("content") content: any;

  constructor(
    public http: Http,
    public navCtrl: NavController,
    public navParams: NavParams,
    public us: UserService,
    private sql: Sql,
    public ac: AlertController,
    public tc: ToastController,
    public lc: LoadingController
  ) {}

  pagifyFriends() {
    this.friendArrayPages = [];
    var added: number = 0;
    var current = [];
    var c: number = 0;
    for (var i = 0; i < this.friendArraySorted.length; i++) {
      current.push(this.friendArraySorted[i]);
      current[current.length - 1].id = c;
      added += 1;
      if (added == 10 || i == this.friendArraySorted.length - 1) {
        added = 0;
        this.friendArrayPages.push(current);
        current = [];
        c += 1;
      }
    }
    this.totalPagesF = this.friendArrayPages.length;
    if (this.currentPageF >= this.totalPagesF) {
      this.currentPageF = this.totalPagesF - 1;
    }
    console.log("Pages Friends", this.friendArrayPages);
  }

  pagifyRequestsR() {
    this.requestArrayRPages = [];
    var added: number = 0;
    var current = [];
    var c: number = 0;
    for (var i = 0; i < this.requestArrayRSorted.length; i++) {
      current.push(this.requestArrayRSorted[i]);
      current[current.length - 1].id = c;
      added += 1;
      if (added == 10 || i == this.requestArrayRSorted.length - 1) {
        added = 0;
        this.requestArrayRPages.push(current);
        current = [];
        c += 1;
      }
    }
    this.totalPagesR = this.requestArrayRPages.length;
    if (this.currentPageR >= this.totalPagesR) {
      this.currentPageR = this.totalPagesR - 1;
    }
    console.log("Pages RequestsR", this.requestArrayRPages);
  }

  pagifyRequestsS() {
    this.requestArraySPages = [];
    var added: number = 0;
    var current = [];
    var c: number = 0;
    for (var i = 0; i < this.requestArraySSorted.length; i++) {
      current.push(this.requestArraySSorted[i]);
      current[current.length - 1].id = c;
      added += 1;
      if (added == 10 || i == this.requestArraySSorted.length - 1) {
        added = 0;
        this.requestArraySPages.push(current);
        current = [];
        c += 1;
      }
    }
    this.totalPagesS = this.requestArraySPages.length;
    if (this.currentPageS >= this.totalPagesS) {
      this.currentPageS = this.totalPagesS - 1;
    }
    console.log("Pages RequestsS", this.requestArraySPages);
  }

  pagifyNonFriends() {
    this.nonfriendArrayPages = [];
    var added: number = 0;
    var current = [];
    var c: number = 0;
    for (var i = 0; i < this.nonfriendArraySorted.length; i++) {
      current.push(this.nonfriendArraySorted[i]);
      current[current.length - 1].id = c;
      added += 1;
      if (added == 10 || i == this.nonfriendArraySorted.length - 1) {
        added = 0;
        this.nonfriendArrayPages.push(current);
        current = [];
        c += 1;
      }
    }
    this.totalPages = this.nonfriendArrayPages.length;
    if (this.currentPage >= this.totalPages) {
      this.currentPage = this.totalPages - 1;
    }
    console.log("Pages Nonfriends", this.nonfriendArrayPages);
  }

  onClickLastPage(bottom, type) {
    console.log("Clicked Last Page", bottom, type);
    switch (type) {
      case "n":
        this.currentPage = this.totalPages - 1;
        break;
      case "f":
        this.currentPageF = this.totalPagesF - 1;
        break;
      case "r":
        this.currentPageR = this.totalPagesR - 1;
        break;
      case "s":
        this.currentPageS = this.totalPagesS - 1;
        break;
    }
    if (bottom) {
      setTimeout(() => {
        this.content.scrollToBottom(0); //300ms animation speed
      });
    }
  }

  onClickNextPage(bottom, type) {
    console.log("Clicked Next Page", bottom, type);
    switch (type) {
      case "n":
        if (this.currentPage < this.totalPages - 1) {
          this.currentPage += 1;
          if (bottom) {
            setTimeout(() => {
              this.content.scrollToBottom(0); //300ms animation speed
            });
          }
        }
        break;
      case "f":
        if (this.currentPageF < this.totalPagesF - 1) {
          this.currentPageF += 1;
          if (bottom) {
            setTimeout(() => {
              this.content.scrollToBottom(0); //300ms animation speed
            });
          }
        }
        break;
      case "r":
        if (this.currentPageR < this.totalPagesR - 1) {
          this.currentPageR += 1;
          if (bottom) {
            setTimeout(() => {
              this.content.scrollToBottom(0); //300ms animation speed
            });
          }
        }
        break;
      case "s":
        if (this.currentPageS < this.totalPagesS - 1) {
          this.currentPageS += 1;
          if (bottom) {
            setTimeout(() => {
              this.content.scrollToBottom(0); //300ms animation speed
            });
          }
        }
        break;
    }
  }

  onClickPrevPage(bottom, type) {
    console.log("Clicked Prev Page", bottom, type);
    switch (type) {
      case "n":
        if (this.currentPage > 0) {
          this.currentPage -= 1;
          if (bottom) {
            setTimeout(() => {
              this.content.scrollToBottom(0); //300ms animation speed
            });
          }
        }
        break;
      case "f":
        if (this.currentPageF > 0) {
          this.currentPageF -= 1;
          if (bottom) {
            setTimeout(() => {
              this.content.scrollToBottom(0); //300ms animation speed
            });
          }
        }
        break;
      case "r":
        if (this.currentPageR > 0) {
          this.currentPageR -= 1;
          if (bottom) {
            setTimeout(() => {
              this.content.scrollToBottom(0); //300ms animation speed
            });
          }
        }
        break;
      case "s":
        if (this.currentPageS > 0) {
          this.currentPageS -= 1;
          if (bottom) {
            setTimeout(() => {
              this.content.scrollToBottom(0); //300ms animation speed
            });
          }
        }
        break;
    }
  }

  onClickFirstPage(bottom, type) {
    console.log("Clicked First Page", bottom, type);
    switch (type) {
      case "n":
        this.currentPage = 0;
        if (bottom) {
          setTimeout(() => {
            this.content.scrollToBottom(0); //300ms animation speed
          });
        }
        break;
      case "f":
        this.currentPageF = 0;
        if (bottom) {
          setTimeout(() => {
            this.content.scrollToBottom(0); //300ms animation speed
          });
        }
        break;
      case "r":
        this.currentPageR = 0;
        if (bottom) {
          setTimeout(() => {
            this.content.scrollToBottom(0); //300ms animation speed
          });
        }
        break;
      case "s":
        this.currentPageS = 0;
        if (bottom) {
          setTimeout(() => {
            this.content.scrollToBottom(0); //300ms animation speed
          });
        }
        break;
    }
  }

  onSortChange(alpha: number) {
    switch (alpha) {
      case 0:
        if (this.sortAlpha) {
          this.sortAlpha = true;
          this.sortPopularity = false;
          this.sortGradYear = false;
          this.sortNonFriends(0);
        }
        break;
      case 1:
        if (this.sortPopularity) {
          this.sortAlpha = false;
          this.sortPopularity = true;
          this.sortGradYear = false;
          this.sortNonFriends(1);
        }
        break;
      case 2:
        if (this.sortGradYear) {
          this.sortAlpha = false;
          this.sortPopularity = false;
          this.sortGradYear = true;
          this.sortNonFriends(2);
        }
        break;
    }
  }

  onClickSearch() {
    this.createPromptAlert("Search Username", "username", "text").then(
      (res) => {
        if (res != undefined) {
          this.showSearch = true;
          this.searchParam = res[0];
          if (res[0] == "") {
            this.showSearch = false;
          } else {
            this.filterBySearch(this.searchParam);
          }
        } else {
          this.showSearch = false;
          this.searchParam = "";
        }
      }
    );
  }

  createPromptAlert(aTitle, aPlaceholder, aType) {
    return new Promise((resolve) => {
      let alert = this.ac.create({
        title: aTitle,
        inputs: [
          {
            name: "iname",
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
              console.log("User clicked OK");
              resolve([data.iname]);
            },
          },
        ],
      });
      alert.present();
    });
  }

  filterBySearch(uname) {
    this.searchFoundUser = false;
    for (var i = 0; i < this.nonfriendArray.length; i++) {
      if (this.nonfriendArray[i].username == uname.toLowerCase()) {
        if (this.nonfriendArray[i].privacy > 0) {
          this.searchFoundUser = true;
          this.searchedUser = this.nonfriendArray[i];
        }
      }
    }
  }

  onSearchInput(event) {
    if (this.searchBar.length > 0 && this.searchBar != "") {
      this.filterList(this.nonfriendArraySearched, this.searchBar);
    } else {
      this.nonfriendArraySearched = this.nonfriendArraySorted;
    }
  }

  onSearchCancel(event) {
    this.searchBar = "";
    this.nonfriendArraySearched = this.nonfriendArraySorted;
  }

  filterListPrivacy(contents) {
    return contents.filter((item) => {
      return item.privacy == 3 || item.privacy == 4;
    });
  }

  filterList(contents, search): any {
    //change 'title'
    return contents.filter((item) => {
      return item.username.toLowerCase().indexOf(search.toLowerCase()) > -1;
    });
  }

  sortRequestsR() {
    this.currentPageR = 0;
    this.requestArrayRSorted = this.requestArrayR;
    this.requestArrayRSorted.sort(function (a, b) {
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
    this.pagifyRequestsR();
  }

  sortRequestsS() {
    this.currentPageS = 0;
    this.requestArraySSorted = this.requestArrayS;
    this.requestArraySSorted.sort(function (a, b) {
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
    this.pagifyRequestsS();
  }

  sortFriends() {
    this.currentPageF = 0;
    this.friendArraySorted = this.friendArray;
    this.friendArraySorted.sort(function (a, b) {
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
    this.pagifyFriends();
  }

  sortNonFriends(sortType) {
    console.log("Sorting by type", sortType);
    this.currentPage = 0;
    this.nonfriendArrayVisible = this.nonfriendArray;
    this.nonfriendArrayVisible = this.filterListPrivacy(
      this.nonfriendArrayVisible
    );
    this.nonfriendArraySorted = this.nonfriendArrayVisible;

    if (sortType == 0) {
      this.nonfriendArraySorted.sort(function (a, b) {
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
    } else {
      this.partition(
        this.nonfriendArraySorted,
        sortType,
        0,
        this.nonfriendArraySorted.length - 1
      );
    }

    this.pagifyNonFriends();
    //this.nonfriendArraySearched = this.nonfriendArraySorted;
  }

  //use a quick sort to sort the following array by date
  partition(array, sortType: number, left: number, right: number) {
    if (array.length <= 1) {
      return;
    } else {
      var p: number = -1;
      var i: number = -1;

      this.pivot(array, left, right);
      p = left;
      i = left + 1;
      for (var j: number = left + 1; j <= right; j++) {
        switch (sortType) {
          case 1: //popularity
            if (array[j].friendCount > array[p].friendCount) {
              var a = array[j];
              var b = array[i];
              array[i] = a;
              array[j] = b;
              i++;
            }
            break;
          case 2: //graduation year
            if (array[j].gradYear > array[p].gradYear) {
              var a = array[j];
              var b = array[i];
              array[i] = a;
              array[j] = b;
              i++;
            }
            break;
          case -1:
            return;
        }
      }

      var a = array[p];
      var b = array[i - 1];
      array[p] = b;
      array[i - 1] = a;

      if (i - 2 - left >= 1) {
        this.partition(array, sortType, left, i - 2);
      }
      if (right - i >= 1) {
        this.partition(array, sortType, i, right);
      }
    }
  }

  pivot(array, left: number, right: number) {
    var a = array[left];
    var b = array[right];
    array[left] = b;
    array[right] = a;
  }

  getSortType(alpha, popular, grad) {
    if (alpha) return 0;
    if (popular) return 1;
    if (grad) return 2;
    return -1;
  }

  onClickDeny(person) {
    console.log("Clicked deny", person);
    var un = person.username;

    var target: string =
      "https://jefftc.com/oneday/us/denyFriend.php" +
      "?username=" +
      this.us.username +
      "&password=" +
      this.us.password +
      "&friend=" +
      un;
    console.log("Deny friend target", target);
    this.loader = this.lc.create({
      content: "Loading",
    });
    this.loader.present();
    this.http
      .get(target)
      .map((res) => res.json())
      .subscribe(
        (data) => {
          if (data != undefined) {
            console.log("Deny Friend response", data);
            var status: boolean = data.status;
            var requests = data.requests;
            var friends = data.friends;
            if (status) {
              this.sendToast("Success", "Friend request denied!");
              this.us.pullPeople().then((res) => {
                this.peopleArray = this.us.peopleArray;
                this.friendArray = this.us.friendArray;
                this.friendArraySorted = this.friendArray;
                this.nonfriendArray = this.us.nonfriendArray;
                this.nonfriendArrayVisible = this.us.nonfriendArray;
                this.nonfriendArrayVisible = this.filterListPrivacy(
                  this.nonfriendArrayVisible
                );
                this.nonfriendArraySorted = this.nonfriendArrayVisible;
                this.nonfriendArraySearched = this.nonfriendArrayVisible;
                this.requestArray = this.us.requestArray;
                this.requestArrayR = this.us.requestArrayR;
                this.requestArrayRSorted = this.requestArrayR;
                this.requestArrayS = this.us.requestArrayS;
                this.requestArraySSorted = this.requestArrayS;
                this.currentPageF = 0;
                this.currentPageS = 0;
                this.sortFriends();
                this.sortRequestsR();
                this.sortRequestsS();
                this.sortNonFriends(
                  this.getSortType(
                    this.sortAlpha,
                    this.sortPopularity,
                    this.sortGradYear
                  )
                );
                this.searchFoundUser = false;
                this.showSearch = false;
                this.searchParam = "";
                this.loader.dismiss();
              });
            } else {
              this.loader.dismiss();
              this.sendToast(
                "Failure",
                "Friend request could not be denied at this time!"
              );
            }
          } else {
            this.loader.dismiss();
            this.sendToast(
              "Failure",
              "Friend request could not be denied at this time!"
            );
          }
        },
        (error) => {
          this.loader.dismiss();
          this.sendToast("Failure", "You could not connect to the server!");
        }
      );
  }

  onClickAdd(person, accepting: boolean) {
    console.log("Clicked add", person);
    var un = person.username;

    var target: string =
      "https://jefftc.com/oneday/us/addFriend.php" +
      "?username=" +
      this.us.username +
      "&password=" +
      this.us.password +
      "&friend=" +
      un;
    console.log("Add friend target", target);
    this.loader = this.lc.create({
      content: "Loading",
    });
    this.loader.present();
    this.http
      .get(target)
      .map((res) => res.json())
      .subscribe(
        (data) => {
          if (data != undefined) {
            console.log("AddFriend response", data);
            var status: boolean = data.status;
            var requests = data.requests;
            var friends = data.friends;
            if (status) {
              if (accepting) {
                this.sendToast("Success", "Request accepted!");
              } else {
                this.sendToast("Success", "Request sent!");
              }
              this.us.pullPeople().then((res) => {
                this.peopleArray = this.us.peopleArray;
                this.friendArray = this.us.friendArray;
                this.friendArraySorted = this.friendArray;
                this.nonfriendArray = this.us.nonfriendArray;
                this.nonfriendArrayVisible = this.us.nonfriendArray;
                this.nonfriendArrayVisible = this.filterListPrivacy(
                  this.nonfriendArrayVisible
                );
                this.nonfriendArraySorted = this.nonfriendArrayVisible;
                this.nonfriendArraySearched = this.nonfriendArrayVisible;
                this.requestArray = this.us.requestArray;
                this.requestArrayR = this.us.requestArrayR;
                this.requestArrayRSorted = this.requestArrayR;
                this.requestArrayS = this.us.requestArrayS;
                this.requestArraySSorted = this.requestArrayS;
                this.currentPageF = 0;
                this.currentPageS = 0;
                this.sortFriends();
                this.sortRequestsR();
                this.sortRequestsS();
                this.sortNonFriends(
                  this.getSortType(
                    this.sortAlpha,
                    this.sortPopularity,
                    this.sortGradYear
                  )
                );
                this.searchFoundUser = false;
                this.showSearch = false;
                this.searchParam = "";
                this.loader.dismiss();
              });
            } else {
              this.loader.dismiss();
              this.sendToast(
                "Failure",
                "Friend could not be added at this time"
              );
              this.onClickRefresh();
            }
          } else {
            this.loader.dismiss();
            this.sendToast("Failure", "You could not connect to the server!");
          }
        },
        (error) => {
          this.loader.dismiss();
          this.sendToast("Failure", "You could not connect to the server!");
        }
      );
  }

  onClickRefresh() {
    console.log("Refresh clicked");
    if (this.us.authorized) {
      this.loader = this.lc.create({
        content: "Syncing",
      });
      this.loader.present();
      this.us.pullPeople().then((res) => {
        this.peopleArray = this.us.peopleArray;
        this.friendArray = this.us.friendArray;
        this.friendArraySorted = this.friendArray;
        this.nonfriendArray = this.us.nonfriendArray;
        this.nonfriendArrayVisible = this.us.nonfriendArray;
        this.nonfriendArrayVisible = this.filterListPrivacy(
          this.nonfriendArrayVisible
        );
        this.nonfriendArraySorted = this.nonfriendArrayVisible;
        this.nonfriendArraySearched = this.nonfriendArrayVisible;
        this.requestArray = this.us.requestArray;
        this.requestArrayR = this.us.requestArrayR;
        this.requestArrayRSorted = this.requestArrayR;
        this.requestArrayS = this.us.requestArrayS;
        this.requestArraySSorted = this.requestArrayS;
        this.currentPage = 0;
        this.currentPageF = 0;
        this.currentPageR = 0;
        this.currentPageS = 0;
        this.sortFriends();
        this.sortRequestsR();
        this.sortRequestsS();
        this.sortNonFriends(
          this.getSortType(
            this.sortAlpha,
            this.sortPopularity,
            this.sortGradYear
          )
        );
        this.searchFoundUser = false;
        this.showSearch = false;
        this.searchParam = "";
        this.loader.dismiss();
        //this.sendToast("Success", "You are now up to date!");
      });
    } else {
      this.sendToast("Failure", "You are not logged in!");
    }
  }

  sendToast(sTitle: string, sText: string) {
    let toast = this.tc.create({
      message: sText,
      duration: 3000,
      showCloseButton: true,
      position: "bottom",
    });
    toast.present();
  }

  ionViewWillEnter() {
    console.log("ionViewWillEnter FriendsPage");
    if (this.us.authorized) {
      this.loggedIn = true;
      this.peopleArray = this.us.peopleArray;
      this.friendArray = this.us.friendArray;
      this.friendArraySorted = this.friendArray;
      this.nonfriendArray = this.us.nonfriendArray;
      this.nonfriendArraySorted = this.us.nonfriendArray;
      this.nonfriendArraySearched = this.us.nonfriendArray;
      this.requestArray = this.us.requestArray;
      this.requestArrayR = this.us.requestArrayR;
      this.requestArrayRSorted = this.requestArrayR;
      this.requestArrayS = this.us.requestArrayS;
      this.requestArraySSorted = this.requestArrayS;

      this.currentPage = 0;
      this.currentPageF = 0;
      this.currentPageR = 0;
      this.currentPageS = 0;

      this.sortFriends();
      this.sortRequestsR();
      this.sortRequestsS();
      this.sortNonFriends(
        this.getSortType(this.sortAlpha, this.sortPopularity, this.sortGradYear)
      );
    } else {
      this.loggedIn = false;
    }
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad FriendsPage");
  }
}
