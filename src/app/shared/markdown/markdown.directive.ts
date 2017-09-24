import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { Converter } from 'showdown';

@Directive({ selector: '[markdown]' })
export class MarkdownDirective implements OnInit {

    @Input('markdown') source: string;
    private element: any;

    constructor(private elementRef: ElementRef) {
        this.element = elementRef.nativeElement;
     }

    ngOnInit() { 
        let markup = new Converter().makeHtml(this.source);
        this.element.innerHTML = markup;
    }
}