import { Component, Input, Renderer } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'download-csv',
    templateUrl: 'download-csv.component.html',
    styleUrls: ['download-csv.component.css']
})
export class DownloadCsvComponent {
    @Input() csvData: string;
    @Input() filename: string;
    private body: any;

    constructor(private renderer: Renderer) {
    }

    build(): void {
        this.body = document.body;

        let anchor = this.renderer.createElement(this.body, 'a');
        this.renderer.setElementStyle(anchor, 'visibility', 'hidden');
        this.renderer.setElementAttribute(anchor, 'href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(this.csvData));
        this.renderer.setElementAttribute(anchor, 'target', '_blank');
        this.renderer.setElementAttribute(anchor, 'download', this.filename);

        setTimeout(() => {
            this.renderer.invokeElementMethod(anchor, 'click');
            this.renderer.invokeElementMethod(anchor, 'remove');
        }, 15);
    }
}
