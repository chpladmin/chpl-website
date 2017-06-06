(function () {
    'use strict';

    describe('admin.announcements.edit.controller', function () {
        var vm, scope, $log, $q, authService, commonService, mock, Mock;

        mock = {};
        mock.announcement = {
            startDate: 1490631134315,
            endDate: 1490631434315,
        }

        beforeEach(function () {
            module('chpl.mock', 'chpl.admin', function ($provide) {
                $provide.decorator('authService', function ($delegate) {
                    $delegate.isChplAdmin = jasmine.createSpy('isChplAdmin');
                    return $delegate;
                });
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.createAnnouncement = jasmine.createSpy('createAnnouncement');
                    $delegate.deleteAnnouncement = jasmine.createSpy('deleteAnnouncement');
                    $delegate.modifyAnnouncement = jasmine.createSpy('modifyAnnouncement');
                    return $delegate;
                });
            });

            inject(function ($controller, _$log_, _$q_, $rootScope, _Mock_, _authService_, _commonService_) {
                $log = _$log_;
                Mock = _Mock_;
                $q = _$q_;
                authService = _authService_;
                authService.isChplAdmin.and.returnValue(true);
                commonService = _commonService_;
                commonService.createAnnouncement.and.returnValue($q.when({status: 200}));
                commonService.deleteAnnouncement.and.returnValue($q.when({status: 200}));
                commonService.modifyAnnouncement.and.returnValue($q.when({status: 200}));

                scope = $rootScope.$new();
                vm = $controller('AnnouncementEditController', {
                    announcement: mock.announcement,
                    action: 'edit',
                    authService: authService,
                    commonService: commonService,
                    $uibModalInstance: Mock.modalInstance,
                    $scope: scope,
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

            it('should have some starting values', function () {
                expect(vm.isChplAdmin).toBe(true);
                expect(vm.announcement.startDate).toEqual(new Date(mock.announcement.startDate));
                expect(vm.announcement.endDate).toEqual(new Date(mock.announcement.endDate));
            });

            it('should have a way to close the modal', function () {
                expect(vm.cancel).toBeDefined();
                vm.cancel();
                expect(Mock.modalInstance.dismiss).toHaveBeenCalled();
            });
        });

        it('should know if the dates are invalid', function () {
            expect(vm.datesInvalid()).toBe(false);
            vm.announcement.startDate = new Date(1490000000000);
            vm.announcement.endDate = new Date(1480000000000);
            expect(vm.datesInvalid()).toBe(true); // end date before start date
            delete(vm.announcement.startDate);
            expect(vm.datesInvalid()).toBe(false); // can't check if only have one date
            vm.announcement.startDate = new Date(1490000000000);
            delete(vm.announcement.endDate);
            expect(vm.datesInvalid()).toBe(false); // can't check if only have one date
        });

        describe('modifying announcements', function () {
            it('should call the common service', function () {
                vm.save();
                scope.$digest();
                expect(commonService.modifyAnnouncement).toHaveBeenCalled();
            });

            it('should close the modal', function () {
                vm.save();
                scope.$digest();
                expect(Mock.modalInstance.close).toHaveBeenCalled();
            });

            it('should dismiss the modal on error', function () {
                commonService.modifyAnnouncement.and.returnValue($q.when({status: 500}));
                vm.save();
                scope.$digest();
                expect(Mock.modalInstance.dismiss).toHaveBeenCalled();
            });

            it('should dismiss the modal on error', function () {
                commonService.modifyAnnouncement.and.returnValue($q.reject({data: {error: 'bad thing'}}));
                vm.save();
                scope.$digest();
                expect(Mock.modalInstance.dismiss).toHaveBeenCalledWith('bad thing');
            });
        });

        describe('creating announcements', function () {
            it('should call the common service', function () {
                vm.create();
                scope.$digest();
                expect(commonService.createAnnouncement).toHaveBeenCalled();
            });

            it('should close the modal', function () {
                vm.create();
                scope.$digest();
                expect(Mock.modalInstance.close).toHaveBeenCalled();
            });

            it('should dismiss the modal on error', function () {
                commonService.createAnnouncement.and.returnValue($q.when({status: 500}));
                vm.create();
                scope.$digest();
                expect(Mock.modalInstance.dismiss).toHaveBeenCalled();
            });

            it('should dismiss the modal on error', function () {
                commonService.createAnnouncement.and.returnValue($q.reject({data: {error: 'bad thing'}}));
                vm.create();
                scope.$digest();
                expect(Mock.modalInstance.dismiss).toHaveBeenCalledWith('bad thing');
            });
        });

        describe('deleting announcements', function () {
            it('should call the common service', function () {
                vm.deleteAnnouncement();
                scope.$digest();
                expect(commonService.deleteAnnouncement).toHaveBeenCalled();
            });

            it('should close the modal', function () {
                vm.deleteAnnouncement();
                scope.$digest();
                expect(Mock.modalInstance.close).toHaveBeenCalled();
            });

            it('should dismiss the modal on error', function () {
                commonService.deleteAnnouncement.and.returnValue($q.when({status: 500}));
                vm.deleteAnnouncement();
                scope.$digest();
                expect(Mock.modalInstance.dismiss).toHaveBeenCalled();
            });

            it('should dismiss the modal on error', function () {
                commonService.deleteAnnouncement.and.returnValue($q.reject({data: {error: 'bad thing'}}));
                vm.deleteAnnouncement();
                scope.$digest();
                expect(Mock.modalInstance.dismiss).toHaveBeenCalledWith('bad thing');
            });
        });
    });
})();
