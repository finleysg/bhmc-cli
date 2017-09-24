import { Component, HostBinding } from '@angular/core';
import { LayoutService } from './core/services/layout.service';

@Component({
  moduleId: module.id,
  selector: 'body',
  template: `<bhmc-layout>Loading...</bhmc-layout>`
})

export class AppComponent {

  name = 'Bunker Hills Men\'s Club';
  @HostBinding('class.sw-toggled') swToggle: boolean;

  constructor(private layoutService: LayoutService) {
    layoutService.layoutToggle.subscribe(value => this.swToggle = value === 1);
  }
}
