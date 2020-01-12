import { EventDetail, RegistrationWindowType, EventType } from './event-detail';
import { EventRegistration } from './event-registration';
import { PublicMember } from './member';

describe('EventDetail model', () => {
    let model: EventDetail;
    beforeEach(() => {
        model = new EventDetail({
            id: 1,
            name: 'Test Event',
            eventType: 'O',
        });
    });

    describe('canRegister', () => {

        it('returns true if registering', () => {
            model.requiresRegistration = true;
            model.registrationWindow = RegistrationWindowType.Registering;
            expect(model.canRegister).toBe(true);
        });

        it('returns false if canceled', () => {
            model.requiresRegistration = true;
            model.registrationWindow = RegistrationWindowType.Registering;
            model.eventType = EventType.Canceled;
            expect(model.canRegister).toBe(false);
        });

        it('returns false if registration window is in the future', () => {
            model.requiresRegistration = true;
            model.registrationWindow = RegistrationWindowType.Future;
            expect(model.canRegister).toBe(false);
        });

        it('returns false if registration window is past', () => {
            model.requiresRegistration = true;
            model.registrationWindow = RegistrationWindowType.Past;
            expect(model.canRegister).toBe(false);
        });

        it('returns false if event does not require registration', () => {
            model.requiresRegistration = false;
            model.registrationWindow = RegistrationWindowType.Registering;
            expect(model.canRegister).toBe(false);
        });
    });

    describe('isRegistered', () => {

        it('returns false if there are no registrations', () => {
            model.registrations = [];
            expect(model.isRegistered(1)).toBe(false);
        });

        it('returns false if the given member has no registration', () => {
            model.registrations = [
                new EventRegistration({
                    member: new PublicMember({id: 1}),
                    status: 'R',
                })
            ];
            expect(model.isRegistered(2)).toBe(false);
        });

        it('returns false if the given member has no completed registration', () => {
            model.registrations = [
                new EventRegistration({
                    member: new PublicMember({id: 1}),
                    status: 'A',
                })
            ];
            expect(model.isRegistered(1)).toBe(false);
        });

        it('returns true if the given member has a completed registration', () => {
            model.registrations = [
                new EventRegistration({
                    member: new PublicMember({id: 1}),
                    status: 'R',
                })
            ];
            expect(model.isRegistered(1)).toBe(true);
        });
    });

    describe('canViewRegistrations', () => {

        it('returns true if registering', () => {
            model.requiresRegistration = true;
            model.registrationWindow = RegistrationWindowType.Registering;
            expect(model.canViewRegistrations).toBe(true);
        });

        it('returns true if registration is past', () => {
            model.requiresRegistration = true;
            model.registrationWindow = RegistrationWindowType.Registering;
            expect(model.canViewRegistrations).toBe(true);
        });

        it('returns false if registration window is in the future', () => {
            model.requiresRegistration = true;
            model.registrationWindow = RegistrationWindowType.Future;
            expect(model.canViewRegistrations).toBe(false);
        });
    });
});
