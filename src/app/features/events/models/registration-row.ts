import { RegistrationSlot, SlotStatus } from './registration-slot';

export class RegistrationRow {

    holeNumber: number;
    holeId: number;
    startingOrder: number;
    slots: RegistrationSlot[];

    static create(registrations: any[]): RegistrationRow {
        let row = new RegistrationRow();
        row.holeNumber = registrations[0] ? registrations[0].holeNumber : -1;
        row.holeId = registrations[0] ? registrations[0].holeId : -1;
        row.startingOrder = registrations[0] ? registrations[0].startingOrder : -1;
        row.slots = registrations.map(reg => RegistrationSlot.create(row, reg));
        return row;
    }

    // derives the hole name from the starting order
    get name(): string {
        if (!this.holeNumber) {
            return '';
        }
        if (this.startingOrder === 0) {
            return `${this.holeNumber}A`;
        } else if (this.startingOrder === 1) {
            return `${this.holeNumber}B`;
        } else if (this.startingOrder === 2) {
            return `${this.holeNumber}C`;
        } else {
            return '';
        }
    };

    isRegistered(memberId: number): boolean {
        return this.slots.some(slot => {
            return slot.isRegistered(memberId);
        });
    };

    get hasOpenings(): boolean {
        return this.slots.some( s => {
            return s.status === SlotStatus.Available;
        });
    };

    get isDisabled(): boolean {
        return !this.slots.some( s => {
            return s.selected;
        });
    }

    get selectedSlotIds(): number[] {
        return this.slots.filter(s => s.selected).map(s => { return s.id; });
    }
}
