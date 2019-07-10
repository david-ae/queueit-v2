import { Injectable } from '@angular/core';
import { observable, action, autorun, computed } from 'mobx'
import { Role } from '../../domainmodel/role';
import { GeneralService } from '../../admin/services/general.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Status } from '../../domainmodel/status';

@Injectable()
export class StatusStore{
    @observable statusList: Status[] = [];
    @observable status: Status = new Status();

    constructor(){
        autorun(() => {
            
        });
    }

    @computed get getAllStatus(): Status[]{        
        return this.statusList;
    }

    @action getStatus(id: string){
        var status = this.status = this.statusList.find( s => s.id == id);
        if(status != null){
            return status;
        }
        return null;
    }

    @action updateStatus(status: Status){
        this.statusList.forEach(element => {
            if(element.id === status.id){
                element.name = status.name;
            }
        });
    }
}