import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { ContainerComponent } from './container/container.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TransactiontypeComponent } from './transactiontype/transactiontype.component';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { StatusComponent } from './status/status.component';
import { ReportComponent } from './report/report.component';
import { ManageuserprofileComponent } from './manageuserprofile/manageuserprofile.component';
import { ChangeuserpasswordComponent } from './changeuserpassword/changeuserpassword.component';
import { ManageuserroleComponent } from './manageuserrole/manageuserrole.component';
import { ManageuserComponent } from './manageuser/manageuser.component';

@NgModule({
  declarations: [ContainerComponent, DashboardComponent, TransactiontypeComponent, UsersComponent, RolesComponent, StatusComponent, ReportComponent, ManageuserprofileComponent, ChangeuserpasswordComponent, ManageuserroleComponent, ManageuserComponent],
  imports: [
    NativeScriptCommonModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AdminModule { }
