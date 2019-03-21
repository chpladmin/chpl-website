(() => {
    'use strict';

    describe('the Contact component', () => {
        var $compile, $log, ctrl, el, scope;

        beforeEach(() => {
            angular.mock.module('chpl', 'chpl.components');

            inject((_$compile_, _$log_, $rootScope) => {
                $compile = _$compile_;
                $log = _$log_;

                scope = $rootScope.$new();
                scope.onChange = jasmine.createSpy('onChange');

                el = angular.element('<chpl-contact on-change="onChange(contact, errors, validForm)"></chpl-contact>');

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
            it('should not require a contact by default', () => {
                expect(ctrl.valuesRequired()).toBe(false);
            });

            it('should require a contact if any elements of the contact exist', () => {
                ctrl.contact = {};
                expect(ctrl.valuesRequired()).toBe(false);

                ctrl.contact.fullName = 'John';
                expect(ctrl.valuesRequired()).toBe(true);
                ctrl.contact = {};
                expect(ctrl.valuesRequired()).toBe(false);

                ctrl.contact.friendlyName = 'Smith';
                expect(ctrl.valuesRequired()).toBe(true);
                ctrl.contact = {};
                expect(ctrl.valuesRequired()).toBe(false);

                ctrl.contact.title = 'Mr.';
                expect(ctrl.valuesRequired()).toBe(true);
                ctrl.contact = {};
                expect(ctrl.valuesRequired()).toBe(false);

                ctrl.contact.email = 'sample@example.com';
                expect(ctrl.valuesRequired()).toBe(true);
                ctrl.contact = {};
                expect(ctrl.valuesRequired()).toBe(false);

                ctrl.contact.phoneNumber = '123-123-1234';
                expect(ctrl.valuesRequired()).toBe(true);
                ctrl.contact = {};
                expect(ctrl.valuesRequired()).toBe(false);
            });

            it('should require a contact if "isRequired" is true', () => {
                scope.isRequired = true;
                scope.contact = {};
                el = angular.element('<chpl-contact contact="contact" is-required="isRequired" on-change="onChange(contact, errors, validForm)"></chpl-contact>');

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
                ctrl.contact = {};
                ctrl.isRequired = true;
                ctrl.form = { $valid: true };
                ctrl.update();
                expect(scope.onChange).toHaveBeenCalledWith(
                    {},
                    [
                        'Full name is required',
                        'Email is required',
                        'Phone number is required',
                    ],
                    false,
                );
            });

            it('should have errors for missing fields', () => {
                ctrl.contact = {};
                ctrl.isRequired = true;
                ctrl.form = { $valid: true };
                ctrl.update();
                expect(ctrl.errorMessages).toEqual([
                    'Full name is required',
                    'Email is required',
                    'Phone number is required',
                ]);

                ctrl.contact.fullName = 'John';
                ctrl.update();
                expect(ctrl.errorMessages).toEqual([
                    'Email is required',
                    'Phone number is required',
                ]);

                ctrl.contact.email = 'sample@example.com';
                ctrl.update();
                expect(ctrl.errorMessages).toEqual([
                    'Phone number is required',
                ]);

                ctrl.contact.phoneNumber = '123-123-1234';
                ctrl.update();
                expect(ctrl.errorMessages).toEqual([]);
            });
        });
    });
})();
