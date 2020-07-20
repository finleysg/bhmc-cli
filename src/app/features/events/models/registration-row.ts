import { RegistrationSlot, SlotStatus } from './registration-slot';

export class RegistrationRow {
    holeNumber: number;
    holeId: number;
    startingOrder: number;
    slots: RegistrationSlot[];

    constructor() {
        this.holeId = 0;
        this.holeNumber = 0;
        this.startingOrder = 0;
        this.slots = [];
    }

    static create(registrations: any[]): RegistrationRow {
        const row = new RegistrationRow();
        row.holeNumber = registrations[0] ? registrations[0].holeNumber : -1;
        row.holeId = registrations[0] ? registrations[0].holeId : -1;
        row.startingOrder = registrations[0] ? registrations[0].startingOrder : -1;
        row.slots = registrations.map((reg) =>
            RegistrationSlot.create(row.name, reg.id, reg.memberId, reg.memberName, reg.status)
        );
        return row;
    }

    // derives the hole name from the starting order
    // get name(): string {
    //     if (!this.holeNumber) {
    //         return '';
    //     }
    //     if (this.startingOrder === 0) {
    //         return `${this.holeNumber}A`;
    //     } else if (this.startingOrder === 1) {
    //         return `${this.holeNumber}B`;
    //     } else if (this.startingOrder === 2) {
    //         return `${this.holeNumber}C`;
    //     } else {
    //         return '';
    //     }
    // }

    isRegistered(memberId: number): boolean {
        return this.slots.some((slot) => {
            return slot.isRegistered(memberId);
        });
    }

    get hasOpenings(): boolean {
        return this.slots.some((s) => {
            return s.status === SlotStatus.Available;
        });
    }

    get isDisabled(): boolean {
        return !this.slots.some((s) => {
            return s.selected;
        });
    }

    getSelectedSlotIds(): number[] {
        const selectedSlots = this.slots.filter((s) => s.selected);
        return selectedSlots.map((s) => s.id);
    }

    // get name(): string {
    //     switch (this.holeNumber) {
    //         case 1:
    //             return this.startingOrder === 0 ? '3:00' : '3:09';
    //         case 2:
    //             return this.startingOrder === 0 ? '3:18' : '3:27';
    //         case 3:
    //             return this.startingOrder === 0 ? '3:36' : '3:45';
    //         case 4:
    //             return this.startingOrder === 0 ? '3:54' : '4:03';
    //         case 5:
    //             return this.startingOrder === 0 ? '4:12' : '4:21';
    //         case 6:
    //             return this.startingOrder === 0 ? '4:30' : '4:39';
    //         case 7:
    //             return this.startingOrder === 0 ? '4:48' : '4:57';
    //         case 8:
    //             return this.startingOrder === 0 ? '5:06' : '5:15';
    //         case 9:
    //             return this.startingOrder === 0 ? '5:24' : '5:33';
    //         default:
    //             return '';
    //     }
    // }

    get name(): string {
        switch (this.holeNumber) {
            case 1:
                return this.startingOrder === 0 ? '4:30' : '4:39';
            case 2:
                return this.startingOrder === 0 ? '4:48' : '4:57';
            case 3:
                return this.startingOrder === 0 ? '5:06' : '5:15';
            case 4:
                return this.startingOrder === 0 ? '5:24' : '5:33';
            case 5:
                return this.startingOrder === 0 ? '5:42' : '5:51';
            case 6:
                return this.startingOrder === 0 ? '6:00' : '6:09';
            case 7:
                return this.startingOrder === 0 ? '6:18' : '6:27';
            case 8:
                return this.startingOrder === 0 ? '6:36' : '6:45';
            case 9:
                return this.startingOrder === 0 ? '6:54' : '7:03';
            default:
                return '';
        }
    }
}
