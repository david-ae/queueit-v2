import { Component, OnInit, ChangeDetectionStrategy, Injectable } from '@angular/core';
import { TransactionStore } from 'src/app/store/operations/transaction';
import { OperationsService } from '../services/operations.service';
import { HubConnectionBuilder, HubConnection } from '@aspnet/signalr';
import { QueueITTransaction } from 'src/app/domainmodel/queueittransaction';
import { observable, computed } from 'mobx';
import { Configuration } from 'src/app/config';
import { TellerStore } from 'src/app/store/operations/teller';
import { Accounts } from 'src/app/domainmodel/valueobjects/accountvo';
import { FormGroup, FormControl } from '@angular/forms';
import { UserVO } from 'src/app/domainmodel/valueobjects/userVO';
import { TransactionService } from '../services/transaction.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class ProcessTransactionStore{
  @observable processTransactionStore: QueueITTransaction[] = [];

  constructor(){}

  @computed get getMyTransactionStore(){
    return this.processTransactionStore;
  }
}

@Component({
  selector: 'app-processtransactions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './processtransactions.component.html',
  styleUrls: ['./processtransactions.component.css']
})
export class ProcesstransactionsComponent implements OnInit {
  
  private _hubConnection: HubConnection;
  processTransactionForm: FormGroup;
  assignToColleagueForm: FormGroup;
  
  constructor(public myStore: ProcessTransactionStore, private _operationsService: OperationsService,
    public transactionStore: TransactionStore, private _configuration: Configuration,
    public tellerStore: TellerStore, private _transactionService: TransactionService,
    private spinner: NgxSpinnerService) { 
      this.processTransactionForm = new FormGroup({
        tellerid: new FormControl('')
      });
      this.assignToColleagueForm = new FormGroup({
        tellerid: new FormControl('')
      });
    }

  startSignalRConnection(){
    let builder = new HubConnectionBuilder();
    this._hubConnection = builder.withUrl(this._configuration.ApiServer + 'transactions').build();    

    this._hubConnection.on('GetTodayTransactions', data => {
      this.transactionStore.transactions = data;
      this.transactionStore.assignedTransactions("57ea6701bd4bc93842428cd6", 
                  this.transactionStore.transactions);
    });    

    this._hubConnection.start();
  }

  ngOnInit() {
    this.spinner.show();
    this._operationsService.getSeniorTellers()
        .subscribe((data: Accounts[]) => {
          this.tellerStore.seniortellers = data;
        });
    this._operationsService.getTransactionalTellers()
      .subscribe((data: Accounts[]) => {
        this.tellerStore.tellers = data;
      });
    this._operationsService.getTodaysTransactions()
    .subscribe(() => {
      this.spinner.hide();
    });
    this.startSignalRConnection();
  }

  assignTransactionToColleague(){
    this.spinner.show();
    let tellerid = this.processTransactionForm.get("tellerid").value;

    let teller = this.tellerStore.getTellerById(tellerid);
    let tellerUserVo = this.turnToUserVO(teller);
    this.transactionStore.transaction.treatedBy.push(tellerUserVo);

    this._transactionService.updateTransaction(this.transactionStore.transaction)
        .subscribe(() => {
          this.spinner.hide();
        });
  }

  assignTransaction(){
    this.spinner.show();

    let user = new UserVO();
    user.firstname = "ADEMOLA";
    user.lastname = "RASAQ";
    user.identity = "58049c07b58d61601c304b77";
    user.email = "adeyemi.fanaike@yahoo.com";
    user.roles.push("TELLER");

    this.transactionStore.transaction.treatedBy.push(user);

    this._transactionService.updateTransaction(this.transactionStore.transaction)
        .subscribe(() => {
          this.spinner.hide();
        });
  }

  markTransactionHasIssue(id: string){
    this.spinner.show();
    this.transactionStore.transaction = this.transactionStore.getTransaction(id);

    let user = new UserVO();
    user.firstname = "ADEMOLA";
    user.lastname = "RASAQ";
    user.identity = "58049c07b58d61601c304b77";
    user.email = "adeyemi.fanaike@yahoo.com";
    user.roles.push("TELLER");

    this.transactionStore.transaction.timeIssueFlagged.push(new Date());
    this.transactionStore.transaction.flaggedIssueBy.push(user);

    this._transactionService.updateTransaction(this.transactionStore.transaction)
        .subscribe(()=> {
          this.spinner.hide();
        });
  }

  turnToUserVO(user: Accounts): UserVO{
    let _user = new UserVO();
    _user.firstname = user.firstname
    _user.lastname = user.lastname
    _user.identity = user.identity;
    _user.email = user.username;
    _user.roles = user.roles;

    return _user;
  }

  selectedTransaction(id: string){
    this.transactionStore.transaction = this.transactionStore.getTransaction(id);
  }
}
