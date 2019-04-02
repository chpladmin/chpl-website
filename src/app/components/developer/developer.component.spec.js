(() => {
    'use strict';

    describe('the Developer component', () => {
        var $compile, $log, authService, ctrl, el, mock, scope;

        mock = {
            developer: {
                developerId: 636, developerCode: '1635', name: 'Hyland Software,  Inc.', website: 'https://www.onbase.com/',
                address: {addressId: 177, line1: '28500 Clemens Road', line2: null, city: 'Westlake', state: 'OH', zipcode: '44145', country: 'USA'},
                contact: {contactId: 612, fullName: 'Kress Van Voorhis', friendlyName: null, email: 'kc.van.voorhis@onbase.com', phoneNumber: '440.788.5347', title: 'Customer Advisor'},
                lastModifiedDate: null, deleted: null, transparencyAttestations: [{acbName: 'Drummond', attestation: true}],
                statusEvents: [{id: null, developerId: 636, status: {id: 1, status: 'Active'}, statusDate: 1459484375763, reason: null}],
                status: {id: 1, status: 'Active'},
            },
            developerTweaked: {
                developerId: 636, developerCode: '1635', name: 'Hyland Software,  Inc.', website: 'https://www.onbase.com/',
                address: {addressId: 177, line1: '28500 Clemens Road', line2: null, city: 'Westlake', state: 'OH', zipcode: '44145', country: 'USA'},
                contact: {contactId: 612, fullName: 'Kress Van Voorhis', friendlyName: null, email: 'kc.van.voorhis@onbase.com', phoneNumber: '440.788.5347', title: 'Customer Advisor'},
                lastModifiedDate: null, deleted: null, transparencyAttestations: [{acbName: 'Drummond', attestation: true, $$hashKey: jasmine.any(String)}],
                statusEvents: [{id: null, developerId: 636, status: {id: 1, status: 'Active'}, statusDate: 1459484375763, statusDateObject: jasmine.any(Date), reason: null, $$hashKey: jasmine.any(String)}],
                status: {id: 1, status: 'Active'},
            },
            acbs: [{name: 'Drummond'}],
        };

        beforeEach(() => {
            angular.mock.module('chpl', 'chpl.components', $provide => {
                $provide.decorator('authService', $delegate => {
                    $delegate.hasAnyRole = jasmine.createSpy('hasAnyRole');
                    return $delegate;
                });
            });

            inject((_$compile_, _$log_, $rootScope, _authService_) => {
                $compile = _$compile_;
                $log = _$log_;
                authService = _authService_;
                authService.hasAnyRole.and.returnValue(true);

                scope = $rootScope.$new();
                scope.developer = mock.developer;
                scope.acbs = mock.acbs;
                scope.canEdit = true;
                scope.canMerge = true;
                scope.canSplit = true;
                scope.isEditing = false;
                scope.isInvalid = false;
                scope.isSplitting = false;
                scope.onCancel = jasmine.createSpy('onCancel');
                scope.onEdit = jasmine.createSpy('onEdit');
                scope.showFull = true;
                scope.takeAction = jasmine.createSpy('takeAction');

                el = angular.element('<chpl-developer developer="developer" allowed-acbs="acbs" can-edit="canEdit" can-merge="canMerge" can-split="canSplit" is-editing="isEditing" is-invalid="isInvalid" is-splitting="isSplitting" on-cancel="onCancel()" on-edit="onEdit(developer)" show-full="showFull" take-action="takeAction(action, developerId)"></chpl-developer>');

                $compile(el)(scope);
                scope.$digest();
                ctrl = el.isolateScope().$ctrl;
            });
        });

        afterEach(() => {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(o => angular.toJson(o)).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        describe('view', () => {
            it('should be compiled', () => {
                expect(el.html()).not.toEqual(null);
            });
        });

        describe('controller', () => {
            it('should exist', () => {
                expect(ctrl).toEqual(jasmine.any(Object));
            });

            describe('on change/init', () => {
                it('should make copies of inputs', () => {
                    expect(ctrl.allowedAcbs).not.toBe(mock.acbs);
                    expect(ctrl.allowedAcbs).toEqual(mock.acbs);
                });

                it('should tweak the developer as necessary', () => {
                    expect(ctrl.developer).not.toBe(mock.developerTweaked);
                    expect(ctrl.developer).toEqual(mock.developerTweaked);
                    expect(ctrl.transMap).toEqual({Drummond: true});
                });

                it('shouldn\'t change anything that shouldn\'t change', () => {
                    // save old state
                    let developer = ctrl.developer;
                    let allowedAcbs = ctrl.allowedAcbs;

                    // make changes
                    ctrl.$onChanges({});

                    //assert
                    expect(developer).toBe(ctrl.developer);
                    expect(allowedAcbs).toBe(ctrl.allowedAcbs);
                });
            });

            describe('when figuring out what it can do', () => {
                it('should allow edit based on the container, the developer status, and the user\'s role', () => {
                    expect(ctrl.can('edit')).toBe(true);
                    ctrl.developer.status.status = 'not active';
                    authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ONC') > -1 ? true : false); // user has ROLE_ONC
                    expect(ctrl.can('edit')).toBe(true);
                    authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ACB') > -1 ? true : false); // user has ROLE_ACB
                    expect(ctrl.can('edit')).toBe(false);
                    ctrl.developer.status.status = 'Active';
                    ctrl.canEdit = false;
                    expect(ctrl.can('edit')).toBe(false);
                });

                it('should allow merge iff the container allows it and the user is ADMIN or ONC', () => {
                    expect(ctrl.can('merge')).toBe(true);
                    authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ONC') > -1 ? true : false); // user has ROLE_ONC
                    expect(ctrl.can('merge')).toBe(true);
                    authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ACB') > -1 ? true : false); // user has ROLE_ACB
                    expect(ctrl.can('merge')).toBe(false);
                    authService.hasAnyRole.and.returnValue(true);
                    authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ONC') > -1 ? true : false); // user has ROLE_ONC
                    ctrl.canMerge = false;
                    expect(ctrl.can('merge')).toBe(false);
                });

                it('should allow split based on the container, the developer status, and the user\'s role', () => {
                    expect(ctrl.can('split')).toBe(true);
                    authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ONC') > -1 ? true : false); // user has ROLE_ONC
                    expect(ctrl.can('split')).toBe(true);
                    authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ACB') > -1 ? true : false); // user has ROLE_ACB
                    expect(ctrl.can('split')).toBe(true);
                    ctrl.developer.status.status = 'not active';
                    expect(ctrl.can('split')).toBe(false);
                    ctrl.developer.status.status = 'Active';
                    ctrl.canSplit = false;
                    expect(ctrl.can('merge')).toBe(false);
                });
            });

            describe('when using callbacks', () => {
                it('should send back data on edit', () => {
                    ctrl.edit();
                    expect(scope.takeAction).toHaveBeenCalledWith('edit', 636);
                });

                it('should send back data on merge', () => {
                    ctrl.merge();
                    expect(scope.takeAction).toHaveBeenCalledWith('merge', 636);
                });

                it('should send back data on split', () => {
                    ctrl.split();
                    expect(scope.takeAction).toHaveBeenCalledWith('split', 636);
                });
            });

            describe('when handling edits', () => {
                it('should handle save', () => {
                    let savedObject = angular.copy(mock.developer);
                    savedObject.statusEvents[0].statusDateObject = jasmine.any(Date);
                    savedObject.statusEvents[0].$$hashKey = jasmine.any(String);
                    ctrl.save();
                    expect(scope.onEdit).toHaveBeenCalledWith(savedObject);
                });

                it('should handle cancel', () => {
                    ctrl.cancel();
                    expect(scope.onCancel).toHaveBeenCalled();
                });
            });

            describe('when handling callbacks', () => {
                it('should handle the address', () => {
                    ctrl.developer.address = undefined;
                    ctrl.valid.address = undefined;
                    ctrl.editAddress({city: 'a name'}, [], true);
                    expect(ctrl.developer.address.city).toBe('a name');
                    expect(ctrl.valid.address).toBe(true);
                });

                it('should handle the contact', () => {
                    ctrl.developer.contact = undefined;
                    ctrl.valid.contact = undefined;
                    ctrl.editContact({name: 'a name'}, [], true);
                    expect(ctrl.developer.contact.name).toBe('a name');
                    expect(ctrl.valid.contact).toBe(true);
                });
            });

            describe('with respect to validation', () => {
                it('should know when the form is invalid', () => {
                    let pStatus = true;
                    let pDate = true;
                    spyOn(ctrl, 'matchesPreviousStatus').and.callFake(() => pStatus);
                    spyOn(ctrl, 'matchesPreviousDate').and.callFake(() => pDate);
                    ctrl.form.$valid = false; // form i svalid
                    expect(ctrl.isValid()).toBe(false);
                    ctrl.form.$valid = true;
                    ctrl.isInvalid = true; // external validity
                    expect(ctrl.isValid()).toBe(false);
                    ctrl.isInvalid = false;
                    ctrl.valid.contact = false; // contact validitiy
                    expect(ctrl.isValid()).toBe(false);
                    ctrl.valid.contact = true;
                    ctrl.valid.address = false; // address validity
                    expect(ctrl.isValid()).toBe(false);
                    ctrl.valid.address = true;
                    ctrl.developer.statusEvents = undefined; // status events exist
                    expect(ctrl.isValid()).toBeFalsy();
                    ctrl.developer.statusEvents = []; // at least one status event
                    expect(ctrl.isValid()).toBe(false);
                    ctrl.developer.statusEvents.push({id: 'fake'}); // matches previous status
                    expect(ctrl.isValid()).toBe(false);
                    pStatus = false; // matches previous date
                    expect(ctrl.isValid()).toBe(false);
                    pDate = false; // everything's valid
                    expect(ctrl.isValid()).toBe(true);
                });

                describe('for status events', () => {
                    beforeEach(() => {
                        ctrl.developer.statusEvents = [{
                            statusDateObject: new Date('2019-03-15'),
                            status: {status: 'Active'},
                        }];
                    });

                    it('should pass with only one status', () => {
                        expect(ctrl.matchesPreviousStatus(ctrl.developer.statusEvents[0])).toBe(false);
                        expect(ctrl.matchesPreviousDate(ctrl.developer.statusEvents[0])).toBe(false);
                    });

                    it('should recognize a duplicate date', () => {
                        ctrl.developer.statusEvents.push({
                            statusDateObject: new Date('2019-03-15'),
                            status: {status: 'Retired'},
                        });
                        expect(ctrl.matchesPreviousStatus(ctrl.developer.statusEvents[1])).toBe(false);
                        expect(ctrl.matchesPreviousDate(ctrl.developer.statusEvents[1])).toBe(true);
                    });

                    it('should recognize a duplicate status', () => {
                        ctrl.developer.statusEvents.push({
                            statusDateObject: new Date('2019-03-16'),
                            status: {status: 'Active'},
                        });
                        expect(ctrl.matchesPreviousStatus(ctrl.developer.statusEvents[1])).toBe(true);
                        expect(ctrl.matchesPreviousDate(ctrl.developer.statusEvents[1])).toBe(false);
                    });
                });
            });
        });
    });
})();
