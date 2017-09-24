import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers, URLSearchParams, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Cookie } from 'ng2-cookies';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { BhmcErrorHandler } from './bhmc-error-handler.service';
import { ConfigService } from '../../app-config.service';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class BhmcDataService {

    private errorSource: Subject<string>;
    public lastError$: Observable<string>;

    private _authUrl: string ;
    private _apiUrl: string;

    constructor(
        private http: Http,
        private loadingBar: SlimLoadingBarService,
        private errorHandler: BhmcErrorHandler,
        private configService: ConfigService) {

        this._authUrl = configService.config.authUrl;
        this._apiUrl = configService.config.apiUrl;
        this.errorSource = new Subject();
        this.lastError$ = this.errorSource.asObservable();
    }

    getAuthRequest(resource: string, data?: any): Observable<any> {
        const url: string = this._authUrl + resource + '/';
        return this.request(RequestMethod.Get, url, data);
    }

    getApiRequest(resource: string, data?: any): Observable<any> {
        const url: string = this._apiUrl + resource + '/';
        return this.request(RequestMethod.Get, url, data);
    }

    postAuthRequest(resource: string, data: any): Observable<any> {
        const url: string = this._authUrl + resource + '/';
        return this.request(RequestMethod.Post, url, data);
    }

    postApiRequest(resource: string, data: any): Observable<any> {
        const url: string = this._apiUrl + resource + '/';
        return this.request(RequestMethod.Post, url, data);
    }

    patchApiRequest(resource: string, data: any): Observable<any> {
        const url: string = this._apiUrl + resource + '/';
        return this.request(RequestMethod.Patch, url, data);
    }

    patchAuthRequest(resource: string, data: any): Observable<any> {
        const url: string = this._authUrl + resource + '/';
        return this.request(RequestMethod.Patch, url, data);
    }

    request(method: RequestMethod, url: string, data?: any) {
        this.loadingBar.color = 'blue';
        this.loadingBar.start();
        let options = this.createOptions(method, data);
        return this.http.request(url, options)
            .map((response: Response) => {
                this.loadingBar.color = 'green';
                this.loadingBar.complete();
                try {
                    return response.json() || {};
                } catch(e) {
                    return {};
                }
            })
            .catch((err: any) => this.handleError(err));
    }

    private createHeaders(contentType: string): Headers {
        let headers = new Headers({'Content-Type': contentType});
        let token = localStorage.getItem('bhmc_token');
        if (!token) {
            token = sessionStorage.getItem('bhmc_token');
        }
        if (token) {
            headers.append('Authorization', 'Token ' + token);
        }
        // This cookie is added to responses by Django
        let csrf = Cookie.get('csrftoken');
        if (csrf) {
            headers.append('X-CSRFToken', csrf);
        }
        return headers;
    }

    private createOptions(method: RequestMethod = RequestMethod.Get, data: any = {}): RequestOptions {
        let headers = this.createHeaders('application/json');
        if (data instanceof FormData) {
            headers.delete('Content-Type');
        }
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
            if (data instanceof FormData) {
                options.body = data;
            } else {
                options.body = JSON.stringify(data);
            }
        }
        return options;
    }

    private handleError(error: Response | any) {
        this.loadingBar.color = 'red';
        this.loadingBar.complete();

        let message: string;
        if (error instanceof Response) {
            if (error.status === 0) {
                message = `Could not reach the bhmc server because your internet connection 
                           was lost, the connection timed out, or the server is not responding.`;
            } else {
                const body = error.json() || {};
                if (body.non_field_errors) {
                    // django-rest-auth
                    message = body.non_field_errors[0];
                } else if (body.username) {
                    // django-rest-auth
                    message = body.username[0];
                } else if (body.detail) {
                    // django-rest-framework
                    message = body.detail;
                } else {
                    message = JSON.stringify(body);
                }
            }
            this.errorHandler.logResponse(message, error);
        } else {
            this.errorHandler.logError(error);
            message = error.message ? error.message : error.toString();
        }

        this.errorSource.next(message);
        return Observable.throw(message);
    }
}
