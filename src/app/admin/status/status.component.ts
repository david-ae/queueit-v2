import { Component, OnInit } from '@angular/core';
import { StatusStore } from 'src/app/store/admin/statusstore';
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
  collection: any[] = this.statusStore.statusList;

  constructor(public statusStore: StatusStore, private _generalService: GeneralService,
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
            this.statusStore.statusList = data;
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
            this.statusStore.statusList = [...this.statusStore.statusList, data];
        });
  }

  editStatus(id: string){
    this.statusStore.status = this.statusStore.getStatus(id);
    this.statusForm.setValue({
       statusname: this.statusStore.status.name
    });
    this.buttonName = "Update Status";
  }

  updateStatus(){
    this.spinner.show();
    let status = new Status();
    status.id = this.statusStore.status.id;
    status.name = this.statusForm.get("statusname").value;
    this._generalService.updateStatus(status)
      .subscribe((data: Status) => {
        this.spinner.hide();
        this.statusStore.updateStatus(data);
      },
          (err: HttpErrorResponse) => {
              console.log("Error: " + err);
          }
      );    
      this.statusForm.reset();
    this.buttonName = "Add Status";
  }
}
