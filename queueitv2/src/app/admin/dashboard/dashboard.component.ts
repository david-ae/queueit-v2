import { Component, OnInit } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { Configuration } from 'src/app/config';
import { OperationsFacade } from 'src/app/services/operations/operationsfacade';
import { ReportFacade } from 'src/app/services/admin/reportsfacade';
import { UserVO } from 'src/app/valueobjects/userVO';
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
  collection: any[] = this.reportFacade.reportSystem.Tellers;

  private _hubConnection: HubConnection;
  constructor(private _configuration: Configuration, public operationsFacade: OperationsFacade,
    public reportFacade: ReportFacade, private _generalService: GeneralService, 
    public spinner: NgxSpinnerService) { 
      this.quickViewForm = new FormGroup({
        dateTo: new FormControl('')
      });
    }

  startSignalRConnection(){
    let builder = new HubConnectionBuilder();
    this._hubConnection = builder.withUrl(this._configuration.ApiServerSSL + 'transactions').build();

    this._hubConnection.on('GetTodayTransactions', data => {
      this.operationsFacade.transactions = data;
      this.reportFacade.sortCompletedTransactions(this.operationsFacade.transactions);
      this.reportFacade.sortRejectedTransactions(this.operationsFacade.transactions);
      this.reportFacade.sortTransactionsAwaitingMail(this.operationsFacade.transactions);
      this.reportFacade.sortTransactionsBeingProcessed(this.operationsFacade.transactions);
      this.reportFacade.sortSubmittedTransactions(this.operationsFacade.transactions);
      this.reportFacade.sortReturnedTransactions(this.operationsFacade.transactions);
    });

    this._hubConnection.start().then(() => console.log("connected"));
  }

  ngOnInit() {
    // this._operationsService.getTodaysTransactions()
    // .subscribe(() => {});
    this.startSignalRConnection();
  }

  tellerSubmittedTransaction(){
    this.reportFacade.tellerTransactionsActivityBreakdown(this.operationsFacade.tellersUserVO, 
      this.reportFacade.submittedTransactions);
    this.transactionStatus = this.reportFacade.transactionStatus;
  }

  tellerProcessingTransactions(){
    this.reportFacade.tellerTransactionsActivityBreakdown(this.operationsFacade.tellersUserVO, 
      this.reportFacade.processingTransactions);
      this.transactionStatus = this.reportFacade.transactionStatus;
  }

  tellerAwaitingMailTransactions(){
    this.reportFacade.tellerTransactionsActivityBreakdown(this.operationsFacade.tellersUserVO, 
      this.reportFacade.awaitingMailTransactions);
      this.transactionStatus = this.reportFacade.transactionStatus;
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
            this.reportFacade.transactionsInRange = data;
            this.reportFacade.sortCompletedTransactions(this.reportFacade.transactionsInRange);
            this.reportFacade.sortSubmittedTransactions(this.reportFacade.transactionsInRange);
            this.reportFacade.sortReturnedTransactions(this.reportFacade.transactionsInRange);
            
            return;
          }         
        });
  }
}
