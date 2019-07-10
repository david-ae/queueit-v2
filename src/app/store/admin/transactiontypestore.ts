import { Injectable } from '@angular/core';
import { observable, action, computed, autorun } from 'mobx';
import { TransactionType } from '../../domainmodel/transactiontype';
import { HttpErrorResponse } from '@angular/common/http';
import { GeneralService } from '../../admin/services/general.service';

@Injectable()
export class TransactionTypeStore{
    @observable transactiontypes: TransactionType[] = [];
    @observable transactionType: TransactionType = new TransactionType();

    constructor(){
        autorun(() => {

        });
    }

    @computed get getAllTransactionTypes(): TransactionType[]{        
        return this.transactiontypes;
    }

    @action getTransactionType(id: string){
        var transactiontype = this.transactiontypes.find( s => s.id == id);
        if(transactiontype != null){
            return transactiontype;
        }
        return null;
    }

    @action updateTransactionType(transactionType: TransactionType){
        this.transactiontypes.forEach(element => {
            if(element.id == transactionType.id){
                element.name = transactionType.name;
            }
        });
    }
}