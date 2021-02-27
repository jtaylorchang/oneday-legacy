import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { AboutMe } from "./about-me";

@NgModule({
  declarations: [AboutMe],
  imports: [IonicPageModule.forChild(AboutMe)],
  exports: [AboutMe],
})
export class AboutMeModule {}
