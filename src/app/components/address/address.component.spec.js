(() => {
    'use strict';

    describe('the Address component', () => {
        var $compile, $log, ctrl, el, scope;

        beforeEach(() => {
            angular.mock.module('chpl', 'chpl.components');

            inject((_$compile_, _$log_, $rootScope) => {
                $compile = _$compile_;
                $log = _$log_;

                scope = $rootScope.$new();
                scope.onChange = jasmine.createSpy('onChange');

                el = angular.element('<chpl-address on-change="onChange(address, errors, validForm)"></chpl-address>');

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
        });

        describe('with respect to required fields', () => {
            it('should not require an address by default', () => {
                expect(ctrl.valuesRequired()).toBe(false);
            });

            it('should require an address if any elements of the address exist', () => {
                ctrl.address = {};
                expect(ctrl.valuesRequired()).toBe(false);

                ctrl.address.line1 = 'Line 1';
                expect(ctrl.valuesRequired()).toBe(true);
                ctrl.address = {};
                expect(ctrl.valuesRequired()).toBe(false);

                ctrl.address.line2 = 'Line 2';
                expect(ctrl.valuesRequired()).toBe(true);
                ctrl.address = {};
                expect(ctrl.valuesRequired()).toBe(false);

                ctrl.address.city = 'City';
                expect(ctrl.valuesRequired()).toBe(true);
                ctrl.address = {};
                expect(ctrl.valuesRequired()).toBe(false);

                ctrl.address.state = 'State';
                expect(ctrl.valuesRequired()).toBe(true);
                ctrl.address = {};
                expect(ctrl.valuesRequired()).toBe(false);

                ctrl.address.zipcode = 'Zip';
                expect(ctrl.valuesRequired()).toBe(true);
                ctrl.address = {};
                expect(ctrl.valuesRequired()).toBe(false);

                ctrl.address.country = 'Country';
                expect(ctrl.valuesRequired()).toBe(true);
                ctrl.address = {};
                expect(ctrl.valuesRequired()).toBe(false);
            });

            it('should require an address if "isRequired" is true', () => {
                scope.isRequired = true;
                scope.address = {};
                el = angular.element('<chpl-address is-required="isRequired" on-change="onChange(address, errors, validForm)"></chpl-address>');

                $compile(el)(scope);
                scope.$digest();
                ctrl = el.isolateScope().$ctrl;
                expect(ctrl.valuesRequired()).toBe(true);
            });
        });

        describe('with respect to error messages', () => {
            it('should start with no errorMessages', () => {
                expect(ctrl.errorMessages).toEqual([]);
            });

            it('should pass the errors up', () => {
                ctrl.address = {};
                ctrl.isRequired = true;
                ctrl.form = { $valid: true };
                ctrl.update();
                expect(scope.onChange).toHaveBeenCalledWith(
                    {},
                    [
                        'Line 1 is required',
                        'City is required',
                        'State is required',
                        'Zip is required',
                        'Country is required',
                    ],
                    false,
                );
            });

            it('should have errors for missing fields', () => {
                ctrl.address = {};
                ctrl.isRequired = true;
                ctrl.form = { $valid: true };
                ctrl.update();
                expect(ctrl.errorMessages).toEqual([
                    'Line 1 is required',
                    'City is required',
                    'State is required',
                    'Zip is required',
                    'Country is required',
                ]);

                ctrl.address.line1 = 'Line1';
                ctrl.update();
                expect(ctrl.errorMessages).toEqual([
                    'City is required',
                    'State is required',
                    'Zip is required',
                    'Country is required',
                ]);

                ctrl.address.city = 'City';
                ctrl.update();
                expect(ctrl.errorMessages).toEqual([
                    'State is required',
                    'Zip is required',
                    'Country is required',
                ]);

                ctrl.address.state = 'State';
                ctrl.update();
                expect(ctrl.errorMessages).toEqual([
                    'Zip is required',
                    'Country is required',
                ]);

                ctrl.address.zipcode = 'Zip';
                ctrl.update();
                expect(ctrl.errorMessages).toEqual([
                    'Country is required',
                ]);

                ctrl.address.country = 'Country';
                ctrl.update();
                expect(ctrl.errorMessages).toEqual([]);
            });
        });
    });
})();
