import { Accounts } from './../../domainmodel/valueobjects/accountvo';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { QueueITTransaction } from 'src/app/domainmodel/queueittransaction';
import { CustomerVO } from 'src/app/domainmodel/valueobjects/customerVO';
import { TransactionService } from '../services/transaction.service';
import { Transaction } from 'src/app/domainmodel/interfaces/transaction';
import { TransactionStore } from 'src/app/store/operations/transaction';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { UserVO } from 'src/app/domainmodel/valueobjects/userVO';
import { OutletImp } from 'src/app/domainmodel/outletimp';
import { TellerService } from '../services/teller.service';
import { TransactionApiModel } from '../apimodels/transactionapimodel';
import { OperationsService } from '../services/operations.service';
import { TransactionType } from 'src/app/domainmodel/transactiontype';
import { TransactionTypeStore } from 'src/app/store/admin/transactiontypestore';
import { TellerStore } from 'src/app/store/operations/teller';
import { Configuration } from 'src/app/config';
import { NgxSpinnerService } from 'ngx-spinner';

export class Item{
  name:string;
  value:string;
}

export const ITEMS: Item[] = [
  {
      name:'Submitted',
      value:'Submitted'
   },
   {
       name:'Processing',
       value:'Processing'
    }
];

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./job.component.css']
})
export class JobComponent implements OnInit {

  radioSel:any;
  radioSelected:string;
  radioSelectedString:string;
  itemsList: Item[] = ITEMS;

  transactionForm: FormGroup;
  buttonName: string = "Add Transaction";

  private _hubConnection: HubConnection;

  p: number = 1;
  collection: any[] = this.transactionStore.transactions;
  
  constructor(private _transactionService: TransactionService, private _operationsService: OperationsService,
    public transactionStore: TransactionStore, public transactionTypeStore: TransactionTypeStore,
    public tellerStore: TellerStore, private _configuration: Configuration,
    private spinner: NgxSpinnerService) { 
    this.transactionForm = new FormGroup({
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      transactiontype: new FormControl('', Validators.required),
      registrationnumber: new FormControl('', Validators.required),
      amount: new FormControl('', Validators.required),
      tellerid: new FormControl('', Validators.required),
      status: new FormControl('', Validators.required)
    });
    this.itemsList = ITEMS;
      // this.radioSelected = "item_3";
      this.getSelecteditem();
  }  

  startSignalRConnection(){
    let builder = new HubConnectionBuilder();
    this._hubConnection = builder.withUrl(this._configuration.ApiServer + 'transactions').build();

    this._hubConnection.on('GetTodayTransactions', data => {
      this.transactionStore.transactions = data;
    });

    this._hubConnection.start().then(() => console.log("connected"));
  }

  ngOnInit() {        
    this.spinner.show();
    //load up transaction types
    this._operationsService.getTransactiontypes()
        .subscribe((data: TransactionType[]) => {
            this.transactionTypeStore.transactiontypes = data;
        });

        //load up senior tellers
    this._operationsService.getSeniorTellers()
        .subscribe((data: Accounts[]) => {
          this.tellerStore.seniortellers = data;
        });
    //invoke signalr
      this._operationsService.getTodaysTransactions()
    .subscribe(() => {
      this.spinner.hide();
    });
      //start streaming/listening for data via signalr
    this.startSignalRConnection();
  }

  getSelecteditem(){
    this.radioSel = ITEMS.find(Item => Item.value === this.radioSelected);
    this.radioSelectedString = JSON.stringify(this.radioSel);
  }

  onItemChange(item){
    this.getSelecteditem();
  }

  addTransaction(){
    this.spinner.show();
    let transaction = new TransactionApiModel();
    let firstname = this.transactionForm.get("firstname").value;
    let lastname = this.transactionForm.get("lastname").value;

    let agent = new CustomerVO();
    agent.firstname = firstname;
    agent.lastname = lastname;

    let user = new UserVO();
    user.firstname = "ADEMOLA";
    user.lastname = "RASAQ";
    user.identity = "58049c07b58d61601c304b77";
    user.email = "adeyemi.fanaike@yahoo.com";
    user.roles.push("TELLER");

    transaction.customerName = agent;
    transaction.platenumber = this.transactionForm.get("registrationnumber").value;
    transaction.status = this.transactionForm.get("status").value;
    transaction.transactionType = this.transactionForm.get("transactiontype").value;
    transaction.amount = this.transactionForm.get("amount").value;
    transaction.createdBy = user;
    transaction.treatedBy = this.transactionForm.get("tellerid").value;
    transaction.timeSubmitted = new Date();
    transaction.outletName = "Courteville";
    transaction.allocatedTime = "10";

    this._transactionService.addTransaction(transaction).subscribe((data: QueueITTransaction) =>{
      this.spinner.hide();
      this.transactionForm.reset();
    });    
  }

  editTransaction(id: string){    
    this.transactionStore.transaction = this.transactionStore.getTransaction(id);
    
    this.transactionForm.setValue({
      firstname: this.transactionStore.transaction.customerName.firstname,
      lastname: this.transactionStore.transaction.customerName.lastname,
      transactiontype: this.transactionStore.transaction.transactionType,
      registrationnumber: this.transactionStore.transaction.platenumber,
      amount: this.transactionStore.transaction.amount,
      tellerid: this.transactionStore.transaction.treatedBy[0].identity,
      status: this.transactionStore.transaction.status
    });
    this.transactionStore.transaction.treatedBy = [];
    this.transactionStore.transaction.completedBy = null;
    this.transactionStore.transaction.returnedBy = null;
    this.buttonName = "Update Transaction";
  }

  updateTransaction(){
    this.spinner.show();
    let firstname = this.transactionForm.get("firstname").value;
    let lastname = this.transactionForm.get("lastname").value;

    let agent = new CustomerVO();
    agent.firstname = firstname;
    agent.lastname = lastname;

    this.transactionStore.transaction.customerName = agent;
    this.transactionStore.transaction.platenumber = this.transactionForm.get("registrationnumber").value;
    this.transactionStore.transaction.status = this.transactionForm.get("status").value;
    this.transactionStore.transaction.transactionType = this.transactionForm.get("transactiontype").value;
    this.transactionStore.transaction.amount = this.transactionForm.get("amount").value;

    let tellerid: string = this.transactionForm.get("tellerid").value;
    let teller = this.tellerStore.getTellerById(tellerid);
    let tellerUserVo = this.turnToUserVO(teller);
    this.transactionStore.transaction.treatedBy.push(tellerUserVo); 
    this._transactionService.updateTransaction(this.transactionStore.transaction)
        .subscribe(() => {
          this.spinner.hide();
          this.transactionForm.reset();          
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

}
