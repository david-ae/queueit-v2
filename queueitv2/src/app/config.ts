import { Injectable } from '@angular/core';

@Injectable()
export class Configuration{
    public ApiServer: string = "http://localhost:5000/";
    public ApiServerSSL: string = "https://localhost:5001/";
    //public ApiServer: string = "https://localhost:44397/";
    public ApiAdminUrlAccount: string = "api/administration/account/";
    public ServerAdminWithApiAccountUrl: string = this.ApiServerSSL + this.ApiAdminUrlAccount;

    public ApiAdminUrl: string = "api/administration/home/";
    public ServerAdminWithApiUrl: string = this.ApiServerSSL + this.ApiAdminUrl;

    public ApiOperationsUrl: string = "api/operations/home/";
    public ServerOperationsWithApiUrl: string = this.ApiServerSSL + this.ApiOperationsUrl;
}