import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class InterceptorAuth implements HttpInterceptor {

    constructor() {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        let token = localStorage.getItem('bhmc_token');
        if (!token) {
            token = sessionStorage.getItem('bhmc_token');
        }
        
        const request = !token ? req.clone() : req.clone({ 
            headers: req.headers.set('Authorization', `Token ${token}`)
        });

        return next.handle(request);
    }
}
