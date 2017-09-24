import { Injectable } from '@angular/core';
import { AppConfig } from './app-config';
import { Http, Headers, RequestOptions } from '@angular/http';

export function ConfigLoader(configService: ConfigService) {
    return () => configService.load();
}

@Injectable()
export class ConfigService {

    config: AppConfig;

    constructor(private http: Http) {
        this.config = new AppConfig();
    }

    load() { // <------
        return new Promise((resolve) => {
            let headers = new Headers({'Content-Type': 'application/json'});
            let options = new RequestOptions({headers: headers});
            this.http.get(this.config.apiUrl + 'settings/', options).map(res=>res.json())
                .subscribe(config => {
                    this.config.loadJson(config);
                    resolve();
                });
        });
    };
}
