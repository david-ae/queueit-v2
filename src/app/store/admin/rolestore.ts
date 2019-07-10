import { Injectable } from '@angular/core';
import { observable, action, autorun, computed } from 'mobx'
import { Role } from '../../domainmodel/role';
import { GeneralService } from '../../admin/services/general.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class RoleStore{
    @observable roles: Role[] = [];
    @observable role: Role = new Role();

    constructor(){
        autorun(() => {

        });
    }

    @computed get getAllRoles(): Role[]{        
        return this.roles;
    }

    @action getRole(id: string){
        var role  = this.roles.find( r => r.id == id);
        if(role != null){
            return role;
        }
        return null;
    }

    @action updateRole(role: Role){
        this.roles.forEach(element => {
            if(element.id == role.id){
                element.name = role.name;
            }
        });
    }
}