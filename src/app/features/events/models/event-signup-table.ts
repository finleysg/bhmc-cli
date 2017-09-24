import { RegistrationRow } from './registration-row';

export class EventSignupTable {
    courseSetupId: number;
    courseName: string;
    rows: RegistrationRow[];

    constructor(id: number, name: string) {
        this.courseSetupId = id;
        this.courseName = name;
        this.rows = [];
    }
}
