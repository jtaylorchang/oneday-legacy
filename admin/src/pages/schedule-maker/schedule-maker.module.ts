import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ScheduleMaker } from "./schedule-maker";

@NgModule({
  declarations: [ScheduleMaker],
  imports: [IonicPageModule.forChild(ScheduleMaker)],
  exports: [ScheduleMaker],
})
export class ScheduleMakerModule {}
