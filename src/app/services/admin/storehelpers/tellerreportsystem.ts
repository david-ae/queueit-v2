import { TellerTransactionItem } from './tellertransactionitem';
import { TellerTransactionActivity } from '../displaymodels/telleractivitybreakdown';

export class TellerReportSystem {
   Tellers: TellerTransactionItem[];
   NumberOfItems: number;
   Total:number;

   constructor(){
       this.Tellers = [];
       this.NumberOfItems = 0;
       this.Total = 0;
   }

   IsExistingInReport(tellerId: string): boolean{
        this.Tellers.forEach(teller => {
            if(teller.getTellerId() == tellerId){
                return true;
            }
        });

        return false;
   }

   addItem(activity: TellerTransactionActivity){
       let newItem:boolean = true;

       for(var i = 0; i < this.Tellers.length; i++){
           if(this.Tellers[i].activity.tellerId === activity.tellerId){
               newItem = false;
               this.Tellers[i].incrementCount();
           }
       }

       if(newItem){
          let teller = new TellerTransactionItem(activity);
          this.Tellers.push(teller);
       }
   }

    addItemWithQuantity(activity: TellerTransactionActivity, amount: number){
       let newItem:boolean = true;

       for(var i = 0; i < this.Tellers.length; i++){
           if(this.Tellers[i].activity.tellerId === activity.tellerId){
               newItem = false;
               //count += this.Tellers[i].getCount();
               //this.Tellers[i].setCount(count);
               this.Tellers[i].incrementCount();
               this.Tellers[i].incrementAmountProcessed(amount);
           }
       }

       if(newItem){
          let teller = new TellerTransactionItem(activity);
          //teller.setCount(count);
          teller.incrementCount();
          teller.incrementAmountProcessed(amount);
          this.Tellers.push(teller);
       }
   }

   update(activity: TellerTransactionActivity, count:number){
      // qty = -1;
       if(count >= 0){
           let teller: TellerTransactionItem = null;
                       
           for(var i = 0; i < this.Tellers.length; i++){
               if(this.Tellers[i].activity.tellerId === activity.tellerId){
                   if(count !== 0){
                       this.Tellers[i].setCount(count);
                   }
                   else{
                       teller = this.Tellers[i];
                       break;
                   }
               }
           }

           if(teller !== null){
               this.Tellers.splice(i, 1);
           }
       }
   }

   getItems(): Array<TellerTransactionItem>{
       return this.Tellers;
   }

   getNumberOfItems(): number{
       this.NumberOfItems = 0;

       for(var i = 0; i < this.Tellers.length; i++){
           this.NumberOfItems += this.Tellers[i].getCount();
       }

       return this.NumberOfItems;
   }

   getTotal(){
       return this.Total;
   }

   clear(){
       this.Tellers = [];
       this.NumberOfItems = 0;
       this.Total = 0;
   }
}