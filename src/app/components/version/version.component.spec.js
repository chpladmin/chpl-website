(() => {
    'use strict';

    fdescribe('the Version component', () => {
        var $compile, $log, authService, ctrl, el, mock, scope;

        mock = {
            developer: {
                developerId: 636, developerCode: '1635', name: 'Hyland Software,  Inc.', website: 'https://www.onbase.com/',
                address: {addressId: 177, line1: '28500 Clemens Road', line2: null, city: 'Westlake', state: 'OH', zipcode: '44145', country: 'USA'},
                contact: {contactId: 612, fullName: 'Kress Van Voorhis', friendlyName: null, email: 'kc.van.voorhis@onbase.com', phoneNumber: '440.788.5347', title: 'Customer Advisor'},
                lastModifiedDate: null, deleted: null, transparencyAttestations: [],
                statusEvents: [{id: null, developerId: 636, status: {id: 1, status: 'Active'}, statusDate: 1459484375763, reason: null}],
                status: {id: 1, status: 'Active'},
            },
            version: {
                versionId: 636, version: 'v1.', lastModifiedDate: null,
            },
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
                scope.version = mock.version;
                scope.developer = mock.developer;
                scope.canEdit = true;
                scope.canMerge = true;
                scope.canSplit = true;
                scope.canView = true;
                scope.isEditing = true;
                scope.isInvalid = false;
                scope.isSplitting = false;
                scope.onCancel = jasmine.createSpy('onCancel');
                scope.onEdit = jasmine.createSpy('onEdit');
                scope.showFull = true;
                scope.takeAction = jasmine.createSpy('takeAction');

                el = angular.element('<chpl-version version="version" developer="developer" can-edit="canEdit" can-merge="canMerge" can-split="canSplit" can-view="canView" is-editing="isEditing" is-invalid="isInvalid" is-splitting="isSplitting" on-cancel="onCancel()" on-edit="onEdit(version)" show-full="showFull" take-action="takeAction(action, versionId)"></chpl-version>');

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
                    expect(ctrl.version).not.toBe(mock.version);
                    expect(ctrl.version).toEqual(mock.version);
                    expect(ctrl.developer).not.toBe(mock.developer);
                    expect(ctrl.developer).toEqual(mock.developer);
                });

                it('shouldn\'t change anything that shouldn\'t change', () => {
                    // save old state
                    let version = ctrl.version;
                    let developer = ctrl.developer;

                    // make changes
                    ctrl.$onChanges({});

                    //assert
                    expect(version).toBe(ctrl.version);
                    expect(developer).toBe(ctrl.developer);
                });
            });

            describe('when figuring out what it can do', () => {
                it('should allow edit based on the container, the developer status, and the user\'s role', () => {
                    expect(ctrl.can('edit')).toBe(true);
                    authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ONC') > -1 ? true : false); // user has ROLE_ONC
                    ctrl.developer.status.status = 'not active';
                    expect(ctrl.can('edit')).toBe(true);
                    authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ACB') > -1 ? true : false); // user has ROLE_ACB
                    expect(ctrl.can('edit')).toBe(false);
                    ctrl.developer.status.status = 'Active';
                    ctrl.canEdit = false;
                    expect(ctrl.can('edit')).toBe(false);
                });

                it('should allow merge iff the container allows it and the user is ADMIN or ONC', () => {
                    expect(ctrl.can('merge')).toBe(true);
                    authService.hasAnyRole.and.returnValue(false);
                    expect(ctrl.can('merge')).toBe(false);
                    authService.hasAnyRole.and.returnValue(true);
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

                it('should send back data on view', () => {
                    ctrl.view();
                    expect(scope.takeAction).toHaveBeenCalledWith(undefined, 636);
                });
            });

            describe('when handling edits', () => {
                it('should handle save', () => {
                    ctrl.save();
                    expect(scope.onEdit).toHaveBeenCalledWith(mock.version);
                });

                it('should handle cancel', () => {
                    ctrl.cancel();
                    expect(scope.onCancel).toHaveBeenCalled();
                });
            });

            describe('for form validation', () => {
                it('should know when the form is invalid', () => {
                    ctrl.form.$valid = true;
                    expect(ctrl.isValid()).toBe(true);
                    ctrl.form.$valid = false;
                    expect(ctrl.isValid()).toBe(false);
                    ctrl.form.$valid = true;
                    ctrl.isInvalid = true;
                    expect(ctrl.isValid()).toBe(false);
                });
            });
        });
    });
})();
