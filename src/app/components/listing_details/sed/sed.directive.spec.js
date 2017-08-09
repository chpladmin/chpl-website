(function () {
    'use strict';

    describe('the SED Display', function () {

        var $log, $uibModal, Mock, actualOptions, el, scope, utilService, vm;

        beforeEach(function () {
            module('chpl.templates', 'chpl.mock', 'chpl', function ($provide) {
                $provide.decorator('utilService', function ($delegate) {
                    $delegate.sortCert = jasmine.createSpy('sortCert');
                    $delegate.sortCerts = jasmine.createSpy('sortCerts');
                    return $delegate;
                });
            });

            inject(function ($compile, _$log_, $rootScope, _$uibModal_, _Mock_, _utilService_) {
                $log = _$log_;
                Mock = _Mock_;
                utilService = _utilService_;
                utilService.sortCert.and.returnValue(0);
                utilService.sortCerts.and.returnValue(56);
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

            it('should have an array of tasks pulled from the criteria', function () {
                expect(vm.tasks.length).toBeGreaterThan(0);
            });

            it('should have the associated criteria attached to the tasks', function () {
                expect(vm.tasks[0].criteria).toEqual(['170.315 (b)(2)']);
            });

            it('should farm out cert sorting to the util service', function () {
                vm.sortCert('');
                expect(utilService.sortCert).toHaveBeenCalled();
            });

            it('should farm out certs sorting to the util service', function () {
                vm.sortCerts(vm.tasks[0]);
                expect(utilService.sortCerts).toHaveBeenCalledWith(['170.315 (b)(2)']);
            });

            it('should return the sorting value to the caller', function () {
                var val = vm.sortCerts(vm.tasks[0]);
                expect(val).toBe(56);
            });

            it('should know what the task length is', function () {
                expect(vm.taskCount).toBeDefined();
                expect(vm.taskCount).toBe(62);
            });
        });

        describe('when viewing Task details', function () {
            var modalOptions, task;
            beforeEach(function () {
                modalOptions = {
                    templateUrl: 'app/components/listing_details/sed/view/taskModal.html',
                    controller: 'ViewSedTaskController',
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
            });

            it('should create a modal instance', function () {
                expect(vm.modalInstance).toBeUndefined();
                vm.viewDetails(task);
                expect(vm.modalInstance).toBeDefined();
            });

            it('should resolve elements', function () {
                vm.viewDetails(task);
                expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
                expect(actualOptions.resolve.task()).toEqual(task);
            });
        });

        describe('when viewing Task Participants', function () {
            var modalOptions, task;
            beforeEach(function () {
                modalOptions = {
                    templateUrl: 'app/components/listing_details/sed/view/participantsModal.html',
                    controller: 'ViewSedParticipantsController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    resolve: {
                        participants: jasmine.any(Function),
                    },
                };
                task = {testParticipants: []};
            });

            it('should create a modal instance', function () {
                expect(vm.modalInstance).toBeUndefined();
                vm.viewParticipants(task);
                expect(vm.modalInstance).toBeDefined();
            });

            it('should resolve elements', function () {
                vm.viewParticipants(task);
                expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
                expect(actualOptions.resolve.participants()).toEqual([]);
            });
        });
    });
})();
