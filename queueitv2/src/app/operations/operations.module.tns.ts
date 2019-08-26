import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { ContainerComponent } from './container/container.component';
import { JobComponent } from './job/job.component';
import { CollectionsComponent } from './collections/collections.component';
import { ProcesstransactionsComponent } from './processtransactions/processtransactions.component';
import { StatusreportbarComponent } from './statusreportbar/statusreportbar.component';

@NgModule({
  declarations: [ContainerComponent, JobComponent, CollectionsComponent, ProcesstransactionsComponent, StatusreportbarComponent],
  imports: [
    NativeScriptCommonModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class OperationsModule { }
