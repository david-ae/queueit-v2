import { Component, OnInit } from '@angular/core';
import { StatusFacade } from 'src/app/services/admin/statusfacade';
import { GeneralService } from '../services/general.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Status } from 'src/app/domainmodel/status';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-status',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {

  buttonName: string = "Add Status";
  statusForm: FormGroup;

  p: number = 1;
  collection: any[] = this.statusFacade.statusList;

  constructor(public statusFacade: StatusFacade, private _generalService: GeneralService,
    private spinner: NgxSpinnerService) { 
    this.statusForm = new FormGroup({
      statusname: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    this.spinner.show();
    this._generalService.getStatusList()
        .subscribe((data: Status[]) => {
          this.spinner.hide();
            this.statusFacade.statusList = data;
        },
        (err: HttpErrorResponse) => {
            console.log("Error: " + err);
        }
    );
  }

  addStatus(){
    this.spinner.show();
    let statusname = this.statusForm.get("statusname").value;
    this._generalService.addStatus(statusname)
        .subscribe((data: Status) => {
          this.spinner.hide();
            this.statusFacade.statusList = [...this.statusFacade.statusList, data];
        });
  }

  editStatus(id: string){
    this.statusFacade.status = this.statusFacade.getStatus(id);
    this.statusForm.setValue({
       statusname: this.statusFacade.status.name
    });
    this.buttonName = "Update Status";
  }

  updateStatus(){
    this.spinner.show();
    let status = new Status();
    status.id = this.statusFacade.status.id;
    status.name = this.statusForm.get("statusname").value;
    this._generalService.updateStatus(status)
      .subscribe((data: Status) => {
        this.spinner.hide();
        this.statusFacade.updateStatus(data);
      },
          (err: HttpErrorResponse) => {
              console.log("Error: " + err);
          }
      );    
      this.statusForm.reset();
    this.buttonName = "Add Status";
  }
}
