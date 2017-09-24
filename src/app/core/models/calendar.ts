import { CalendarEvent } from './calendar-event';
declare const moment: any;

export class Day {
    name: string;
    shortName: string;
    day: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    date: any;
    events: CalendarEvent[];

    constructor (date: any, currentMonth: any) {
        this.name = date.format('dddd');
        this.shortName = date.format('ddd');
        this.day = parseInt(date.format('D'), 10);
        this.isCurrentMonth = date.month() === currentMonth.month();
        this.isToday = date.isSame(new Date(), 'day');
        this.date = date;
        this.events = [];
    }

    hasEvents = () => {
        return this.events && this.events.length > 0;
    }
}

export class Calendar {

    private weeks: any[];
    private firstDay: any;

    constructor (year: number, monthName: string) {
        const monthNumber = Calendar.getMonth(monthName);
        this.firstDay = moment([year, monthNumber, 1])
        const sunday = this.findSunday(monthNumber, year);
        this.weeks = this.buildMonth(sunday, this.firstDay);
    }

    private findSunday(month: number, year: number) {
        let start = moment([year, month, 1]),
            dow = start.day();
        while (dow > 0) {
            start.add(-1, 'd');
            dow = start.day();
        }
        return start;
    }

    private buildMonth(start: any, currentMonth: any) {
        let weeks: any[] = [];
        let done = false, date = start.clone(), monthIndex = date.month(), count = 0;
        while (!done) {
            weeks.push({ days: this.buildWeek(date.clone(), currentMonth) });
            date.add(1, 'w');
            done = count++ > 2 && monthIndex !== date.month();
            monthIndex = date.month();
        }
        return weeks;
    }

    private buildWeek(date: any, month: any) {
        let days: Day[] = [];
        for (var i = 0; i < 7; i++) {
            days.push(new Day(date, month));
            date = date.clone();
            date.add(1, 'd');
        }
        return days;
    }

    static getMonth(name: string, zeroBased: boolean = true): number {
        let m = 0;
        switch(name.toLowerCase()) {
            case "january":
            case "jan":
                m = 0;
                break;
            case "february":
            case "feb":
                m = 1;
                break;
            case "march":
            case "mar":
                m = 2;
                break;
            case "april":
            case "apr":
                m = 3;
                break;
            case "may":
            case "may":
                m = 4;
                break;
            case "june":
            case "jun":
                m = 5;
                break;
            case "july":
            case "jul":
                m = 6;
                break;
            case "august":
            case "aug":
                m = 7;
                break;
            case "september":
            case "sep":
                m = 8;
                break;
            case "october":
            case "oct":
                m = 9;
                break;
            case "november":
            case "nov":
                m = 10;
                break;
            case "december":
            case "dec":
                m = 11;
                break;
        }
        if (!zeroBased) {
            m += 1;
        }
        return m;
    }

    static getMonthName(nbr: number, zeroBased: boolean = true): string {
        let name = 'Invalid';
        if (!zeroBased) {
            nbr -= 1;
        }
        switch(nbr) {
            case 0:
                name = 'January';
                break;
            case 1:
                name = 'February';
                break;
            case 2:
                name = 'March';
                break;
            case 3:
                name = 'April';
                break;
            case 4:
                name = 'May';
                break;
            case 5:
                name = 'June';
                break;
            case 6:
                name = 'July';
                break;
            case 7:
                name = 'August';
                break;
            case 8:
                name = 'September';
                break;
            case 9:
                name = 'October';
                break;
            case 10:
                name = 'November';
                break;
            case 11:
                name = 'December';
                break;
        }
        return name;
    }

    addEvent(event: CalendarEvent): void {
        for (const week of this.weeks) {
            for (const day of week.days) {
                if (day.date.isBetween(event.startDate, event.endDate, 'day', '[]')) {
                    day.events.push(event);
                }
            }
        }
    }

    hasEvents(): boolean {
        let result = false;
        for (const week of this.weeks) {
            for (const day of week.days) {
                if (day.hasEvents()) {
                    result = true;
                    break;
                }
            }
        }
        return result;
    }

    thisMonth(): any {
        return {
            year: this.firstDay.year(),
            month: this.firstDay.format('MMMM')
        };
    }

    nextMonth(): any {
        let mth = this.firstDay.clone().add(1, 'months');
        return {
            year: mth.year(),
            month: mth.format('MMMM')
        };
    }

    lastMonth(): any {
        let mth = this.firstDay.clone().subtract(1, 'months');
        return {
            year: mth.year(),
            month: mth.format('MMMM')
        };
    }
}
