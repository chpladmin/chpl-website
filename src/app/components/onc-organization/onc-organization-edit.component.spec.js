(() => {
    'use strict';

    fdescribe('the ONC Organization Edit component', () => {
        var $compile, $log, authService, ctrl, el, mock, scope;

        mock = {
            organization: {
                id: 1,
                acbCode: '02',
                name: 'UL LLC',
                website: 'https://industries.ul.com/healthcare',
                address: {
                    addressId: 1,
                    line1: '709 Fiero Lane Suite 25',
                    line2: null,
                    city: 'San Luis Obispo',
                    state: 'CA',
                    zipcode: '93401',
                    country: 'USA',
                },
                retired: false,
                retirementDate: null,
            },
        };

        beforeEach(() => {
            angular.mock.module('chpl.components', $provide => {
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
                scope.organization = mock.organization;
                scope.takeAction = jasmine.createSpy('takeAction');

                el = angular.element('<chpl-onc-organization-edit organization="organization" type="ONC-ACB" take-action="takeAction(action, data)"></chpl-onc-organization-edit>');

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
                    expect(ctrl.organization).not.toBe(mock.organization);
                    expect(ctrl.organization).toEqual(mock.organization);
                });

                it('should make a retirement date object if required', () => {
                    // default organization is not retired; shouldn't have retirement object
                    expect(ctrl.organization.retirementDateObject).toBeUndefined();

                    // arrange; set organzation to have a retirement date
                    let retired = angular.copy(mock.organization);
                    retired.retirementDate = 1565695367097;
                    scope.organization = retired;

                    // act; $digest cycle needed to trigger $onChanges
                    scope.$digest();

                    // assert; retired organization needs retirement date object for ng-model
                    expect(ctrl.organization.retirementDateObject).not.toBeUndefined();
                });
            });

            describe('when using callbacks', () => {
                it('should handle save', () => {
                    let savedObject = angular.copy(mock.organization);
                    ctrl.save();
                    expect(scope.takeAction).toHaveBeenCalledWith('save', savedObject);
                });

                it('should handle cancel', () => {
                    ctrl.cancel();
                    expect(scope.takeAction).toHaveBeenCalledWith('cancel', undefined);
                });
            });

            describe('when handling callbacks', () => {
                it('should handle the address', () => {
                    ctrl.organization.address = undefined;
                    ctrl.valid.address = undefined;
                    ctrl.editAddress({city: 'a name'}, [], true);
                    expect(ctrl.organization.address.city).toBe('a name');
                    expect(ctrl.valid.address).toBe(true);
                });
            });
        });
    });
})();
