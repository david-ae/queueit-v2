import { QueueITTransaction } from '../../domainmodel/queueittransaction';
import { Accounts } from '../../valueobjects/accountvo';
import { UserVO } from '../../valueobjects/userVO';
import { observable, computed, action, autorun } from 'mobx';
import { Injectable } from '@angular/core';
import { OperationsService } from 'src/app/operations/services/operations.service';

@Injectable()
export class OperationsFacade{
    //#region Transactions
    @observable transactions: QueueITTransaction[];
    @observable transaction: QueueITTransaction;
    @observable tellerTransactions: QueueITTransaction[];
    //#endregion

    //#region Tellers
    @observable seniorTellers: Accounts[];
    @observable tellers: Accounts[];
    @observable transactionalTellers: Accounts[];
    @observable teller: Accounts;
    @observable tellersUserVO: UserVO[];
    @observable seniorTellersUserVO: UserVO[];
    //#endregion

    constructor(private _operationsService: OperationsService){
            this.transactions = [];
            this.transaction = new QueueITTransaction();
            this.tellerTransactions = [];
            this.seniorTellers = [];
            this.tellers = [];
            this.transactionalTellers = [];
            this.tellersUserVO = [];
            this.teller = new Accounts();
            this.seniorTellersUserVO = [];
            
            autorun(()=>{
                //load up senior tellers
                this._operationsService.getSeniorTellers()
                .subscribe((data: Accounts[]) => {
                    console.log(data);
                    this.seniorTellers = data;
                });

                //load up transactional teller
                this._operationsService.getTransactionalTellers()
                    .subscribe((data: Accounts[]) => {
                        this.transactionalTellers = data;
                    });
            });
        
    }
    
    //#region Teller
    @computed get getTellerList(){
        return this.tellers;
    }

    @computed get getSeniorTellerList(){
        return this.seniorTellers;
    }

    @computed get getTellerUserrVOList(){
        return this.tellersUserVO;
    }

    @computed get getSeniorTellerUserVOList(){
        return this.seniorTellersUserVO;
    }

    @action getTellerUserVOById(id: string){
        var teller = this.tellersUserVO.find(t => t.identity == id);
        if(teller != null){
            return teller;
        }
        return teller;
    }

    @action getTellersFromTellerList(tellers: UserVO[]){
        this.tellersUserVO = tellers.filter(teller => teller.roles.find(role => role == "TELLER"));
    }
    
    @action getSeniorTellerById(id: string){
        var teller = this.seniorTellers.find(t => t.identity == id);
        if(teller != null){
            return teller;
        }
        return teller;
    }

    @action getTransactionalTellerById(id: string){
        var _teller = this.transactionalTellers.find(t => t.identity == id);
        if(_teller != null){
            return _teller;
        }
        return _teller;
    }

    @action getTellerById(id: string){
        var _teller = this.tellers.find(t => t.identity == id);
        if(_teller != null){
            return _teller;
        }
        return _teller;
    }

    @computed get getAccountsUserVOEquivalent(){
        return this.tellersUserVO;
    }

    @action turnAccountsToUserVO(accounts: Accounts[]){
        accounts.forEach(account => {
            var userVo = new UserVO();
            userVo.email = account.username;
            userVo.firstname = account.firstname;
            userVo.lastname = account.lastname;
            userVo.roles = account.roles;
            userVo.identity = account.identity;
            this.tellersUserVO.push(userVo);
        });        
    }
    //#endregion

    //#region Transaction
    @computed get getTransactionList(){
        return this.transactions;
    }

    @action getTransaction(id: string){
        var transaction  = this.transactions.find( t => t.id == id);
        if(transaction != null){
            return transaction;
        }
        return null;
    }

    @action updateTransaction(transaction: QueueITTransaction){
        this.transactions.forEach(element => {
            if(element.id == transaction.id){
                element.amount = transaction.amount;
                element.platenumber = transaction.platenumber;
                element.status = transaction.status;
                element.transactionType = transaction.transactionType;
                element.rejectedBy = transaction.rejectedBy;
                element.completedBy = transaction.completedBy;
                element.flaggedIssueBy = transaction.flaggedIssueBy;
                element.returnedBy = transaction.returnedBy;
                element.timeCompleted = transaction.timeCompleted;
                element.timeIssueFlagged = transaction.timeIssueFlagged;
                element.timeRejected = transaction.timeRejected;
                element.treatedBy = transaction.treatedBy;
                element.customerName = transaction.customerName;
            }
        });
    }
    
    @computed get getTellerTransactions(){
        return this.tellerTransactions;
    }    

    @action assignedTransactions(id: string, transactions: QueueITTransaction[]): QueueITTransaction[]{
        this.tellerTransactions = [];
        transactions.forEach(transaction => {
            transaction.treatedBy.forEach(teller => {
                if(teller.identity == id && transaction.status == "Submitted"){
                    this.tellerTransactions.push(transaction);
                }
            })            
        });
        console.log(this.tellerTransactions.length);

        return this.tellerTransactions;
    }
    //#endregion
}