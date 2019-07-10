import { Injectable } from '@angular/core';
import { observable } from 'mobx';
import { UserVO } from 'src/app/domainmodel/valueobjects/userVO';

Injectable()
export class UserStore{
    @observable users: UserVO[] = [];
    @observable user: UserVO = new UserVO();

}