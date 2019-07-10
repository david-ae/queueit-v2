import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DateRangeApiModel } from '../apimodels/daterangeapimodel';
import { GeneralService } from '../services/general.service';
import { QueueITTransaction } from 'src/app/domainmodel/queueittransaction';
import { ReportStore } from 'src/app/store/admin/reportstore';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-report',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  reportForm: FormGroup;
  displayDateFrom: string;
  displayDateTo: string;
  search: boolean;

  p: number = 1;
  collection: any[] = this.reportStore.transactionsInRange;

  constructor(private _generalService: GeneralService, public reportStore: ReportStore,
    private spinner: NgxSpinnerService) { 
    this.reportForm = new FormGroup({
      dateFrom: new FormControl('', Validators.required),
      dateTo: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    this.reportStore.clearTransactionsInRange();
  }

  retrieveReportInRange(){    
    this.spinner.show();
    this.search = false;
    let dateRange = new DateRangeApiModel();
    let dateFrom: string = this.reportForm.get("dateFrom").value;
    let dateTo: string = this.reportForm.get("dateTo").value;

    dateRange.dateFrom = dateFrom;
    dateRange.dateTo = dateTo;

    this._generalService.getTransactionsInDateRange(dateRange)
        .subscribe((data: QueueITTransaction[]) => {
          if(data){
            this.spinner.hide();
            this.search = true;
            this.reportStore.transactionsInRange = data;
            this.reportStore.sortCompletedTransactions(this.reportStore.transactionsInRange);
            this.reportStore.sortSubmittedTransactions(this.reportStore.transactionsInRange);
            this.reportStore.sortReturnedTransactions(this.reportStore.transactionsInRange);
            
            return;
          }         
        });
    this.reportStore.transactionsInRange = [];
    this.displayDateFrom = this.reportForm.get("dateFrom").value;
    this.displayDateTo = this.reportForm.get("dateTo").value;
  }
}
