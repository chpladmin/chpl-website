(function () {
    'use strict';

    describe('the Certification Criteria Edit controller', function () {
        var $log, Mock, mock, scope, vm;

        mock = {};
        mock.resources = {
            testTools: {'expandable': false,'data': [{'id': 1,'name': 'ePrescribing Validation Tool','description': null,'retired': false},{'id': 15,'name': 'Transport Test Tool','description': null,'retired': true},{'id': 5,'name': 'HL7 v2 Laboratory Results Interface (LRI) Validation Tool','description': null,'retired': false},{'id': 11,'name': 'HL7v2 Syndromic Surveillance Test Suite','description': null,'retired': false},{'id': 9,'name': 'Direct Certificate Discovery Tool','description': null,'retired': false},{'id': 3,'name': 'HL7 v2 Electronic Laboratory Reporting (ELR) Validation Tool','description': null,'retired': false},{'id': 13,'name': 'Electronic Prescribing','description': null,'retired': false},{'id': 16,'name': 'Edge Test Tool','description': null,'retired': false},{'id': 7,'name': 'Transport Testing Tool','description': null,'retired': true},{'id': 17,'name': '2015 Direct Certificate Discovery Tool','description': null,'retired': false},{'id': 10,'name': 'HL7v2 Immunization Test Suite','description': null,'retired': false},{'id': 4,'name': 'HL7 v2 Immunization Information System (IIS) Reporting Validation Tool','description': null,'retired': false},{'id': 12,'name': 'HL7v2 Electronic Laboratory Reporting Validation Tool','description': null,'retired': false},{'id': 20,'name': 'HL7v2 Electronic Laboratory Reporting Validation Tool','description': null,'retired': false},{'id': 6,'name': 'HL7 v2 Syndromic Surveillance Reporting Validation Tool','description': null,'retired': false},{'id': 8,'name': 'Cypress','description': null,'retired': false},{'id': 14,'name': 'HL7 CDA National Health Care Surveys Validator','description': null,'retired': false},{'id': 2,'name': 'HL7 CDA Cancer Registry Reporting Validation Tool','description': null,'retired': false}]},
        };

        beforeEach(function () {
            module('chpl.templates', 'chpl.mock', 'chpl');

            inject(function ($controller, _$log_, $rootScope, _Mock_) {
                $log = _$log_;
                Mock = _Mock_;

                scope = $rootScope.$new();
                vm = $controller('EditCertificationCriteriaController', {
                    cert: {},
                    resources: mock.resources,
                    hasIcs: false,
                    $uibModalInstance: Mock.modalInstance,
                    $scope: scope,
                });
                scope.$digest();
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(function (o) { return angular.toJson(o); }).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        it('should exist', function () {
            expect(vm).toBeDefined();
        });

        it('should have a way to close it\'s own modal', function () {
            expect(vm.cancel).toBeDefined();
            vm.cancel();
            expect(Mock.modalInstance.dismiss).toHaveBeenCalled();
        });

        it('should farm out to utilService for extendSelect', function () {
            var options = [];
            vm.extendSelect(options, 'val');
            expect(options).toEqual([{name: 'val'}]);
        });

        describe('when concerned with retired tools', function () {
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

        describe('when saving the certification', function () {
            it('should return the modal with the cert', function () {
                var aCert = {id: 1};
                vm.cert = aCert;
                vm.save();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith(aCert);
            });
        });
    });
})();
