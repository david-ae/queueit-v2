import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from './container/container.component';
import { JobComponent } from './job/job.component';
import { CollectionsComponent } from './collections/collections.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MobxAngularModule } from 'mobx-angular';
import { routing } from './operations.routing';
import { ProcesstransactionsComponent, ProcessTransactionStore } from './processtransactions/processtransactions.component';
import { TransactionService } from './services/transaction.service';
import { TransactionStore } from '../store/operations/transaction';
import { StatusreportbarComponent } from './statusreportbar/statusreportbar.component';
import { TransactionPipe } from './pipes/transaction.pipe';
import { TellertransactionPipe } from './pipes/tellertransaction.pipe';
import { TellerStore } from '../store/operations/teller';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    ContainerComponent, 
    JobComponent, 
    CollectionsComponent, 
    ProcesstransactionsComponent, 
    StatusreportbarComponent, 
    TransactionPipe, 
    TellertransactionPipe],
  imports: [
    CommonModule,
    HttpClientModule,
    NgxPaginationModule,
    NgSelectModule,
    NgxSpinnerModule,
    RouterModule,
    ReactiveFormsModule,
    MobxAngularModule,
    FormsModule,
    SharedModule,
    routing
  ],
  providers: [TransactionService, TransactionStore, TellerStore, ProcessTransactionStore],
  exports:[TransactionPipe, 
    TellertransactionPipe]
})
export class OperationsModule { }
