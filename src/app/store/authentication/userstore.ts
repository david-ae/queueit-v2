import { Injectable } from '@angular/core';
import { observable, action } from 'mobx';
import { UserVO } from 'src/app/domainmodel/valueobjects/userVO';

Injectable()
export class UserStore{
    @observable users: UserVO[] = [];
    @observable user: UserVO = new UserVO();
    
    @action accessibleRoute(role: string): string{
        if(role == "ADMINISTRATOR"){
            return 'admin';
        }
        else if(role = "SENIOR TELLER"){
            return "operations/process-transactions";
        }
        else if( role = "TELLER"){
            return "operations/process-jobs";
        }
    }
}