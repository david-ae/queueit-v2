import { observable, computed, action } from 'mobx';
import { QueueITTransaction } from 'src/app/domainmodel/queueittransaction';
import { Injectable } from '@angular/core';
import { UserVO } from 'src/app/domainmodel/valueobjects/userVO';

@Injectable()
export class ReportStore{
    @observable transactionsInRange: QueueITTransaction[] = [];
    //for dashboard figures and count
    @observable submittedTransactions: QueueITTransaction[] = [];
    @observable processingTransactions: QueueITTransaction[] = [];
    @observable awaitingMailTransactions: QueueITTransaction[] = [];
    @observable rejectedTransactions: QueueITTransaction[] = [];
    @observable completedTransactions: QueueITTransaction[] = [];
    @observable returnedTransactions: QueueITTransaction[] = [];

    @computed get getTransactionsInRange(){
        return this.transactionsInRange;
    }

    @computed get getSumOfTransactionsInRange(){
        var sumOfTransactions = 0;
        this.transactionsInRange.forEach(transaction => {
            if(transaction.status == "Returned"){
                sumOfTransactions += transaction.amount;
            }            
        });
        return sumOfTransactions;
    }

    @action clearTransactionsInRange(){
        this.transactionsInRange = [];
    }
    
    @action sortSubmittedTransactions(transactions: QueueITTransaction[]): QueueITTransaction[]{
        this.submittedTransactions = transactions.filter(t => t.status == "Submitted");
        return this.submittedTransactions;
    }

    @computed get getSubmittedTransactions(){
        return this.submittedTransactions.length;
    }

    @action sortTransactionsBeingProcessed(transactions: QueueITTransaction[]): QueueITTransaction[]{
        this.processingTransactions = transactions.filter(t => t.status == "Processing");
        return this.processingTransactions;
    }
    
    @computed get getTransactionsBeingProcessed(){
        return this.processingTransactions.length;
    }

    @action sortTransactionsAwaitingMail(transactions: QueueITTransaction[]): QueueITTransaction[]{
        this.awaitingMailTransactions = transactions.filter(t => t.status == "Awaiting-Mail");
        return this.awaitingMailTransactions;
    }
    
    @computed get getTransactionsAwaitingMail(){
        return this.awaitingMailTransactions.length;
    }

    @action sortRejectedTransactions(transactions: QueueITTransaction[]): QueueITTransaction[]{
        this.rejectedTransactions = transactions.filter(t => t.status == "Rejected");
        return this.rejectedTransactions;
    }
    
    @computed get getRejectedTransactions(){
        return this.rejectedTransactions.length;
    }

    @action sortCompletedTransactions(transactions: QueueITTransaction[]): QueueITTransaction[]{
        this.completedTransactions = transactions.filter(t => t.status == "Completed");
        return this.completedTransactions;
    }
    
    @computed get getCompletedTransactions(){
        return this.completedTransactions.length;
    }

    @action sortReturnedTransactions(transactions: QueueITTransaction[]): QueueITTransaction[]{
        this.returnedTransactions = transactions.filter(t => t.status == "Returned");
        return this.returnedTransactions;
    }
    
    @computed get getReturnedTransactions(){
        return this.returnedTransactions.length;
    }

    // @action sortTellerReport(transactions: QueueITTransaction[], tellers: UserVO[]): QueueITTransaction[]{
    //     transactions.forEach(transaction => {
    //         tellers.forEach(teller => {
    //             if(transaction.treatedBy.includes(teller)){
                    
    //             }
    //         })
    //     })
    // }
}