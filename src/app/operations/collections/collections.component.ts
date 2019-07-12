import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { TransactionStore } from 'src/app/store/operations/transaction';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { Configuration } from 'src/app/config';
import { OperationsService } from '../services/operations.service';
import { UserVO } from 'src/app/domainmodel/valueobjects/userVO';
import { TransactionService } from '../services/transaction.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { GeneralService } from 'src/app/admin/services/general.service';
import { Status } from 'src/app/domainmodel/status';
import { StatusStore } from 'src/app/store/admin/statusstore';
import { HttpErrorResponse } from '@angular/common/http';
import { TransactionTypeStore } from 'src/app/store/admin/transactiontypestore';
import { TransactionType } from 'src/app/domainmodel/transactiontype';

@Component({
  selector: 'app-collections',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.css']
})
export class CollectionsComponent implements OnInit {

  private _hubConnection: HubConnection;

  p: number = 1;
  collection: any[] = this.transactionStore.transactions;

  constructor(public transactionStore: TransactionStore, private _configuration: Configuration,
    private _operationsService: OperationsService, public statusStore: StatusStore, 
    private _transactionService: TransactionService, public transactionTypeStore: TransactionTypeStore,
    private spinner: NgxSpinnerService, private _generalService: GeneralService) { }

  startSignalRConnection(){
    let builder = new HubConnectionBuilder();
    this._hubConnection = builder.withUrl(this._configuration.ApiServer + 'transactions').build();

    this._hubConnection.on('GetTodayTransactions', data => {
      //console.log("From Operations Component: ");
      this.transactionStore.transactions = data;

    });

    this._hubConnection.start().then(() => console.log("connected"));
  }

  ngOnInit() {
    this._generalService.getStatusList()
        .subscribe((data: Status[]) => {
          this.spinner.hide();
            this.statusStore.statusList = data;
        },
        (err: HttpErrorResponse) => {
            console.log("Error: " + err);
        }
    );
    this._generalService.getTransactiontypes()
        .subscribe((data: TransactionType[]) => {
          this.spinner.hide();
            this.transactionTypeStore.transactiontypes = data;
        },
        (err: HttpErrorResponse) => {
            console.log("Error: " + err);
        }
    );
    this.spinner.show();
    this._operationsService.getTodaysTransactions()
    .subscribe(() => {
      this.spinner.hide();
    });
   this.startSignalRConnection();
  }

  completeTransaction(id: string){
    this.spinner.show();
    this.transactionStore.transaction = this.transactionStore.getTransaction(id);

    let user = new UserVO();
    user.firstname = "ADEMOLA";
    user.lastname = "RASAQ";
    user.identity = "58049c07b58d61601c304b77";
    user.email = "adeyemi.fanaike@yahoo.com";
    user.roles.push("TELLER");

    this.transactionStore.transaction.status = "Completed";
    this.transactionStore.transaction.completedBy = user;
    this.transactionStore.transaction.timeCompleted = new Date(); 
    this._transactionService.updateTransaction(this.transactionStore.transaction)
        .subscribe(() => {
          this.spinner.hide();
        });
  }

  rejectTransaction(id: string){
    this.spinner.show();
    this.transactionStore.transaction = this.transactionStore.getTransaction(id);

    let user = new UserVO();
    user.firstname = "ADEMOLA";
    user.lastname = "RASAQ";
    user.identity = "58049c07b58d61601c304b77";
    user.email = "adeyemi.fanaike@yahoo.com";
    user.roles.push("TELLER");

    this.transactionStore.transaction.status = "Rejected";
    this.transactionStore.transaction.rejectedBy.push( user);
    this.transactionStore.transaction.timeRejected.push(new Date()); 
    this._transactionService.updateTransaction(this.transactionStore.transaction)
        .subscribe(() => {
          this.spinner.hide();
        });
  }

  returnedTransaction(id: string){
    this.spinner.show();
    this.transactionStore.transaction = this.transactionStore.getTransaction(id);

    let user = new UserVO();
    user.firstname = "ADEMOLA";
    user.lastname = "RASAQ";
    user.identity = "58049c07b58d61601c304b77";
    user.email = "adeyemi.fanaike@yahoo.com";
    user.roles.push("TELLER");

    this.transactionStore.transaction.status = "Returned";
    this.transactionStore.transaction.returnedBy = user;
    this._transactionService.updateTransaction(this.transactionStore.transaction)
        .subscribe(() => {
          this.spinner.hide();
        });
  }
}
