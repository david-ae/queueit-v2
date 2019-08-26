import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { ContainerComponent } from './container/container.component';
import { LoginComponent } from './login/login.component';
import { GetnewuserprofileComponent } from './getnewuserprofile/getnewuserprofile.component';

@NgModule({
  declarations: [ContainerComponent, LoginComponent, GetnewuserprofileComponent],
  imports: [
    NativeScriptCommonModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AuthenticationModule { }
