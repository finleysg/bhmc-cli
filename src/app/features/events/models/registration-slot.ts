export enum SlotStatus {
    Available = <any>'Available',
    Reserved = <any>'Reserved',
    Pending = <any>'Pending',
    Unavailable = <any>'Unavailable'
}

export class RegistrationSlot {

    id: number;
    rowName: string;
    memberId: number;
    memberName: string;
    status: SlotStatus;
    selected: boolean;
    found: boolean;

    constructor() {
        this.id = 0;
        this.rowName = '';
        this.memberId = 0;
        this.memberName = '';
        this.status = SlotStatus.Unavailable;
        this.selected = false;
        this.found = false;
    }

    static create(rowName: string, slotId: number, memberId: number, memberName: string, status: string): RegistrationSlot {
        const newSlot = new RegistrationSlot();
        newSlot.id = slotId;
        newSlot.rowName = rowName;
        newSlot.memberId = memberId;
        newSlot.memberName = memberName;
        newSlot.selected = false;
        newSlot.updateStatus(status);
        return newSlot;
    }

    isRegistered(memberId: number): boolean {
        return this.memberId === memberId;
    }

    get displayText(): string {
        if (this.selected && this.status === SlotStatus.Available) {
            return 'Selected';
        } else if (this.status === SlotStatus.Reserved) {
            return this.memberName;
        } else {
            return this.status.toString();
        }
    }

    get canSelect(): boolean {
        return this.status === SlotStatus.Available;
    }

    private updateStatus(rawStatus: string): void {
        this.status = SlotStatus.Unavailable;
        if (rawStatus === 'A') {
            this.status = SlotStatus.Available;
        } else if (rawStatus === 'P') {
            this.status = SlotStatus.Pending;
        } else if (rawStatus === 'R') {
            this.status = SlotStatus.Reserved;
        }
    }
}
