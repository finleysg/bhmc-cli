import moment from 'moment';
import { isEmpty } from 'lodash';

export enum PhotoType {
    DamCupTeam = <any>'Dam Cup Team',
    DamCupPhoto = <any>'Dam Cup Photo',
    ClubChampion = <any>'Club Champion',
    SeniorChampion = <any>'Senior Club Champion',
    MajorWinner = <any>'Major Winner',
    EventPhoto = <any>'Event Photo',
    Other = <any>'Other'
}

export class Photo {
    id = 0;
    title = '';
    url = '';
    type: PhotoType = PhotoType.Other;
    year = 0;
    eventId?: number;
    lastUpdate: any;

    constructor(obj: any) {
        if (!isEmpty(obj)) {
            const photo = this.fromJson(obj);
            Object.assign(this, photo);
        }
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

    static getPhotoCode(longType?: PhotoType): string {
        if (longType === PhotoType.DamCupTeam) {
            return 'DCT';
        } else if (longType === PhotoType.DamCupPhoto) {
            return 'DCP';
        } else if (longType === PhotoType.ClubChampion) {
            return 'CC';
        } else if (longType === PhotoType.SeniorChampion) {
            return 'SCC';
        } else if (longType === PhotoType.MajorWinner) {
            return 'MW';
        } else if (longType === PhotoType.EventPhoto) {
            return 'EP';
        }
        return 'O';
    }

    private fromJson(json: any): any {
        const obj: {[index: string]: any} = {};
        obj.id = json.id;
        obj.title = json.title;
        obj.url = json.file;
        obj.eventId = json.event;
        obj.type = Photo.getPhotoType(json.document_type);
        obj.year = json.year;
        obj.lastUpdate = moment(json.last_update);
        return obj;
    }
}
