import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserStore } from 'src/app/store/authentication/userstore';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-getnewuserprofile',
  templateUrl: './getnewuserprofile.component.html',
  styleUrls: ['./getnewuserprofile.component.css']
})
export class GetnewuserprofileComponent implements OnInit {

  getNewUserProfileForm: FormGroup;
  isNotNull: boolean = false;

  constructor(public userStore: UserStore, private spinner: NgxSpinnerService) { 
    this.getNewUserProfileForm = new FormGroup({
      email: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
  }

  getNewUserProfile(){

  }

}
