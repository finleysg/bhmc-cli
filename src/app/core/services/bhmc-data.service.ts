import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../../app-config.service';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable()
export class BhmcDataService {

    private _authUrl: string ;
    private _apiUrl: string;

    private static isEmptyObject(obj: any): boolean {
        return Object.getOwnPropertyNames(obj).length === 0;
    }

    constructor(
        private http: HttpClient,
        private configService: ConfigService) {

        this._authUrl = configService.config.authUrl;
        this._apiUrl = configService.config.apiUrl;
    }

    getAuthRequest(resource: string, data?: any): Observable<any> {
        const url: string = this._authUrl + resource + '/';
        let params = new HttpParams();
        if (data && !BhmcDataService.isEmptyObject(data)) {
            for (const key in data) {
                if (data.hasOwnProperty(key) && data[key] !== null) {
                    params = params.set(key, data[key]);
                }
            }
        }
        return this.http.get(url, { params: params });
    }

    getApiRequest(resource: string, data?: any): Observable<any> {
        const url: string = this._apiUrl + resource + '/';
        let params = new HttpParams();
        if (data && !BhmcDataService.isEmptyObject(data)) {
            for (const key in data) {
                if (data.hasOwnProperty(key) && data[key] !== null) {
                    params = params.set(key, data[key]);
                }
            }
        }
        return this.http.get(url, { params: params });
    }

    postAuthRequest(resource: string, data: any): Observable<any> {
        const url: string = this._authUrl + resource + '/';
        return this.http.post(url, JSON.stringify(data), {
            headers: new HttpHeaders().set('Content-Type', 'application/json')
        });
    }

    postApiRequest(resource: string, data: any): Observable<any> {
        const url: string = this._apiUrl + resource + '/';
        return this.http.post(url, JSON.stringify(data), {
            headers: new HttpHeaders().set('Content-Type', 'application/json')
        });
    }

    putApiRequest(resource: string, data: any): Observable<any> {
        const url: string = this._apiUrl + resource + '/';
        return this.http.put(url, JSON.stringify(data), {
            headers: new HttpHeaders().set('Content-Type', 'application/json')
        });
    }

    patchApiRequest(resource: string, data: any): Observable<any> {
        const url: string = this._apiUrl + resource + '/';
        return this.http.patch(url, JSON.stringify(data), {
            headers: new HttpHeaders().set('Content-Type', 'application/json')
        });
    }

    patchAuthRequest(resource: string, data: any): Observable<any> {
        const url: string = this._authUrl + resource + '/';
        return this.http.patch(url, JSON.stringify(data), {
            headers: new HttpHeaders().set('Content-Type', 'application/json')
        });
    }

    postForm(resource: string, data: FormData): Observable<any> {
        const url: string = this._apiUrl + resource + '/';
        return this.http.post(url, data);
    }

    patchForm(resource: string, data: FormData): Observable<any> {
        const url: string = this._apiUrl + resource + '/';
        return this.http.patch(url, data);
    }

  // temp for Aimee

// beg(): void {
//     this.http.post('human', {'eyes': 'hopeful', 'sitting-pretty': true})
//         .subscribe(
//             (snack) => this.eat(snack),
//             (err) => this.dismissError(err, { resumeBegging: true })
//         );
// }

//   eat(snack: any) {}
//   dismissError(err: any, foo: any) {}
//   resumeBegging() {}
}
