import {Directive, ElementRef, HostListener, Renderer} from '@angular/core';

@Directive({ selector: '[toggle-submenu]' })
export class ToggleSubmenuDirective {

  constructor(
    private _el: ElementRef,
    private _renderer: Renderer
  ) {}

  @HostListener('click') onClick() {
    let isToggled = this._el.nativeElement.parentElement.classList.contains('toggled');
    this._renderer.setElementClass(this._el.nativeElement.parentElement, 'toggled', !isToggled);
    if (isToggled) {
      this._renderer.setElementStyle(this._el.nativeElement.nextElementSibling, 'display', 'none');
    } else {
      this._renderer.setElementStyle(this._el.nativeElement.nextElementSibling, 'display', 'block');
    }
  }
}
