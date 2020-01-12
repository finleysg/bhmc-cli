import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import showdown from 'showdown';

// tslint:disable-next-line: directive-selector
@Directive({ selector: '[markdown]' })
export class MarkdownDirective implements OnInit {

    @Input('markdown') source?: string;
    private element: any;

    constructor(private elementRef: ElementRef) {
        this.element = elementRef.nativeElement;
     }

    ngOnInit() {
        // tslint:disable-next-line: no-non-null-assertion
        const markup = new showdown.Converter().makeHtml(this.source!);
        this.element.innerHTML = markup;
    }
}
