(function () {
    'use strict';

    describe('the Announcement Management View', function () {
        var $compile, $log, $q, $uibModal, Mock, actualOptions, el, networkService, scope, vm;

        beforeEach(function () {
            module('chpl.templates', 'chpl.admin', 'chpl.mock', function ($provide) {
                $provide.decorator('networkService', function ($delegate) {
                    $delegate.getAnnouncements = jasmine.createSpy('getAnnouncements');
                    return $delegate;
                });
            });

            inject(function (_$compile_, _$log_, _$q_, $rootScope, _$uibModal_, _Mock_, _networkService_) {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                Mock = _Mock_;
                $uibModal = _$uibModal_;
                spyOn($uibModal, 'open').and.callFake(function (options) {
                    actualOptions = options;
                    return Mock.fakeModal;
                });
                networkService = _networkService_;
                networkService.getAnnouncements.and.returnValue($q.when({}));

                el = angular.element('<ai-announcements-management></ai-announcements-management>');
                scope = $rootScope.$new();
                $compile(el)(scope);
                scope.$digest();
                vm = el.isolateScope().vm;
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
            });

            it('should load announcements on activation', function () {
                expect(networkService.getAnnouncements).toHaveBeenCalled();
            });

            it('should log an error on announcement load', function () {
                var logCount = $log.info.logs.length;
                networkService.getAnnouncements.and.returnValue($q.reject({}));
                vm.loadAnnouncements();
                scope.$digest();
                expect($log.info.logs.length).toBe(logCount + 1);
            });

            describe('when creating an announcement', function () {
                var modalOptions;
                beforeEach(function () {
                    modalOptions = {
                        templateUrl: 'app/admin/components/announcements/edit.html',
                        controller: 'AnnouncementEditController',
                        controllerAs: 'vm',
                        animation: false,
                        backdrop: 'static',
                        keyboard: false,
                        resolve: {
                            action: jasmine.any(Function),
                            announcement: jasmine.any(Function),
                        },
                    };
                });

                it('should create a modal instance', function () {
                    expect(vm.modalInstance).toBeUndefined();
                    vm.create();
                    expect(vm.modalInstance).toBeDefined();
                });

                it('should resolve elements', function () {
                    vm.create();
                    expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
                    expect(actualOptions.resolve.action()).toEqual('create');
                    expect(actualOptions.resolve.announcement()).toEqual({});
                });

                it('should create an announcement array if required', function () {
                    vm.create();
                    vm.modalInstance.close({name: 'new'});
                    expect(vm.announcements).toEqual([{name: 'new'}]);
                });

                it('should push the reponse into the announcement array', function () {
                    vm.announcements = [];
                    vm.create();
                    vm.modalInstance.close({name: 'new'});
                    expect(vm.announcements).toEqual([{name: 'new'}]);
                });

                it('should log a non-cancelled modal', function () {
                    var logCount = $log.info.logs.length;
                    vm.create();
                    vm.modalInstance.dismiss('not cancelled');
                    expect($log.info.logs.length).toBe(logCount + 1);
                    expect(vm.errorMessage).toBe('not cancelled');
                });

                it('should not log a cancelled modal', function () {
                    var logCount = $log.info.logs.length;
                    vm.create();
                    vm.modalInstance.dismiss('cancelled');
                    expect($log.info.logs.length).toBe(logCount);
                });
            });

            describe('when editing an announcement', function () {
                var modalOptions;
                beforeEach(function () {
                    modalOptions = {
                        templateUrl: 'app/admin/components/announcements/edit.html',
                        controller: 'AnnouncementEditController',
                        controllerAs: 'vm',
                        animation: false,
                        backdrop: 'static',
                        keyboard: false,
                        resolve: {
                            action: jasmine.any(Function),
                            announcement: jasmine.any(Function),
                        },
                    };
                    vm.announcements = [{id: 1}, {id: 2}];
                });

                it('should create a modal instance', function () {
                    expect(vm.modalInstance).toBeUndefined();
                    vm.edit(vm.announcements[1], 1);
                    expect(vm.modalInstance).toBeDefined();
                });

                it('should resolve elements', function () {
                    vm.edit(vm.announcements[1], 1);
                    expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
                    expect(actualOptions.resolve.action()).toEqual('edit');
                    expect(actualOptions.resolve.announcement()).toEqual(vm.announcements[1]);
                });

                it('should replace the original with the response', function () {
                    vm.edit(vm.announcements[1], 1);
                    vm.modalInstance.close({name: 'new'});
                    expect(vm.announcements[1]).toEqual({name: 'new'});
                });

                it('should remove the announcement if deleted', function () {
                    vm.edit(vm.announcements[1], 1);
                    vm.modalInstance.close('deleted');
                    expect(vm.announcements[1]).toBeUndefined();
                });

                it('should log a non-cancelled modal', function () {
                    var logCount = $log.info.logs.length;
                    vm.edit(vm.announcements[1], 1);
                    vm.modalInstance.dismiss('not cancelled');
                    expect($log.info.logs.length).toBe(logCount + 1);
                    expect(vm.errorMessage).toBe('not cancelled');
                });

                it('should not log a cancelled modal', function () {
                    var logCount = $log.info.logs.length;
                    vm.edit(vm.announcements[1], 1);
                    vm.modalInstance.dismiss('cancelled');
                    expect($log.info.logs.length).toBe(logCount);
                });
            });
        });
    });
})();
