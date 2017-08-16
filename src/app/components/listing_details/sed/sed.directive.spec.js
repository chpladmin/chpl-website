(function () {
    'use strict';

    describe('the SED Display', function () {
        var $log, $uibModal, Mock, actualOptions, el, scope, utilService, vm;

        beforeEach(function () {
            module('chpl.templates', 'chpl.mock', 'chpl', function ($provide) {
                $provide.decorator('utilService', function ($delegate) {
                    $delegate.makeCsv = jasmine.createSpy('makeCsv');
                    $delegate.sortCertArray = jasmine.createSpy('sortCertArray');
                    return $delegate;
                });
            });

            inject(function ($compile, _$log_, $rootScope, _$uibModal_, _Mock_, _utilService_) {
                $log = _$log_;
                Mock = _Mock_;
                utilService = _utilService_;
                utilService.makeCsv.and.returnValue();
                utilService.sortCertArray.and.callThrough();
                $uibModal = _$uibModal_;
                spyOn($uibModal, 'open').and.callFake(function (options) {
                    actualOptions = options;
                    return Mock.fakeModal;
                });

                el = angular.element('<ai-sed listing="listing"></ai-sed>');

                scope = $rootScope.$new();
                scope.listing = Mock.fullListings[1];
                $compile(el)(scope);
                scope.$digest();
                vm = el.isolateScope().vm;
                scope.vm = vm;
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(function (o) { return angular.toJson(o); }).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        describe('directive', function () {
            it('should be compiled', function () {
                expect(el.html()).not.toEqual(null);
            });
        });

        describe('controller', function () {
            it('should have isolate scope object with instanciate members', function () {
                expect(vm).toEqual(jasmine.any(Object));
                expect(vm.listing).toEqual(Mock.fullListings[1]);
            });

            describe('should use the util service', function () {
                it('to enable sorting of tasks', function () {
                    vm.sortTasks(vm.tasks[0]);
                    expect(utilService.sortCertArray).toHaveBeenCalledWith(['170.315 (b)(2)']);
                });

                it('to enable sorting of processes', function () {
                    vm.sortProcesses(vm.tasks[0]);
                    expect(utilService.sortCertArray).toHaveBeenCalledWith(['170.315 (b)(2)']);
                });

                it('to make a csv', function () {
                    vm.getCsv();
                    expect(utilService.makeCsv).toHaveBeenCalled();
                });
            });

            describe('during initialization', function () {
                it('should know how many criteria were sed tested', function () {
                    expect(vm.criteriaCount).toBeDefined();
                    expect(vm.criteriaCount).toBe(12);
                });

                it('should filter out criteria that were not successful or not sed', function () {
                    expect(vm.sedCriteria.length).toBe(12);
                });

                describe('with respect to tasks', function () {
                    it('should have an array of tasks pulled from the criteria', function () {
                        expect(vm.tasks.length).toBe(62);
                    });

                    it('should have the associated criteria attached to the tasks', function () {
                        expect(vm.tasks[0].criteria).toEqual(['170.315 (b)(2)']);
                    });

                    it('should know what the task length is', function () {
                        expect(vm.taskCount).toBeDefined();
                        expect(vm.taskCount).toBe(62);
                    });
                });

                describe('with respect to participants', function () {
                    it('should have an array of unique participants pulled from the criteria', function () {
                        expect(vm.allParticipants.length).toBe(51);
                    });

                    it('should have an array of taskIds associated with each participant', function () {
                        expect(vm.allParticipants[0].tasks).toEqual([940, 941, 941, 944, 948, 949, 950, 951, 953, 954, 955, 956, 959, 960, 961, 964, 965, 967, 968, 973, 974, 975, 980, 981, 982, 983, 984, 985, 986, 987, 998, 999, 1000, 1001, 1002]);
                    });
                });

                describe('with respect to ucd processes', function () {
                    it('should have an array of ucd processes that were used', function () {
                        expect(vm.ucdProcesses.length).toBe(1);
                    });

                    it('should associate the UCD Processes with multiple criteria', function () {
                        expect(vm.ucdProcesses[0].criteria).toEqual(['170.315 (a)(1)', '170.315 (a)(2)', '170.315 (a)(3)', '170.315 (a)(4)', '170.315 (a)(5)', '170.315 (a)(6)', '170.315 (a)(7)', '170.315 (a)(8)', '170.315 (a)(9)', '170.315 (a)(14)', '170.315 (b)(2)', '170.315 (b)(3)']);
                    });
                });

                describe('for the csv download', function () {
                    it('should create a data object with a name and a header row', function () {
                        expect(vm.csvData.name).toBe('15.04.04.2891.Alls.17.1.1.170512.sed.csv');
                        expect(vm.csvData.values[0]).toEqual([
                            'Unique CHPL ID', 'Developer', 'Product', 'Version', 'Certification Criteria',
                            'Task Description', 'Task Errors', 'Task Errors Standard Deviation', 'Path Deviation Observed', 'Path Deviation Optimal', 'Task Rating', 'Task Rating Standard Deviation', 'Rating Scale', 'Task Success Average', 'Task Success Standard Deviation', 'Time Average', 'Time Deviation Observed Average', 'Time Deviation Optimal Average', 'Time Standard Deviation',
                            'Age', 'Assistive Technology Needs', 'Computer Experience (Months)', 'Education Type', 'Gender', 'Occupation', 'Product Experience (Months)', 'Professional Experience (Months)',
                        ]);
                    });

                    it('should have data rows', function () {
                        expect(vm.csvData.values.length).toBe(1237);
                        expect(vm.csvData.values[1]).toEqual([
                            '15.04.04.2891.Alls.17.1.1.170512', 'Allscripts', 'Allscripts TouchWorks EHR', '17.1 GA', '170.315 (a)(1)',
                            'Change the medication to Azithromycin based on alert', null, 0, 13, 12, 3.9, 0.7, 'Likert', 100, 0, 196, 79, 120, 79,
                            '60-69', 'No', 360, 'Doctorate degree (e.g., MD, DNP, DMD, PhD)', 'Male', 'Family Practice Physician, Medical Informatics Officer', 96, 300,
                        ]);
                    });

                    it('should sort the rows by criteria', function () {
                        expect(vm.csvData.values[1][4]).toBe('170.315 (a)(1)');
                    });

                    it('should combine criteria under the same task', function () {
                        expect(vm.csvData.values[1236]).toEqual([
                            '15.04.04.2891.Alls.17.1.1.170512', 'Allscripts', 'Allscripts TouchWorks EHR', '17.1 GA', '170.315 (b)(2);170.315 (b)(2)',
                            'Reconcile Medications', null, 0, 14, 11, 3.1, 1, 'Likert', 85, 0, 219, 94, 120, 94,
                            '30-39', 'No', 180, 'Bachelor\'s degree', 'Female', 'Registered Nurse', 48, 60,
                        ]);
                    });
                });
            });
        });

        describe('when viewing Task details', function () {
            var modalOptions, participants, task;
            beforeEach(function () {
                modalOptions = {
                    templateUrl: 'app/components/listing_details/sed/taskModal.html',
                    controller: 'ViewSedTaskController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    resolve: {
                        criteria: jasmine.any(Function),
                        editMode: jasmine.any(Function),
                        participants: jasmine.any(Function),
                        task: jasmine.any(Function),
                    },
                };
                task = {
                    id: 1,
                    testTaskId: 3,
                };
                participants = [1,2,3];
                vm.allParticipants = participants;
            });

            it('should create a modal instance', function () {
                expect(vm.modalInstance).toBeUndefined();
                vm.viewTask(task);
                expect(vm.modalInstance).toBeDefined();
            });

            it('should resolve elements', function () {
                vm.editMode = 'on';
                vm.viewTask(task);
                expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
                expect(actualOptions.resolve.criteria()[0].number).toEqual('170.315 (b)(2)');
                expect(actualOptions.resolve.editMode()).toBe('on');
                expect(actualOptions.resolve.participants()).toEqual(participants);
                expect(actualOptions.resolve.task()).toEqual(task);
            });

            it('should replace the active task with an edited one on close', function () {
                var newTask = {
                    id: 'fake',
                    testTaskId: vm.tasks[1].testTaskId,
                };
                vm.viewTask(vm.tasks[1]);
                vm.modalInstance.close({
                    task: newTask,
                    participants: [1],
                });
                expect(vm.tasks[1]).toBe(newTask);
                expect(vm.allParticipants).toEqual([1]);
            });

            it('should remove the active task if it was deleted', function () {
                var initLength = vm.tasks.length;
                vm.viewTask(vm.tasks[1]);
                vm.modalInstance.close({
                    deleted: true,
                    participants: [1],
                });
                expect(vm.tasks.length).toBe(initLength - 1);
                expect(vm.allParticipants).toEqual([1]);
            });
        });

        describe('when adding a Task', function () {
            var modalOptions;
            beforeEach(function () {
                modalOptions = {
                    templateUrl: 'app/admin/components/sed/editTask.html',
                    controller: 'EditSedTaskController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    resolve: {
                        criteria: jasmine.any(Function),
                        participants: jasmine.any(Function),
                        task: jasmine.any(Function),
                    },
                };
            });

            it('should create a modal instance', function () {
                expect(vm.modalInstance).toBeUndefined();
                vm.addTask();
                expect(vm.modalInstance).toBeDefined();
            });

            it('should resolve elements', function () {
                vm.allParticipants = [1,2];
                vm.addTask();
                expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
                expect(actualOptions.resolve.criteria()[0].number).toEqual('170.315 (b)(2)');
                expect(actualOptions.resolve.participants()).toEqual([1,2]);
                expect(actualOptions.resolve.task()).toEqual({});
            });

            it('should add the new task to the list of tasks', function () {
                vm.tasks = [];
                vm.addTask();
                vm.modalInstance.close({task: 'new', participants: [2,3]});
                expect(vm.tasks).toEqual(['new']);
            });

            it('should update the list of participants', function () {
                vm.allParticipants = [1,2];
                vm.addTask();
                vm.modalInstance.close({task: 'new', participants: [2,3]});
                expect(vm.allParticipants).toEqual([2,3]);
            });
        });

        describe('when viewing Task Participants', function () {
            var modalOptions;
            beforeEach(function () {
                modalOptions = {
                    templateUrl: 'app/components/listing_details/sed/participantsModal.html',
                    controller: 'ViewSedParticipantsController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    resolve: {
                        allParticipants: jasmine.any(Function),
                        editMode: jasmine.any(Function),
                        participants: jasmine.any(Function),
                    },
                };
                vm.tasks = [
                    {
                        testTaskId: 1,
                        testParticipants: [1,2],
                    },
                    {
                        testTaskId: 2,
                        testParticipants: [3,4],
                    },
                ];
            });

            it('should create a modal instance', function () {
                expect(vm.modalInstance).toBeUndefined();
                vm.viewParticipants(vm.tasks[1]);
                expect(vm.modalInstance).toBeDefined();
            });

            it('should resolve elements', function () {
                vm.allParticipants = [1,2];
                vm.editMode = 'on';
                vm.viewParticipants(vm.tasks[1]);
                expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
                expect(actualOptions.resolve.allParticipants()).toEqual([1,2]);
                expect(actualOptions.resolve.editMode()).toBe('on');
                expect(actualOptions.resolve.participants()).toEqual([3,4]);
            });

            it('should replace the task participant list with an edited one on close', function () {
                var newParticipants = [1,2,3];
                vm.viewParticipants(vm.tasks[1]);
                vm.modalInstance.close({
                    participants: newParticipants,
                });
                expect(vm.tasks[1].testParticipants).toEqual(newParticipants);
            });

            it('should replace the "all participants" list with an edited one on close', function () {
                var newParticipants = [1,2,3];
                vm.allParticipants = [1,2];
                vm.viewParticipants(vm.tasks[1]);
                vm.modalInstance.close({
                    allParticipants: newParticipants,
                });
                expect(vm.allParticipants).toEqual(newParticipants);
            });
        });

        describe('when editing SED details', function () {
            var modalOptions;
            beforeEach(function () {
                modalOptions = {
                    templateUrl: 'app/admin/components/sed/editDetails.html',
                    controller: 'EditSedDetailsController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        listing: jasmine.any(Function),
                    },
                };
            });

            it('should create a modal instance', function () {
                expect(vm.modalInstance).toBeUndefined();
                vm.editDetails();
                expect(vm.modalInstance).toBeDefined();
            });

            it('should resolve elements', function () {
                vm.editDetails();
                expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
                expect(actualOptions.resolve.listing()).toEqual(vm.listing);
            });

            it('should replace the active listing with the edited one on close', function () {
                var newListing = {id: 'fake'};
                vm.editDetails();
                vm.modalInstance.close(newListing);
                expect(vm.listing).toEqual(newListing);
            });
        });
    });
})();
