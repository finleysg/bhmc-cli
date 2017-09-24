import { Pipe, PipeTransform } from '@angular/core';
import { EventDocument } from '../../../core';

@Pipe({ name: 'currentYear', pure: false })
export class ArchivePipe implements PipeTransform {
    transform(documents: EventDocument[], current: string) {
        let yearFilter = parseInt(current);
        if (documents) {
            return documents.filter(doc => doc.year === yearFilter);
        }
    }
}
