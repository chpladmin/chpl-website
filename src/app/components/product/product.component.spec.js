(() => {
    'use strict';

    describe('the Product component', () => {
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
            developers: [{
                developerId: 1, developerCode: '1635', name: 'Hyland Software,  Inc.', website: 'https://www.onbase.com/',
                address: {addressId: 177, line1: '28500 Clemens Road', line2: null, city: 'Westlake', state: 'OH', zipcode: '44145', country: 'USA'},
                contact: {contactId: 612, fullName: 'Kress Van Voorhis', friendlyName: null, email: 'kc.van.voorhis@onbase.com', phoneNumber: '440.788.5347', title: 'Customer Advisor'},
                lastModifiedDate: null, deleted: null, transparencyAttestations: [],
                statusEvents: [{id: null, developerId: 636, status: {id: 1, status: 'Active'}, statusDate: 1459484375763, reason: null}],
                status: {id: 1, status: 'Active'},
            }, {
                developerId: 2042, developerCode: '1635', name: 'Hyland Software,  Inc.', website: 'https://www.onbase.com/',
                address: {addressId: 177, line1: '28500 Clemens Road', line2: null, city: 'Westlake', state: 'OH', zipcode: '44145', country: 'USA'},
                contact: {contactId: 612, fullName: 'Kress Van Voorhis', friendlyName: null, email: 'kc.van.voorhis@onbase.com', phoneNumber: '440.788.5347', title: 'Customer Advisor'},
                lastModifiedDate: null, deleted: null, transparencyAttestations: [],
                statusEvents: [{id: null, developerId: 636, status: {id: 1, status: 'Active'}, statusDate: 1459484375763, reason: null}],
                status: {id: 1, status: 'Active'},
            }],
            product: {
                productId: 636, name: 'OnBase,  Inc.', lastModifiedDate: null,
                contact: {contactId: 612, fullName: 'Kress Van Voorhis', friendlyName: null, email: 'kc.van.voorhis@onbase.com', phoneNumber: '440.788.5347', title: 'Customer Advisor'},
                owner: {developerId: 2042, developerCode: '3041', name: 'CPSI (Computer Programs and Systems),  Inc.'},
                ownerHistory: [{id: 127, developer: {developerId: 2042, developerCode: '3041', name: 'CPSI (Computer Programs and Systems),  Inc.'}, transferDate: 1552570509025}, {id: 89, developer: {developerId: 184, developerCode: '1183', name: 'CPSI (Computer Programs and Systems),  Inc.'}, transferDate: 1552505343043}],
            },
            productTweaked: {
                productId: 636, name: 'OnBase,  Inc.', lastModifiedDate: null,
                contact: {contactId: 612, fullName: 'Kress Van Voorhis', friendlyName: null, email: 'kc.van.voorhis@onbase.com', phoneNumber: '440.788.5347', title: 'Customer Advisor'},
                owner: {developerId: 2042, developerCode: '3041', name: 'CPSI (Computer Programs and Systems),  Inc.'},
                ownerHistory: [{id: 127, developer: {developerId: 2042, developerCode: '3041', name: 'CPSI (Computer Programs and Systems),  Inc.'}, transferDate: 1552570509025, transferDateObject: new Date(1552570509025), $$hashKey: jasmine.any(String)}, {id: 89, developer: {developerId: 184, developerCode: '1183', name: 'CPSI (Computer Programs and Systems),  Inc.'}, transferDate: 1552505343043, transferDateObject: new Date(1552505343043), $$hashKey: jasmine.any(String)}],
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
                scope.product = mock.product;
                scope.developer = mock.developer;
                scope.developers = mock.developers;
                scope.canEdit = true;
                scope.canMerge = true;
                scope.canSplit = true;
                scope.canView = true;
                scope.isEditing = false;
                scope.isInvalid = false;
                scope.isList = false;
                scope.isMerging = false;
                scope.isSplitting = false;
                scope.onCancel = jasmine.createSpy('onCancel');
                scope.onEdit = jasmine.createSpy('onEdit');
                scope.showFull = true;
                scope.takeAction = jasmine.createSpy('takeAction');

                el = angular.element('<chpl-product product="product" developer="developer" developers="developers" can-edit="canEdit" can-merge="canMerge" can-split="canSplit" can-view="canView" is-editing="isEditing" isInvalid="isInvalid" is-list="isList" is-merging="isMerging" is-splitting="isSplitting" on-cancel="onCancel()" on-edit="onEdit(product)" show-full="showFull" take-action="takeAction(action, productId)"></chpl-product>');

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
                    expect(ctrl.product).not.toBe(mock.productTweaked);
                    expect(ctrl.product).toEqual(mock.productTweaked);
                    expect(ctrl.developer).not.toBe(mock.developer);
                    expect(ctrl.developer).toEqual(mock.developer);
                    expect(ctrl.developers).not.toBe(mock.developers);
                    expect(ctrl.developers).toEqual(mock.developers);
                });

                it('shouldn\'t change anything that shouldn\'t change', () => {
                    // save old state
                    let product = ctrl.product;
                    let developer = ctrl.developer;
                    let developers = ctrl.developers;

                    // make changes
                    ctrl.$onChanges({});

                    //assert
                    expect(product).toBe(ctrl.product);
                    expect(developer).toBe(ctrl.developer);
                    expect(developers).toBe(ctrl.developers);
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

                it('should send back data on view', () => {
                    ctrl.view();
                    expect(scope.takeAction).toHaveBeenCalledWith(undefined, 636);
                });
            });

            describe('when handling edits', () => {
                it('should handle save when not splitting', () => {
                    ctrl.isSplitting = false;
                    let savedObject = angular.copy(mock.productTweaked);
                    savedObject.owner = angular.copy(mock.developers[1]);
                    savedObject.ownerHistory = savedObject.ownerHistory.map(item => {
                        item.$$hashKey = jasmine.any(String);
                        return item;
                    });
                    ctrl.save();
                    expect(scope.onEdit).toHaveBeenCalledWith(savedObject);
                });

                it('should handle save when splitting', () => {
                    ctrl.isSplitting = true;
                    let savedObject = angular.copy(mock.productTweaked);
                    savedObject.ownerHistory = savedObject.ownerHistory.map(item => {
                        item.$$hashKey = jasmine.any(String);
                        return item;
                    });
                    ctrl.save();
                    expect(scope.onEdit).toHaveBeenCalledWith(savedObject);
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
                    ctrl.isInvalid = false;
                    ctrl.valid.contact = false;
                    expect(ctrl.isValid()).toBe(false);
                    ctrl.valid.contact = true;
                    expect(ctrl.isValid()).toBe(true);
                });
            });

            describe('when handling the contact', () => {
                it('should handle the callback function', () => {
                    ctrl.product.contact = undefined;
                    ctrl.valid.contact = undefined;
                    ctrl.editContact({name: 'a name'}, [], true);
                    expect(ctrl.product.contact.name).toBe('a name');
                    expect(ctrl.valid.contact).toBe(true);
                });
            });

            describe('when dealing with owner history', () => {
                it('should add new owners', () => {
                    ctrl.addOwnerHistory()
                    expect(ctrl.product.ownerHistory[2]).toEqual({
                        transferDateObject: jasmine.any(Date),
                    });
                });

                it('should handle changing of current owner', () => {
                    ctrl.changeCurrentOwner(1);
                    expect(ctrl.product.ownerHistory[2]).toEqual({
                        developer: mock.developers[0],
                        transferDateObject: jasmine.any(Date),
                    });
                });

                it('should handle removing an owner', () => {
                    ctrl.removeOwnerHistory(0);
                    expect(ctrl.product.ownerHistory.length).toBe(1);
                });
            });
        });
    });
})();
