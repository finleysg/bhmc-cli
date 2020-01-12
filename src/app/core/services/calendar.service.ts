import { Calendar } from '../models/calendar';
import { CalendarEvent } from '../models/calendar-event';
import { BhmcDataService } from './bhmc-data.service';
import { Injectable } from '@angular/core';
import { Observable ,  Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CalendarService {

    private currentMonthSource: Subject<Calendar>;
    public currentMonth$: Observable<Calendar>;

    constructor(private dataService: BhmcDataService) {
        this.currentMonthSource = new Subject<Calendar>();
        this.currentMonth$ = this.currentMonthSource.asObservable();
    }

    setCalendar(year: number, month: string): void {
        const thisMonth = Calendar.getMonth(month, false); // zeroBased = false
        this.dataService.getApiRequest('events', {'year': year, 'month': thisMonth})
            .subscribe((events) => {
                const calendar = new Calendar(year, month);
                for (const event of events) {
                    calendar.addEvent(new CalendarEvent(event));
                }
                this.currentMonthSource.next(calendar);
            });
    }

    quickEvents(): Observable<CalendarEvent[]> {
        return this.dataService.getApiRequest('events/current').pipe(
            map(events => {
                return events.map((e: any) => {
                    return new CalendarEvent(e);
                });
            })
        );
    }
}
