import { NgModule, ErrorHandler } from "@angular/core";
import { IonicApp, IonicModule, IonicErrorHandler } from "ionic-angular";
import { MyApp } from "./app.component";
import { HomePage } from "../pages/home/home";
import { ClassEditorPage } from "../pages/class-editor/class-editor";
import { Sql } from "../pages/providers/Sql";
import { CloudSettings, CloudModule } from "@ionic/cloud-angular";
import { FriendsPage } from "../pages/friends/friends";
import { AboutMePage } from "../pages/about-me/about-me";
import { UserService } from "../providers/user-service";
import { TabsPage } from "../pages/tabs/tabs";
import { TermsPage } from "../pages/terms/terms";

const cloudSettings: CloudSettings = {
  core: {
    app_id: "4aff9a62",
  },
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ClassEditorPage,
    FriendsPage,
    AboutMePage,
    TabsPage,
    TermsPage,
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
      mode: "md",
    }),
    CloudModule.forRoot(cloudSettings),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ClassEditorPage,
    FriendsPage,
    AboutMePage,
    TabsPage,
    TermsPage,
  ],
  providers: [
    Sql,
    UserService,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
  ],
})
export class AppModule {}
