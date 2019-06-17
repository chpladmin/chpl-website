(function () {
    'use strict';

    describe('the contact directive', function () {
        var $log, el, vm;

        beforeEach(function () {
            angular.mock.module('chpl.components');

            inject(function ($compile, _$log_, $rootScope) {
                $log = _$log_;

                el = angular.element('<ai-contact></ai-contact>');

                $compile(el)($rootScope.$new());
                $rootScope.$digest();
                vm = el.isolateScope().vm;
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + angular.toJson($log.debug.logs));
                /* eslint-enable no-console,angular/log */
            }
        });

        it('should be compiled', function () {
            expect(el.html()).not.toEqual(null);
        });

        it('should have isolate scope object with instanciate members', function () {
            expect(vm).toEqual(jasmine.any(Object));
        });

        describe('required fields', function () {
            it('should not require a contact by default', function () {
                expect(vm.valuesRequired()).toBe(false);
            });

            it('should require a contact if any elements of the contact exist', function () {
                vm.contact = {};
                expect(vm.valuesRequired()).toBe(false);

                vm.contact.fullName = 'John';
                expect(vm.valuesRequired()).toBe(true);
                vm.contact = {};
                expect(vm.valuesRequired()).toBe(false);

                vm.contact.friendlyName = 'Smith';
                expect(vm.valuesRequired()).toBe(true);
                vm.contact = {};
                expect(vm.valuesRequired()).toBe(false);

                vm.contact.title = 'Mr.';
                expect(vm.valuesRequired()).toBe(true);
                vm.contact = {};
                expect(vm.valuesRequired()).toBe(false);

                vm.contact.email = 'sample@example.com';
                expect(vm.valuesRequired()).toBe(true);
                vm.contact = {};
                expect(vm.valuesRequired()).toBe(false);

                vm.contact.phoneNumber = '123-123-1234';
                expect(vm.valuesRequired()).toBe(true);
                vm.contact = {};
                expect(vm.valuesRequired()).toBe(false);
            });

            it('should require a contact if "isRequired" is true', function () {
                vm.isRequired = true;
                expect(vm.valuesRequired()).toBe(true);
            });
        });

        describe('error messages', function () {
            it('should start with no errorMessages', function () {
                expect(vm.errorMessages).toEqual([]);
            });

            it('should have errors for missing fields', function () {
                vm.contact = {};
                vm.isRequired = true;
                vm.updateErrors();
                expect(vm.errorMessages).toEqual([
                    'Full name is required',
                    'Email is required',
                    'Phone number is required',
                ]);

                vm.contact.fullName = 'John';
                vm.updateErrors();
                expect(vm.errorMessages).toEqual([
                    'Email is required',
                    'Phone number is required',
                ]);

                vm.contact.email = 'sample@example.com';
                vm.updateErrors();
                expect(vm.errorMessages).toEqual([
                    'Phone number is required',
                ]);

                vm.contact.phoneNumber = '123-123-1234';
                vm.updateErrors();
                expect(vm.errorMessages).toEqual([]);
            });
        });
    });
})();
