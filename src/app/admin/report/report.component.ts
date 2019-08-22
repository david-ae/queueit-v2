import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DateRangeApiModel } from '../apimodels/daterangeapimodel';
import { GeneralService } from '../services/general.service';
import { QueueITTransaction } from 'src/app/domainmodel/queueittransaction';
import { ReportFacade } from 'src/app/services/admin/reportsfacade';
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
  collection: any[] = this.reportFacade.transactionsInRange;

  constructor(private _generalService: GeneralService, public reportFacade: ReportFacade,
    private spinner: NgxSpinnerService) { 
    this.reportForm = new FormGroup({
      dateFrom: new FormControl('', Validators.required),
      dateTo: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    this.reportFacade.clearTransactionsInRange();
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
            this.reportFacade.transactionsInRange = data;
            this.reportFacade.sortCompletedTransactions(this.reportFacade.transactionsInRange);
            this.reportFacade.sortSubmittedTransactions(this.reportFacade.transactionsInRange);
            this.reportFacade.sortReturnedTransactions(this.reportFacade.transactionsInRange);
            
            return;
          }         
        });
    this.reportFacade.transactionsInRange = [];
    this.displayDateFrom = this.reportForm.get("dateFrom").value;
    this.displayDateTo = this.reportForm.get("dateTo").value;
  }
}
