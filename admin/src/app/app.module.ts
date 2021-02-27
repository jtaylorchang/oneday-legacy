import { NgModule, ErrorHandler } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { IonicApp, IonicModule, IonicErrorHandler } from "ionic-angular";
import { MyApp } from "./app.component";

import { AboutMe } from "../pages/about-me/about-me";
import { UserManagement } from "../pages/user-management/user-management";
import { ScheduleMaker } from "../pages/schedule-maker/schedule-maker";
import { TabsPage } from "../pages/tabs/tabs";

import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { UserService } from "../providers/user-service";
import { DtService } from "../providers/dt-service";
import { HttpModule } from "@angular/http";

@NgModule({
  declarations: [MyApp, AboutMe, UserManagement, ScheduleMaker, TabsPage],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      mode: "md",
    }),
    HttpModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp, AboutMe, UserManagement, ScheduleMaker, TabsPage],
  providers: [
    StatusBar,
    SplashScreen,
    UserService,
    DtService,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
  ],
})
export class AppModule {}
