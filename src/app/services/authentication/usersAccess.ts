import { Injectable } from '@angular/core';
import { observable, action } from 'mobx';
import { UserVO } from 'src/app/valueobjects/userVO';

Injectable()
export class UserAccess{
    @observable users: UserVO[];
    @observable user: UserVO;

    constructor(){
        this.user = new UserVO();
        this.users = [];
    }

    isHasMoreThanOneRole(roles: string[]): boolean{
        if(roles.length > 1){
            return true;
        }
        return false;
    }

    @action isTransactionalTeller(): boolean{
        this.user.roles.forEach(role => {
            if(role == "TRANSACTIONAL TELLER"){
                return true;
            }
        });

        return false;
    }

    @action isSeniorTeller(): boolean{
        this.user.roles.forEach(role => {
            if(role == "SENIOR TELLER"){
                return true;
            }
        });

        return false;
    }

    @action isTeller(): boolean{
        this.user.roles.forEach(role => {
            if(role == "TELLER"){
                return true;
            }
        });

        return false;
    }
    
    @action accessibleRoute(role: string): string{
        if(role == "ADMIN"){
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