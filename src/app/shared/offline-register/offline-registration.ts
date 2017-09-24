import { PublicMember } from '../../core';

export class OfflineRegistration {
    members: PublicMember[];
    paymentMethod: string;
    paymentNotes: string;
    paymentAmount: number;
    forwardTees: boolean; // season reg only

    constructor() {
        this.members = [];
    }
}
