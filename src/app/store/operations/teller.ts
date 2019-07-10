import { observable, computed, action } from 'mobx';
import { UserVO } from 'src/app/domainmodel/valueobjects/userVO';
import { Injectable } from '@angular/core';
import { Accounts } from 'src/app/domainmodel/valueobjects/accountvo';

@Injectable()
export class TellerStore{
    @observable seniortellers: Accounts[] = [];
    @observable tellers: Accounts[] = [];
    @observable teller: Accounts = new Accounts();
    @observable tellersUserVO: UserVO[] = [];

    constructor(){}

    @computed get getTellerList(){
        return this.tellers;
    }

    @computed get getSeniorTellerList(){
        return this.seniortellers;
    }
    
    @action getTellerById(id: string){
        var teller = this.tellers.find(t => t.identity == id);
        if(teller != null){
            return teller;
        }
        return null
    }

    @computed get getAccountsUserVOEquivalent(){
        return this.tellersUserVO;
    }

    @action turnAccountsToUserVO(accounts: Accounts[]){
        accounts.forEach(account => {
            var userVo = new UserVO();
            userVo.email = account.username;
            userVo.firstname = account.firstname;
            userVo.lastname = account.lastname;
            userVo.roles = account.roles;
            userVo.identity = account.identity;
            this.tellersUserVO.push(userVo);
        });        
    }
}