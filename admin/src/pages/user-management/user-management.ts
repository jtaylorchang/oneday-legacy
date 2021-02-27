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
  selector: "page-user-management",
  templateUrl: "user-management.html",
})
export class UserManagement {
  authorized: boolean = false;
  superUser: boolean = false;

  shouldShowCancel = "true";
  searchBar: any = "";
  searchType: number = 0;
  TYPE_NAME = 0;
  TYPE_USERNAME = 1;
  TYPE_UID = 2;

  people = [];
  peopleSearched = [];
  grid = [];

  public loader: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public us: UserService,
    public lc: LoadingController,
    public asc: ActionSheetController
  ) {}

  updateUsers() {
    this.loader = this.lc.create({
      content: "Updating",
    });
    this.loader.present();
    this.us.pullPeople().then((res) => {
      this.loader.dismiss();
      this.people = this.us.peopleArray;
      this.peopleSearched = this.people;
      this.onSearchInput(undefined);
    });
  }

  setGrid(p) {
    this.grid = [];
    var row = [];
    var added = 0;
    for (var i = 0; i < p.length; i++) {
      added++;
      row.push(p[i]);
      if (added == 4) {
        this.grid.push(row);
        row = [];
        added = 0;
      }
    }
    if (row.length >= 1) {
      this.grid.push(row);
    }
    console.log(this.grid);
  }

  resetSearch() {
    this.peopleSearched = this.people;
  }

  onSearchInput(event) {
    console.log(this.searchBar);
    if (this.searchBar.length > 0 && this.searchBar != "") {
      this.peopleSearched = this.filterList(this.searchBar);
    } else {
      this.resetSearch();
    }
    this.setGrid(this.peopleSearched);
  }

  filterList(search): any {
    if (this.searchType == this.TYPE_NAME) {
      return this.people.filter((item) => {
        return (
          (item.lastName + ", " + item.firstName)
            .toLowerCase()
            .indexOf(search.toLowerCase()) > -1
        );
      });
    } else if (this.searchType == this.TYPE_USERNAME) {
      return this.people.filter((item) => {
        return item.username.toLowerCase().indexOf(search.toLowerCase()) > -1;
      });
    } else if (this.searchType == this.TYPE_UID) {
      return this.people.filter((item) => {
        return item.uid.toLowerCase().indexOf(search.toLowerCase()) > -1;
      });
    }
    return this.people.filter((item) => {
      return (
        (item.lastName + ", " + item.firstName)
          .toLowerCase()
          .indexOf(search.toLowerCase()) > -1
      );
    });
  }

  onSearchCancel(event) {
    this.searchBar = "";
    this.resetSearch();
  }

  onClickRefresh() {
    this.updateUsers();
  }

  onClickBlock(user) {
    console.log("Clicked block", user);
    if (user.suspended == "1") {
      this.us
        .createRadioAlert("UnSuspend @" + user.username + "?", ["Yes", "No"])
        .then((res) => {
          if (res != undefined && res == "Yes") {
            this.us.unblock(user).then((res) => {
              this.updateUsers();
            });
          }
        });
    } else {
      this.us
        .createRadioAlert("Suspend @" + user.username + "?", ["Yes", "No"])
        .then((res) => {
          if (res != undefined && res == "Yes") {
            this.us.block(user).then((res) => {
              this.updateUsers();
            });
          }
        });
    }
  }

  onClickPromote(user) {
    if (user.verified) {
      this.us
        .createRadioAlert("Demote @" + user.username + "?", ["Yes", "No"])
        .then((res) => {
          if (res != undefined && res == "Yes") {
            this.us.demote(user).then((res) => {
              this.updateUsers();
            });
          }
        });
    } else {
      this.us
        .createRadioAlert("Promote @" + user.username + "?", ["Yes", "No"])
        .then((res) => {
          if (res != undefined && res == "Yes") {
            this.us.promote(user).then((res) => {
              this.updateUsers();
            });
          }
        });
    }
  }

  onClickTerminate(user) {
    this.us
      .createRadioAlert("Terminate @" + user.username + "?", ["Yes", "No"])
      .then((res) => {
        if (res != undefined && res == "Yes") {
          if (user.expired) {
            this.us.terminate(user).then((res) => {
              this.updateUsers();
            });
          }
        }
      });
  }

  onClickSearchOptions() {
    let asc = this.asc.create({
      title: "Search Options",
      enableBackdropDismiss: true,
      buttons: [
        {
          text: "By name",
          icon: "md-person",
          cssClass: "ascBtnEdit",
          handler: () => {
            console.log("User clicked button", "AS-name");
            this.searchType = this.TYPE_NAME;
            this.updateUsers();
          },
        },
        {
          text: "By username",
          icon: "md-contact",
          cssClass: "ascBtnEdit",
          handler: () => {
            console.log("User clicked button", "AS-username");
            this.searchType = this.TYPE_USERNAME;
            this.updateUsers();
          },
        },
        {
          text: "By UID",
          icon: "md-key",
          cssClass: "ascBtnEdit",
          handler: () => {
            console.log("User clicked button", "AS-uid");
            this.searchType = this.TYPE_UID;
            this.updateUsers();
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

  ionViewWillEnter() {
    this.authorized = this.us.authorized;
    this.superUser = this.us.superUser;
    if (this.authorized) {
      this.updateUsers();
    }
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad UserManagement");
  }
}
