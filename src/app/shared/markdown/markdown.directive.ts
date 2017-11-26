import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import * as showdown from 'showdown';
// const converter = new showdown.Converter();

@Directive({ selector: '[markdown]' })
export class MarkdownDirective implements OnInit {

    @Input('markdown') source: string;
    private element: any;

    constructor(private elementRef: ElementRef) {
        this.element = elementRef.nativeElement;
     }

    ngOnInit() {
        //noinspection TypeScriptUnresolvedFunction
        let markup = new showdown.Converter().makeHtml(this.source);
        this.element.innerHTML = markup;
    }
}
