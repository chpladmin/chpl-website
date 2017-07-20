(function () {
    'use strict';

    describe('the Certification Criteria Edit controller', function () {
        var $log, $uibModal, Mock, actualOptions, mock, scope, utilService, vm;

        mock = {};
        mock.resources = {
            testTools: {'expandable': false,'data': [{'id': 1,'name': 'ePrescribing Validation Tool','description': null,'retired': false},{'id': 15,'name': 'Transport Test Tool','description': null,'retired': true},{'id': 5,'name': 'HL7 v2 Laboratory Results Interface (LRI) Validation Tool','description': null,'retired': false},{'id': 11,'name': 'HL7v2 Syndromic Surveillance Test Suite','description': null,'retired': false},{'id': 9,'name': 'Direct Certificate Discovery Tool','description': null,'retired': false},{'id': 3,'name': 'HL7 v2 Electronic Laboratory Reporting (ELR) Validation Tool','description': null,'retired': false},{'id': 13,'name': 'Electronic Prescribing','description': null,'retired': false},{'id': 16,'name': 'Edge Test Tool','description': null,'retired': false},{'id': 7,'name': 'Transport Testing Tool','description': null,'retired': true},{'id': 17,'name': '2015 Direct Certificate Discovery Tool','description': null,'retired': false},{'id': 10,'name': 'HL7v2 Immunization Test Suite','description': null,'retired': false},{'id': 4,'name': 'HL7 v2 Immunization Information System (IIS) Reporting Validation Tool','description': null,'retired': false},{'id': 12,'name': 'HL7v2 Electronic Laboratory Reporting Validation Tool','description': null,'retired': false},{'id': 20,'name': 'HL7v2 Electronic Laboratory Reporting Validation Tool','description': null,'retired': false},{'id': 6,'name': 'HL7 v2 Syndromic Surveillance Reporting Validation Tool','description': null,'retired': false},{'id': 8,'name': 'Cypress','description': null,'retired': false},{'id': 14,'name': 'HL7 CDA National Health Care Surveys Validator','description': null,'retired': false},{'id': 2,'name': 'HL7 CDA Cancer Registry Reporting Validation Tool','description': null,'retired': false}]},
        };

        beforeEach(function () {
            module('chpl.templates', 'chpl.mock', 'chpl', function ($provide) {
                $provide.decorator('utilService', function ($delegate) {
                    $delegate.extendSelect = jasmine.createSpy('extendSelect');
                    return $delegate;
                });
            });

            inject(function ($controller, _$log_, $rootScope, _$uibModal_, _Mock_, _utilService_) {
                $log = _$log_;
                Mock = _Mock_;
                utilService = _utilService_;
                utilService.extendSelect.and.returnValue([]);
                $uibModal = _$uibModal_;
                spyOn($uibModal, 'open').and.callFake(function (options) {
                    actualOptions = options;
                    return Mock.fakeModal;
                });

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
            vm.extendSelect([], 'val');
            expect(utilService.extendSelect).toHaveBeenCalledWith([], 'val');
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

        describe('when adding a value to an array', function () {
            it('should create the array if necessary', function () {
                var array, object;
                object = {id: 1};
                array = vm.addNewValue(array, object);
                expect(array).toEqual([object]);
            });

            it('should not add an undefined or empty object', function () {
                var array, object;
                array = [];
                array = vm.addNewValue(array, object);
                expect(array).toEqual([]);
                object = {};
                array = vm.addNewValue(array, object);
                expect(array).toEqual([]);
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

        describe('when adding an SED Task', function () {
            var modalOptions;
            beforeEach(function () {
                modalOptions = {
                    templateUrl: 'app/components/listingDetails/sed/taskModal.html',
                    controller: 'EditSedTaskController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    resolve: {
                        task: jasmine.any(Function),
                    },
                };
            });

            it('should create a modal instance', function () {
                expect(vm.editUibModalInstance).toBeUndefined();
                vm.addTask();
                expect(vm.editUibModalInstance).toBeDefined();
            });

            it('should resolve elements', function () {
                vm.addTask();
                expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
                expect(actualOptions.resolve.task()).toEqual({ task: {}});
            });

            it('should push the result to the list of tasks', function () {
                vm.cert.testTasks = [];
                vm.addTask();
                vm.editUibModalInstance.close({});
                expect(vm.cert.testTasks).toEqual([{}]);
            });

            it('should create an array of tasks if it is undefined', function () {
                vm.addTask();
                vm.editUibModalInstance.close({});
                expect(vm.cert.testTasks).toEqual([{}]);
            });

            it('should create an array of tasks if it is null', function () {
                vm.cert.testTasks = null;
                vm.addTask();
                vm.editUibModalInstance.close({});
                expect(vm.cert.testTasks).toEqual([{}]);
            });

            it('should log a non-cancelled modal', function () {
                var logCount = $log.info.logs.length;
                vm.addTask();
                vm.editUibModalInstance.dismiss('not cancelled');
                expect($log.info.logs.length).toBe(logCount + 1);
            });

            it('should not log a cancelled modal', function () {
                var logCount = $log.info.logs.length;
                vm.addTask();
                vm.editUibModalInstance.dismiss('cancelled');
                expect($log.info.logs.length).toBe(logCount);
            });
        });

        describe('when editing a Task', function () {
            var modalOptions, task;
            beforeEach(function () {
                modalOptions = {
                    templateUrl: 'app/components/listingDetails/sed/taskModal.html',
                    controller: 'EditSedTaskController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    resolve: {
                        task: jasmine.any(Function),
                    },
                };
                task = {};
                vm.cert.testTasks = [{}];
            });

            it('should create a modal instance', function () {
                expect(vm.editUibModalInstance).toBeUndefined();
                vm.editTask(task, 0);
                expect(vm.editUibModalInstance).toBeDefined();
            });

            it('should resolve elements', function () {
                vm.editTask(task, 0);
                expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
                expect(actualOptions.resolve.task()).toEqual({ task: task});
            });

            it('should replace the task with the response', function () {
                vm.editTask(task, 0);
                vm.editUibModalInstance.close({name: 'new'});
                expect(vm.cert.testTasks).toEqual([{name: 'new'}]);
            });

            it('should log a non-cancelled modal', function () {
                var logCount = $log.info.logs.length;
                vm.editTask(task, 0);
                vm.editUibModalInstance.dismiss('not cancelled');
                expect($log.info.logs.length).toBe(logCount + 1);
            });

            it('should not log a cancelled modal', function () {
                var logCount = $log.info.logs.length;
                vm.editTask(task, 0);
                vm.editUibModalInstance.dismiss('cancelled');
                expect($log.info.logs.length).toBe(logCount);
            });
        });

        describe('when removing a task', function () {
            it('should remove the indicated one', function () {
                vm.cert.testTasks = [0, 1, 2];
                vm.removeTask(1);
                expect(vm.cert.testTasks).toEqual([0, 2]);
            });
        });
    });
})();
