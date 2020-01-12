import { Component, HostBinding } from '@angular/core';
import { LayoutService } from './core/services/layout.service';
import { setTheme } from 'ngx-bootstrap';

@Component({
  moduleId: module.id,
  // tslint:disable-next-line:component-selector
  selector: 'body',
  template: `<bhmc-layout>Loading...</bhmc-layout>`
})

export class AppComponent {

  name = 'Bunker Hills Men\'s Club';
  @HostBinding('class.sw-toggled') swToggle = false;

  constructor(private layoutService: LayoutService) {
    setTheme('bs3');
    layoutService.layoutToggle.subscribe(value => this.swToggle = value === 1);
  }
}
