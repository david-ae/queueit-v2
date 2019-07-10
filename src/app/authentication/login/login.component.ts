import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { TransactionStore } from 'src/app/store/operations/transaction';
import { OperationsService } from 'src/app/operations/services/operations.service';
import { QueueITTransaction } from 'src/app/domainmodel/queueittransaction';
import { AuthService } from '../services/auth.service';
import { UserLoginApiModel } from '../apimodels/userloginapimodel';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { UserStore } from 'src/app/store/authentication/userstore';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/shared/_services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private _hubConnection: HubConnection;
  loginForm: FormGroup;
  isRequesting: boolean;
  
  constructor(private _router: Router, private _operationsService: OperationsService, 
    public transactionStore: TransactionStore, private _authService: AuthService,
    public userStore: UserStore, private spinner: NgxSpinnerService, public alertService: AlertService) { 
      this.loginForm = new FormGroup({
        username: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required)
      });
    }
  
  ngOnInit() {       
  }

  async login(){
    this.alertService.success('hjgjgj');
    // this.spinner.show();
    // let model = new UserLoginApiModel();
    // model.username = this.loginForm.get('username').value;
    // model.password = this.loginForm.get('password').value;

    // await this._authService.login(model)
    //       .subscribe((data) => {
    //         if(data){
    //           this.spinner.hide();
    //           this.userStore.user.identity = data.id;
    //           this.userStore.user.email = data.email;
    //           this.userStore.user.firstname = data.firstname;
    //           this.userStore.user.lastname = data.lastname;
    //           this.userStore.user.roles = data.roles;
    //           this._authService.setSession(data);
    //           /**use the user role to determine
    //            * what page to navigate to
    //            */
    //           if(this.userStore.user.roles.includes("ADMINISTRATOR")){
    //             this._router.navigate(['admin']);
    //           }
    //           else if(this.userStore.user.roles.includes("SENIOR TELLER")){
    //             this._router.navigate(["operations/process-transactions"]);
    //           }
    //           else if(this.userStore.user.roles.includes("TELLER")){
    //             this._router.navigate(["operations/process-jobs"]);
    //           }
    //         }
    //       })
    
    // this._operationsService.getTodaysTransactions()
    // .subscribe((data: QueueITTransaction[]) => {
      
    // });
    
  }

}
