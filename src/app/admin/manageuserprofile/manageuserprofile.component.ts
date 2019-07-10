import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GeneralService } from '../services/general.service';
import { UserStore } from 'src/app/store/admin/userstore';
import { UserVO } from 'src/app/domainmodel/valueobjects/userVO';
import { ManageUserApiModel } from '../apimodels/manageuserapimodel';
import { HttpErrorResponse } from '@angular/common/http';
import { RoleStore } from 'src/app/store/admin/rolestore';
import { Role } from 'src/app/domainmodel/role';
import { AlertService } from 'src/app/shared/_services';

@Component({
  selector: 'app-manageuserprofile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './manageuserprofile.component.html',
  styleUrls: ['./manageuserprofile.component.css']
})
export class ManageuserprofileComponent implements OnInit {  
  
  buttonName: string = "Add New User";
  manageUserForm: FormGroup;
  isLoading: boolean = true;

  constructor(private _generalService: GeneralService, public userStore: UserStore,
     public roleStore: RoleStore, public alertService: AlertService) { 
    this.manageUserForm = new FormGroup({
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      id: new FormControl(''),
      isactive: new FormControl('')
    });
  }

  ngOnInit() {
    this.alertService.success("Works");
    this._generalService.getUsers()
        .subscribe((data: UserVO[]) => {
          this.userStore.users = data;
        });
      this._generalService.getRoles()
        .subscribe((data: Role[]) => {
            this.roleStore.roles = data;
        },
        (err: HttpErrorResponse) => {
            console.log("Error: " + err);
        }
    );
  }

  addUser(){
    //this.toastr.success('Hello world!', 'Toastr fun!');
    let model = new ManageUserApiModel();
    model.firstname = this.manageUserForm.get("firstname").value;
    model.lastname = this.manageUserForm.get("lastname").value;
    model.email = this.manageUserForm.get("email").value;
    model.isactive = this.manageUserForm.get("isactive").value;

    this._generalService.register(model)
        .subscribe((data) => {
          if(data){
            this.userStore.user.identity = data.id;
            this.userStore.user.email = data.email;
            this.userStore.user.firstname = data.firstname;
            this.userStore.user.lastname = data.lastname;
            this.userStore.user.isActive = data.isactive;
            this.userStore.users.push(this.userStore.user);

            this.alertService.success(this.userStore.user.firstname + " " + this.userStore.user.lastname + " was successfully registered.")
          }  
        },
        (err: HttpErrorResponse) => {
          console.log("Error: " + err);
          this.alertService.error("Registration Failed. Please try again.");
        }
      );
  }

  editUser(id: any){
    this.userStore.user = this.userStore.getUser(id);
    this.manageUserForm.setValue({
       firstname: this.userStore.user.firstname,
       lastname: this.userStore.user.lastname,
       email: this.userStore.user.email,
       id: this.userStore.user.identity,
       isactive: this.userStore.user.isActive
    });
    this.buttonName = "Update User";
  }

  deactivateUser(id: string){
    this._generalService.deactivateUser(id)
        .subscribe(() => {          
          let user = this.userStore.getUser(id);
          this.userStore.updateUser(user);                    
          this.userStore.error = "works";
          this.alertService.success(this.userStore.error);
        },
        (err: HttpErrorResponse) => {
          console.log("Error: " + err);
          this.alertService.error("Deactivation Failed. Please try again!")          
      });
  }

  reactivateUser(id: any){
    //this.alertService.success("works");
    this._generalService.reactivateUser(id)
        .subscribe(() => {
          this.alertService.success("User Successfully Reactivated");
          let user = this.userStore.getUser(id);
          this.userStore.updateUser(user);
        },
        (err: HttpErrorResponse) => {
          console.log("Error: " + err);
          this.alertService.error("Reactivation Failed. Please try again!")          
      });
  }

  updateUser(){

    let model = new ManageUserApiModel();

    model.firstname = this.manageUserForm.get("firstname").value;
    model.lastname = this.manageUserForm.get("lastname").value;
    model.email = this.manageUserForm.get("email").value;
    model.id = this.manageUserForm.get("id").value;
    this._generalService.updateUser(model)
        .subscribe(()=> {
          this.userStore.updateUser(this.userStore.user);
        },
        (err: HttpErrorResponse) => {
          console.log("Error: " + err);
          this.alertService.error("User Details Update Failed. Please try again.");
        }
      );

    this.manageUserForm.reset();
    this.buttonName = "Add New User";
  }
}
