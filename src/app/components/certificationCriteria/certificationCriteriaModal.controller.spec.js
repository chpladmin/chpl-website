(function () {
    'use strict';

    describe('components.EditCertificationCriteriaController.controller', function () {
        var vm, scope, $log, utilService, mock;

        mock = {};
        mock.modalInstance = {
            close: jasmine.createSpy('close'),
            dismiss: jasmine.createSpy('dismiss')
        };
        mock.resources = {
            testTools: {"expandable":false,"data":[{"id":1,"name":"ePrescribing Validation Tool","description":null,"retired":false},{"id":15,"name":"Transport Test Tool","description":null,"retired":true},{"id":5,"name":"HL7 v2 Laboratory Results Interface (LRI) Validation Tool","description":null,"retired":false},{"id":11,"name":"HL7v2 Syndromic Surveillance Test Suite","description":null,"retired":false},{"id":9,"name":"Direct Certificate Discovery Tool","description":null,"retired":false},{"id":3,"name":"HL7 v2 Electronic Laboratory Reporting (ELR) Validation Tool","description":null,"retired":false},{"id":13,"name":"Electronic Prescribing","description":null,"retired":false},{"id":16,"name":"Edge Test Tool","description":null,"retired":false},{"id":7,"name":"Transport Testing Tool","description":null,"retired":true},{"id":17,"name":"2015 Direct Certificate Discovery Tool","description":null,"retired":false},{"id":10,"name":"HL7v2 Immunization Test Suite","description":null,"retired":false},{"id":4,"name":"HL7 v2 Immunization Information System (IIS) Reporting Validation Tool","description":null,"retired":false},{"id":12,"name":"HL7v2 Electronic Laboratory Reporting Validation Tool","description":null,"retired":false},{"id":20,"name":"HL7v2 Electronic Laboratory Reporting Validation Tool","description":null,"retired":false},{"id":6,"name":"HL7 v2 Syndromic Surveillance Reporting Validation Tool","description":null,"retired":false},{"id":8,"name":"Cypress","description":null,"retired":false},{"id":14,"name":"HL7 CDA National Health Care Surveys Validator","description":null,"retired":false},{"id":2,"name":"HL7 CDA Cancer Registry Reporting Validation Tool","description":null,"retired":false}]}
        };

        beforeEach(function () {
            module('chpl', function ($provide) {
                $provide.decorator('utilService', function ($delegate) {
                    $delegate.extendSelect = jasmine.createSpy('extendSelect');
                    return $delegate;
                });
            });

            inject(function ($controller, _$log_, $rootScope, _utilService_) {
                $log = _$log_;
                utilService = _utilService_;
                utilService.extendSelect.and.returnValue([]);

                scope = $rootScope.$new();
                vm = $controller('EditCertificationCriteriaController', {
                    cert: {},
                    resources: mock.resources,
                    hasIcs: false,
                    $uibModalInstance: mock.modalInstance,
                    $scope: scope
                });
                scope.$digest();
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                //console.debug('\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        describe('housekeeping', function () {
            it('should exist', function () {
                expect(vm).toBeDefined();
            });

            it('should have a way to close the modal', function () {
                expect(vm.cancel).toBeDefined();
                vm.cancel();
                expect(mock.modalInstance.dismiss).toHaveBeenCalled();
            });
        });

        describe('retired tools', function () {
            it('should have a way of knowing if a tool is unselectable', function () {
                expect(vm.isToolAvailable).toBeDefined();
            });

            it('should know when a tool is available', function () {
                expect(vm.isToolAvailable(mock.resources.testTools.data[0])).toBe(true);
                expect(vm.isToolAvailable(mock.resources.testTools.data[1])).toBe(false);
                vm.hasIcs = true;
                expect(vm.isToolAvailable(mock.resources.testTools.data[1])).toBe(true);
            });
        });
    });
})();
