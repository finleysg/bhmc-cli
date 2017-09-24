import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers, URLSearchParams, RequestMethod } from '@angular/http';
import { ConfigService } from '../../../app-config.service';

export enum CheckType {
    Email = 1,
    Username = 2
}

@Injectable()
export class NewMemberDataService {

    private _apiUrl: string;

    constructor(
        private http: Http,
        private configService: ConfigService) {

        this._apiUrl = configService.config.apiUrl;
    }

    exists(value: string, valueType: CheckType): Promise<any | null> {
        let data: any = {};
        if (valueType === CheckType.Email) {
            data['e'] = value;
        } else {
            data['u'] = value;
        }
        let options = this.createOptions(RequestMethod.Get, data);
        return new Promise((resolve) => {
            return this.http.request(this._apiUrl + 'members/check/', options)
                .subscribe({
                    next: () => resolve(null),
                    error: (err) => {
                        if (err instanceof Response && err.status === 409) {
                            resolve({exists: true});
                        }
                        resolve(null)
                    }
                });

        });
    }

    private createOptions(method: RequestMethod = RequestMethod.Get, data: any = {}): RequestOptions {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({method: method, headers: headers});
        if (method === RequestMethod.Get) {
            let params = new URLSearchParams();
            for (let key in data) {
                if (data.hasOwnProperty(key)) {
                    params.set(key, data[key]);
                }
            }
            options.search = params;
        } else {
            options.body = JSON.stringify(data);
        }
        return options;
    }
}
