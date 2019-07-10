import { Injectable } from '@angular/core';

@Injectable()
export class Configuration{
    public ApiServer: string = "http://localhost:5000/";
    public ApiServerSSL: string = "http://localhost:5001/";
    //public ApiServer: string = "https://localhost:44397/";
    public ApiAdminUrlAccount: string = "api/administration/account/";
    public ServerAdminWithApiAccountUrl: string = this.ApiServer + this.ApiAdminUrlAccount;

    public ApiAdminUrl: string = "api/administration/home/";
    public ServerAdminWithApiUrl: string = this.ApiServer + this.ApiAdminUrl;

    public ApiOperationsUrl: string = "api/operations/home/";
    public ServerOperationsWithApiUrl: string = this.ApiServer + this.ApiOperationsUrl;
}