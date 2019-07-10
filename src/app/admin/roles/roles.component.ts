import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { GeneralService } from '../services/general.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Role } from 'src/app/domainmodel/role';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RoleStore } from 'src/app/store/admin/rolestore';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/shared/_services';

@Component({
  selector: 'app-roles',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  buttonName: string = "Add Role";
  roleForm: FormGroup;

  p: number = 1;
  collection: any[] = this.roleStore.roles;

  constructor(public roleStore: RoleStore, private _generalService: GeneralService,
    private spinner: NgxSpinnerService, public alertService: AlertService) { 
    this.roleForm = new FormGroup({
      rolename: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    this.spinner.show();
    this._generalService.getRoles()
          .subscribe((data: Role[]) => {
            this.spinner.hide();
              this.roleStore.roles = data;              
          },
          (err: HttpErrorResponse) => {
              console.log("Error: " + err);
          }
      );
  }

  addRole(name: string){
  //  this.spinner.show();
  
    this._generalService.addRole(name)
    .subscribe((data: Role) => {
      this.spinner.hide();
      this.alertService.success(name.toUpperCase() + " Successfully Added as a Role.")
        this.roleStore.roles = [...this.roleStore.roles, data];
    },
    (err: HttpErrorResponse) => {
      // this.spinner.hide();
      console.log("Error: " + err);
      this.alertService.error("New Role Addition Failed.");
    });
  }

  editRole(id: any){
    this.roleStore.role = this.roleStore.getRole(id);
    this.roleForm.setValue({
       rolename: this.roleStore.role.name
    });
    this.buttonName = "Update Role";
  }

  updateRole(){
    this.spinner.show();
    let role = new Role();
    role.id = this.roleStore.role.id;
    role.name = this.roleForm.get("rolename").value;

    this._generalService.updateRole(role)
      .subscribe(() => {
        this.spinner.hide();
        this.roleStore.updateRole(role);
        this.alertService.success("Role Update Successful");
      },
          (err: HttpErrorResponse) => {
            this.spinner.hide();
              console.log("Error: " + err);
              this.alertService.error("Role Update Failed. Please try")
          }
      );
      this.roleForm.reset();
    this.buttonName = "Add Role";
  }

}
