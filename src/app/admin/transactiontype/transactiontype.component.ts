import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { TransactionTypeFacade } from '../../services/admin/transactiontypefacade';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TransactionType } from '../../domainmodel/transactiontype';
import { GeneralService } from '../services/general.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-transactiontype',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './transactiontype.component.html',
  styleUrls: ['./transactiontype.component.css']
})
export class TransactiontypeComponent implements OnInit {

  buttonName: string = "Add TransactionType";
  transactionTypeForm: FormGroup;

  p: number = 1;
  collection: any[] = this.transactionTypeFacade.transactiontypes;

  constructor(public transactionTypeFacade: TransactionTypeFacade, private _generalService: GeneralService,
    private spinner: NgxSpinnerService) { 
    this.transactionTypeForm = new FormGroup({
      transactiontypename: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    this.spinner.show();
    this._generalService.getTransactiontypes()
            .subscribe((data: TransactionType[]) => {
              this.spinner.hide();
                this.transactionTypeFacade.transactiontypes = data;
            },
            (err: HttpErrorResponse) => {
                console.log("Error: " + err);
            }
        );
  }

  addTransactionType(name: string){
    this.spinner.show();
    this._generalService.addTransactionType(name)
        .subscribe((data: TransactionType) => {
          this.spinner.hide();
            this.transactionTypeFacade.transactiontypes = [...this.transactionTypeFacade.transactiontypes, data];
        });
  }

  editTransactionType(id: any){
    this.transactionTypeFacade.transactionType = this.transactionTypeFacade.getTransactionType(id);
    this.transactionTypeForm.setValue({
       transactiontypename: this.transactionTypeFacade.transactionType.name
    });
    this.buttonName = "Update TransactionType";
  }

  updateTransactionType(){
    this.spinner.show();
    let transactionType = new TransactionType();
    transactionType.id = this.transactionTypeFacade.transactionType.id;
    transactionType.name = this.transactionTypeForm.get("transactiontypename").value;
    this._generalService.updateTransactiontype(transactionType)
      .subscribe((data: TransactionType) => {
        this.spinner.hide();
        this.transactionTypeFacade.updateTransactionType(data);
      },
          (err: HttpErrorResponse) => {
              console.log("Error: " + err);
          }
      );    
      this.transactionTypeForm.reset();
    this.buttonName = "Add TransactionType";
  }
}
