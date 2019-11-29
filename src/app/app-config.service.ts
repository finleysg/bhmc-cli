import { Injectable } from '@angular/core';
import { AppConfig } from './app-config';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

export function ConfigLoader(configService: ConfigService) {
    return () => configService.load();
}

@Injectable()
export class ConfigService {

    config: AppConfig;

    constructor(private http: HttpClient) {
        this.config = new AppConfig();
    }

    load() { // <------
        return new Promise((resolve) => {
            this.http.get(this.config.apiUrl + 'settings/')
//                .pipe(map(res => res.json()))
                .subscribe(config => {
                    this.config.loadJson(config);
                    resolve();
                });
        });
    }
}
