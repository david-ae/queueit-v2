import { observable, computed, action } from 'mobx';
import { QueueITTransaction } from 'src/app/domainmodel/queueittransaction';
import { Injectable } from '@angular/core';
import { UserVO } from 'src/app/valueobjects/userVO';
import { TellerTransactionActivity } from './displaymodels/telleractivitybreakdown';
import { TellerReportSystem } from './storehelpers/tellerreportsystem';
import { TellerTransactionItem } from './storehelpers/tellertransactionitem';

@Injectable()
export class ReportFacade{

    //#region "containers for data"
    @observable transactionsInRange: QueueITTransaction[];
    //for dashboard figures and count
    @observable submittedTransactions: QueueITTransaction[];
    @observable processingTransactions: QueueITTransaction[];
    @observable awaitingMailTransactions: QueueITTransaction[];
    @observable rejectedTransactions: QueueITTransaction[];
    @observable completedTransactions: QueueITTransaction[];
    @observable returnedTransactions: QueueITTransaction[];

    //for report summary
    @observable summarySubmittedTransactions: QueueITTransaction[];
    @observable summaryCompletedTransactions: QueueITTransaction[];
    @observable summaryReturnedTransactions: QueueITTransaction[];
    //#endregion

    //#region "teller report system"
    @observable reportSystem: TellerReportSystem;
    @observable transactionStatus: string;
    //#endregion

    constructor(){
        this.transactionsInRange = [];
        this.submittedTransactions = [];
        this.processingTransactions = [];
        this.awaitingMailTransactions = [];
        this.rejectedTransactions = [];
        this.completedTransactions = [];
        this.returnedTransactions = [];
        this.summaryCompletedTransactions = [];
        this.summaryReturnedTransactions = [];
        this.summarySubmittedTransactions = [];

        this.reportSystem = new TellerReportSystem();
    }
    //#region Today Dashboard Snapshot Setup

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

    @action sortSummaryOfSubmittedTransactions(transactions: QueueITTransaction[]): QueueITTransaction[]{
        this.summarySubmittedTransactions = transactions.filter(t => t.status == "Submitted");
        return this.summarySubmittedTransactions;
    }

    @computed get getSummaryOfSubmittedTransactions(){
        return this.summarySubmittedTransactions.length;
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

    @action sortSummaryOfCompletedTransactions(transactions: QueueITTransaction[]): QueueITTransaction[]{
        this.summaryCompletedTransactions = transactions.filter(t => t.status == "Completed");
        return this.summaryCompletedTransactions;
    }
    
    @computed get getSummaryOfCompletedTransactions(){
        return this.summaryCompletedTransactions.length;
    }

    @action sortReturnedTransactions(transactions: QueueITTransaction[]): QueueITTransaction[]{
        this.returnedTransactions = transactions.filter(t => t.status == "Returned");
        return this.returnedTransactions;
    }
    
    @computed get getReturnedTransactions(){
        return this.returnedTransactions.length;
    }

    @action sortSummaryOfReturnedTransactions(transactions: QueueITTransaction[]): QueueITTransaction[]{
        this.summaryReturnedTransactions = transactions.filter(t => t.status == "Returned");
        return this.summaryReturnedTransactions;
    }
    
    @computed get getSummaryOfReturnedTransactions(){
        return this.summaryReturnedTransactions.length;
    }

    //#endregion

    //#region Teller Transaction Activity Breakdown    

    @computed get getTellerTransactionActivityReport(){
        return this.reportSystem.Tellers;
    }

    @action tellerTransactionsActivityBreakdown(tellers: UserVO[], typeOfTransactions: QueueITTransaction[]){
        tellers.forEach(teller => {
            typeOfTransactions.forEach(transaction => {
                if(teller.userType == "Legacy"){
                    if(teller.legacyId == transaction.createdBy.legacyId){
                        this.legacyTellerTransactionsActivityBreakdown(tellers, typeOfTransactions);
                    }
                    else{
                        this.v2NewTellerTransactionBreakdown(tellers, typeOfTransactions);
                    }
                }
            });
        });
    }

    v2NewTellerTransactionBreakdown(tellers: UserVO[], typeOfTransactions: QueueITTransaction[]){
        tellers.forEach(teller => {
            typeOfTransactions.forEach(transaction => {
                if(teller.identity == transaction.createdBy.identity){
                    if(transaction.completedBy != null && transaction.treatedBy.length == 0){                            
                        let activity = new TellerTransactionActivity();
                        activity.tellerId = teller.identity;
                        activity.tellerFullName = transaction.createdBy.firstname + " " + transaction.createdBy.lastname;
                        activity.status = transaction.status;
                        this.transactionStatus = transaction.status;
                        if(this.reportSystem.IsExistingInReport(teller.identity)){
                            this.reportSystem.addItemWithQuantity(activity, transaction.amount);
                        }
                        else if(this.reportSystem.Tellers.length == 0){
                            this.reportSystem.addItem(activity);
                        }
                    }
                }
            });
        });
    }

    legacyTellerTransactionsActivityBreakdown(tellers: UserVO[], typeOfTransactions: QueueITTransaction[]){
        tellers.forEach(teller => {
            typeOfTransactions.forEach(transaction => {
                if(teller.userType == "Legacy"){
                    if(teller.legacyId == transaction.createdBy.legacyId){
                        if(transaction.completedBy != null && transaction.treatedBy.length == 0){                            
                            let activity = new TellerTransactionActivity();
                            activity.tellerId = teller.legacyId;
                            activity.tellerFullName = transaction.createdBy.firstname + " " + transaction.createdBy.lastname;
                            activity.status = transaction.status;
                            if(this.reportSystem.IsExistingInReport(teller.legacyId)){
                                this.reportSystem.addItemWithQuantity(activity, transaction.amount);
                            }
                            else if(this.reportSystem.Tellers.length == 0){
                                this.reportSystem.addItem(activity);
                            }
                        }
                    }
                }
            });
        });
    }

    //#endregion

    // @action sortTellerReport(transactions: QueueITTransaction[], tellers: UserVO[]): QueueITTransaction[]{
    //     transactions.forEach(transaction => {
    //         tellers.forEach(teller => {
    //             if(transaction.treatedBy.includes(teller)){
                    
    //             }
    //         })
    //     })
    // }
}