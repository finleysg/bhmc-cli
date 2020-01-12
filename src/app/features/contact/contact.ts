export class Contact {
    presidentName?: string;
    presidentPhone?: string;
    presidentEmail = 'president@bhmc.org';
    vicePresidentName?: string;
    vicePresidentPhone?: string;
    vicePresidentEmail = 'vice-president@bhmc.org';
    secretaryName?: string;
    secretaryPhone?: string;
    secretaryEmail = 'secretary@bhmc.org';
    treasurerName?: string;
    treasurerPhone?: string;
    treasurerEmail = 'treasurer@bhmc.org';
    directorsText?: string;
    committeesText?: string;
    staffText?: string;

    fromJson(json: any): Contact {
        this.presidentName = json.president_name;
        this.presidentPhone = json.president_phone;
        this.vicePresidentName = json.vice_president_name;
        this.vicePresidentPhone = json.vice_president_phone;
        this.secretaryName = json.secretary_name;
        this.secretaryPhone = json.secretary_phone;
        this.treasurerName = json.treasurer_name;
        this.treasurerPhone = json.treasurer_phone;
        this.directorsText = json.directors;
        this.committeesText = json.committees;
        this.staffText = json.staff;
        return this;
    }
}
