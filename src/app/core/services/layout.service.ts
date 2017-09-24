import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class LayoutService {

 // private storage = localStorage;
  private _layoutToggleSource = new BehaviorSubject<number>(1);
  public layoutToggle: Observable<number> = this._layoutToggleSource.asObservable();
  private _sidebarToggleSource = new BehaviorSubject<boolean>(false);
  public sidebarToggle: Observable<boolean> = this._sidebarToggleSource.asObservable();

  constructor() {
    // this.layoutType = $localStorage['layout-type'];
    // if (!this.layoutType) this.layoutType = 1;
  }

  toggleSidebar() {
    if (this._sidebarToggleSource.getValue() === true) {
      this._sidebarToggleSource.next(false);
    } else {
      this._sidebarToggleSource.next(true);
    }
  }

  closeSidebar() {
    this._sidebarToggleSource.next(false);
  }

  get layoutType(): number {
    return this._layoutToggleSource.getValue();
  }

  updateLayout(value: number) {
    this._layoutToggleSource.next(value);
    // this.storage['layout-type'] = layoutType;
  }
}
