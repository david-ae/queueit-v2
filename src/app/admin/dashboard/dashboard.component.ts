import { Component, OnInit } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { Configuration } from 'src/app/config';
import { TransactionStore } from 'src/app/store/operations/transaction';
import { OperationsService } from 'src/app/operations/services/operations.service';
import { ReportStore } from 'src/app/store/admin/reportstore';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private _hubConnection: HubConnection;
  constructor(private _configuration: Configuration, public transactionStore: TransactionStore,
    public _operationsService: OperationsService, public reportStore: ReportStore) { }

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
    // this._operationsService.getTodaysTransactions()
    // .subscribe(() => {});
    // this.startSignalRConnection();
  }

}
