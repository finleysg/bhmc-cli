import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { finalize } from 'rxjs/operators';

@Injectable()
export class InterceptorProgress implements HttpInterceptor {

    constructor(private loadingBar: SlimLoadingBarService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.loadingBar.color = 'blue';
        this.loadingBar.start();
        return next.handle(req).pipe(
            finalize(() => {
                this.loadingBar.color = 'green';
                this.loadingBar.complete();
            })
        );
    }
}
