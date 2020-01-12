import { Injectable } from '@angular/core';
import { Observable ,  BehaviorSubject } from 'rxjs';

@Injectable()
export class SpinnerService {
    private spinners: Map<string, Observable<boolean>>;
    private sources: Map<string, BehaviorSubject<boolean>>;

    constructor() {
        this.spinners = new Map<string, Observable<boolean>>();
        this.sources = new Map<string, BehaviorSubject<boolean>>();
    }

    private getSpinnerSource(name: string): BehaviorSubject<boolean> | undefined {
        if (this.sources.has(name)) {
            return this.sources.get(name);
        }
        const subject = new BehaviorSubject(false);
        this.sources.set(name, subject);
        this.spinners.set(name, subject.asObservable());
        return this.sources.get(name);
    }

    getSpinner(name: string): any {
        if (this.spinners.has(name)) {
            return this.spinners.get(name);
        }
        const subject = new BehaviorSubject(false);
        this.sources.set(name, subject);
        this.spinners.set(name, subject.asObservable());
        return this.spinners.get(name);
    }

    show(name: string) {
        const source = this.getSpinnerSource(name);
        if (source) {
            source.next(true);
        }
    }

    hide(name: string) {
        const source = this.getSpinnerSource(name);
        if (source) {
            source.next(false);
        }
    }

    remove(name: string) {
        if (this.spinners.has(name)) {
            this.spinners.delete(name);
            this.sources.delete(name);
        }
    }
}
