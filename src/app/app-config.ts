export class AppConfig {

    private _year: number;
    private _registrationId: number;
    private _matchPlayId: number;
    private _acceptNewMembers: boolean;
    private _version: string;
    private _isLocal: boolean;
    private _stripePublicKey: string;
    private _ravenDsn: string;
    private _adminUrl: string = 'https://finleysg.pythonanywhere.com/admin';
    private _authUrl: string = 'https://finleysg.pythonanywhere.com/rest-auth/';
    private _apiUrl: string = 'https://finleysg.pythonanywhere.com/api/';
    private _stripeUrl: string = 'https://dashboard.stripe.com/test/payments';

    constructor() {
        this._isLocal = window.location.hostname.indexOf('localhost') >= 0;
        // if (this._isLocal) {
        //     this._authUrl = 'http://localhost:8000/rest-auth/';
        //     this._apiUrl = 'http://localhost:8000/api/';
        // }
    }

    get year(): number {
        return this._year;
    }

    get registrationId(): number {
        return this._registrationId;
    }

    get matchPlayId(): number {
        return this._matchPlayId;
    }

    get acceptNewMembers(): boolean {
        return this._acceptNewMembers;
    }

    get version(): string {
        return this._version;
    }

    get isLocal(): boolean {
        return this._isLocal;
    }

    get adminUrl(): string {
        return this._adminUrl;
    }

    get authUrl(): string {
        return this._authUrl;
    }

    get apiUrl(): string {
        return this._apiUrl;
    }

    get stripeUrl(): string {
        return this._stripeUrl;
    }

    get stripePublicKey(): string {
        return this._stripePublicKey;
    }

    get ravenDsn(): string {
        return this._ravenDsn;
    }

    // TODO: get remaining values from the api
    loadJson(json: any) {
        this._year = json.year;
        this._registrationId = json.reg_event;
        this._matchPlayId = json.match_play_event ? json.match_play_event : 0;
        this._acceptNewMembers = json.accept_new_members;
        this._version = (window as any).bhmcVersion;
        this._stripePublicKey = 'pk_live_IlLRf6swyzRpCntya5UM8moz';
        this._ravenDsn = 'https://9b56cf753b264c9fa9be08b86846551b@sentry.io/126710';
    }
}
