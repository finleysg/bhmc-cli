export class AppConfig {

    private _year = 0;
    private _registrationId = 0;
    private _matchPlayId = 0;
    private _acceptNewMembers = false;
    private _version = '';
    private _isLocal: boolean;
    private _stripePublicKey = '';
    private _ravenDsn = '';
    private _adminUrl = 'https://finleysg.pythonanywhere.com/admin';
    private _wikiUrl = 'https://finleysg.pythonanywhere.com/wiki';
    private _authUrl = 'https://finleysg.pythonanywhere.com/rest-auth/';
    private _apiUrl = 'https://finleysg.pythonanywhere.com/api/';
    private _stripeUrl = 'https://dashboard.stripe.com/test/payments';

    constructor() {
        this._isLocal = true; // window.location.hostname.indexOf('localhost') >= 0;
        if (this._isLocal) {
            this._authUrl = 'http://localhost:8000/rest-auth/';
            this._apiUrl = 'http://localhost:8000/api/';
        }
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

    get wikiUrl(): string {
        return this._wikiUrl;
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

    loadJson(json: any) {
        this._year = json.year;
        this._registrationId = json.reg_event;
        this._matchPlayId = json.match_play_event ? json.match_play_event : 0;
        this._acceptNewMembers = json.accept_new_members;
        this._version = (window as any).bhmcVersion;
        this._stripePublicKey = json.stripe_pk;
        this._ravenDsn = json.raven_dsn;
    }
}
