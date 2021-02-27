import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { UserManagement } from "./user-management";

@NgModule({
  declarations: [UserManagement],
  imports: [IonicPageModule.forChild(UserManagement)],
  exports: [UserManagement],
})
export class UserManagementModule {}
