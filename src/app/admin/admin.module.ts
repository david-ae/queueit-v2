import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from './container/container.component';
import { routing } from './admin.routing';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { TransactiontypeComponent } from './transactiontype/transactiontype.component';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { StatusComponent } from './status/status.component';
import { ReportComponent } from './report/report.component';
import { Configuration } from '../config';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoleStore } from '../store/admin/rolestore';
import { MobxAngularModule } from 'mobx-angular';
import { StatusStore } from '../store/admin/statusstore';
import { TransactionTypeStore } from '../store/admin/transactiontypestore';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import {NgxPaginationModule} from 'ngx-pagination';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReportStore } from '../store/admin/reportstore';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TransactionPipe } from './pipes/transaction.pipe';
import { ManageuserprofileComponent } from './manageuserprofile/manageuserprofile.component';
import { ChangeuserpasswordComponent } from './changeuserpassword/changeuserpassword.component';
import { ManageuserroleComponent } from './manageuserrole/manageuserrole.component';
import { UserStore } from '../store/admin/userstore';
import { UserPipe } from './pipes/user.pipe';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    ContainerComponent, 
    DashboardComponent, 
    TransactiontypeComponent, 
    UsersComponent, 
    RolesComponent, 
    StatusComponent, 
    ReportComponent, 
    TransactionPipe, 
    ManageuserprofileComponent, 
    ChangeuserpasswordComponent, 
    ManageuserroleComponent,
    UserPipe
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    routing
  ],
  providers: [Configuration, RoleStore, StatusStore, TransactionTypeStore, ReportStore, UserStore,
    NgxSpinnerService
  ],
  exports:[NgxSpinnerModule]
})
export class AdminModule { }
