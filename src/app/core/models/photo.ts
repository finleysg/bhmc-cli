declare const moment: any;

export class Photo {
    id: number;
    title: string;
    url: string;
    type: PhotoType;
    year: number;
    eventId: number;
    lastUpdate: any;

    fromJson(json: any): Photo {
        this.id = json.id;
        this.title = json.title;
        this.url = json.file;
        this.eventId = json.event;
        this.type = Photo.getPhotoType(json.document_type);
        this.year = json.year;
        this.lastUpdate = moment(json.last_update);
        return this;
    }

    static getPhotoType(shortType: string): PhotoType {
        let photoType = PhotoType.Other;
        if (shortType === 'DCT') {
            photoType = PhotoType.DamCupTeam;
        } else if (shortType === 'DCP') {
            photoType = PhotoType.DamCupPhoto;
        } else if (shortType === 'CC') {
            photoType = PhotoType.ClubChampion;
        } else if (shortType === 'SCC') {
            photoType = PhotoType.SeniorChampion;
        } else if (shortType === 'MW') {
            photoType = PhotoType.MajorWinner;
        } else if (shortType === 'EP') {
            photoType = PhotoType.EventPhoto;
        }
        return photoType;
    }

    static getPhotoCode(longType: PhotoType): string {
        if (longType === PhotoType.DamCupTeam) {
            return 'DCT';
        } else if (longType === PhotoType.DamCupPhoto) {
            return 'DCP'
        } else if (longType === PhotoType.ClubChampion) {
            return 'CC'
        } else if (longType === PhotoType.SeniorChampion) {
            return 'SCC'
        } else if (longType === PhotoType.MajorWinner) {
            return 'MW'
        } else if (longType === PhotoType.EventPhoto) {
            return 'EP'
        }
        return 'O';
    }
}

export enum PhotoType {
    DamCupTeam = <any>'Dam Cup Team',
    DamCupPhoto = <any>'Dam Cup Photo',
    ClubChampion = <any>'Club Champion',
    SeniorChampion = <any>'Senior Club Champion',
    MajorWinner = <any>'Major Winner',
    EventPhoto = <any>'Event Photo',
    Other = <any>'Other'
}
