import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserStore } from 'src/app/store/authentication/userstore';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../services/auth.service';
import { Accounts } from 'src/app/domainmodel/valueobjects/accountvo';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertService } from 'src/app/shared/_services';

@Component({
  selector: 'app-getnewuserprofile',
  templateUrl: './getnewuserprofile.component.html',
  styleUrls: ['./getnewuserprofile.component.css']
})
export class GetnewuserprofileComponent implements OnInit {

  getNewUserProfileForm: FormGroup;
  isNotNull: boolean = false;

  constructor(public userStore: UserStore, private spinner: NgxSpinnerService,
    private authService: AuthService, public alertService: AlertService) { 
    this.getNewUserProfileForm = new FormGroup({
      email: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
  }

  getNewUserProfile(){
    this.spinner.show();
    this.authService.getNewUserProfile(this.userStore.user.email)
        .subscribe((data) => {
          this.spinner.hide();
          this.userStore.user.identity = data.id;
          this.userStore.user.email = data.email;
          this.userStore.user.firstname = data.firstname;
          this.userStore.user.lastname = data.lastname;
          this.userStore.user.roles = data.roles;
          this.alertService.success("Yes! You now have a new profile. You can signin now.")
        },
        (err: HttpErrorResponse) => {
          console.log("Error: " + err);
          this.alertService.error("Something went wrong. Please contact the IT Department.");
      });
  }

  getUserDetails(){
    this.spinner.show();
    let email = this.getNewUserProfileForm.get("email").value;
    this.authService.getUserOldAccount(email)
        .subscribe((data: Accounts) => {
          this.spinner.hide();
          this.userStore.user.firstname = data.firstname;
          this.userStore.user.lastname = data.lastname;
          this.userStore.user.legacyId = data.identity;
          this.userStore.user.email = data.username;
          this.userStore.user.roles = data.roles;
          this.getNewUserProfileForm.setValue({
            email: this.userStore.user.email
          });
      },
      (err: HttpErrorResponse) => {
        console.log("Error: " + err);
        this.alertService.error("We can't find your account. Please contact IT Department.");
      });
  }

}
