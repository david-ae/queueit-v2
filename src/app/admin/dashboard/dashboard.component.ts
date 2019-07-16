import { Component, OnInit } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { Configuration } from 'src/app/config';
import { TransactionStore } from 'src/app/store/operations/transaction';
import { ReportStore } from 'src/app/store/admin/reportstore';
import { UserVO } from 'src/app/domainmodel/valueobjects/userVO';
import { TellerStore } from 'src/app/store/operations/teller';
import { GeneralService } from '../services/general.service';
import { FormGroup, FormControl } from '@angular/forms';
import { DateRangeApiModel } from '../apimodels/daterangeapimodel';
import { QueueITTransaction } from 'src/app/domainmodel/queueittransaction';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  transactionStatus: string;
  quickViewForm: FormGroup;
  search: boolean = false;

  p: number = 1;
  collection: any[] = this.reportStore.reportSystem.Tellers;

  private _hubConnection: HubConnection;
  constructor(private _configuration: Configuration, public transactionStore: TransactionStore,
    public reportStore: ReportStore, public tellerStore: TellerStore, 
    private _generalService: GeneralService, public spinner: NgxSpinnerService) { 
      this.quickViewForm = new FormGroup({
        dateTo: new FormControl('')
      });
    }

  startSignalRConnection(){
    let builder = new HubConnectionBuilder();
    this._hubConnection = builder.withUrl(this._configuration.ApiServer + 'transactions').build();

    this._hubConnection.on('GetTodayTransactions', data => {
      this.transactionStore.transactions = data;
      this.reportStore.sortCompletedTransactions(this.transactionStore.transactions);
      this.reportStore.sortRejectedTransactions(this.transactionStore.transactions);
      this.reportStore.sortTransactionsAwaitingMail(this.transactionStore.transactions);
      this.reportStore.sortTransactionsBeingProcessed(this.transactionStore.transactions);
      this.reportStore.sortSubmittedTransactions(this.transactionStore.transactions);
      this.reportStore.sortReturnedTransactions(this.transactionStore.transactions);
    });

    this._hubConnection.start().then(() => console.log("connected"));
  }

  ngOnInit() {
    this._generalService.getAllTellers()
        .subscribe((data: UserVO[]) => {
          this.tellerStore.tellersUserVO = data;
        });
    // this._operationsService.getTodaysTransactions()
    // .subscribe(() => {});
    // this.startSignalRConnection();
  }

  tellerSubmittedTransaction(){
    this.reportStore.tellerTransactionsActivityBreakdown(this.tellerStore.tellersUserVO, 
      this.reportStore.submittedTransactions);
    this.transactionStatus = this.reportStore.transactionStatus;
  }

  tellerProcessingTransactions(){
    this.reportStore.tellerTransactionsActivityBreakdown(this.tellerStore.tellersUserVO, 
      this.reportStore.processingTransactions);
      this.transactionStatus = this.reportStore.transactionStatus;
  }

  tellerAwaitingMailTransactions(){
    this.reportStore.tellerTransactionsActivityBreakdown(this.tellerStore.tellersUserVO, 
      this.reportStore.awaitingMailTransactions);
      this.transactionStatus = this.reportStore.transactionStatus;
  }

  retrieveAnalysis(){
    this.spinner.show();
    let dateRange = new DateRangeApiModel();
    let dateTo: string = this.quickViewForm.get("dateTo").value;

    dateRange.dateFrom = dateTo;
    dateRange.dateTo = dateTo;

    this._generalService.getTransactionsInDateRange(dateRange)
        .subscribe((data: QueueITTransaction[]) => {
          if(data){
            this.spinner.hide();
            this.search = true;
            this.reportStore.transactionsInRange = data;
            this.reportStore.sortCompletedTransactions(this.reportStore.transactionsInRange);
            this.reportStore.sortSubmittedTransactions(this.reportStore.transactionsInRange);
            this.reportStore.sortReturnedTransactions(this.reportStore.transactionsInRange);
            
            return;
          }         
        });
  }
}
