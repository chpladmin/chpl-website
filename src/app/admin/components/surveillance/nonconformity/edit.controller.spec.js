(function () {
    'use strict';

    describe('the Nonconformity Edit controller', function () {
        var $controller, $log, $q, Mock, authService, networkService, scope, vm;

        beforeEach(function () {
            module('chpl.mock', 'chpl.admin', function ($provide) {
                $provide.decorator('authService', function ($delegate) {
                    $delegate.getApiKey = jasmine.createSpy('getApiKey');
                    $delegate.getToken = jasmine.createSpy('getToken');
                    return $delegate;
                });
                $provide.decorator('networkService', function ($delegate) {
                    $delegate.deleteSurveillanceDocument = jasmine.createSpy('deleteSurveillanceDocument');
                    return $delegate;
                });
            });

            inject(function (_$controller_, _$log_, _$q_, $rootScope, _Mock_, _authService_, _networkService_) {
                $controller = _$controller_;
                $log = _$log_;
                $q = _$q_;
                Mock = _Mock_;
                authService = _authService_;
                authService.getApiKey.and.returnValue('api key');
                authService.getToken.and.returnValue('token');
                networkService = _networkService_;
                networkService.deleteSurveillanceDocument.and.returnValue($q.when({}));

                scope = $rootScope.$new();
                vm = $controller('EditNonconformityController', {
                    surveillance: Mock.surveillances[0],
                    surveillanceTypes: {},
                    disableValidation: false,
                    nonconformity: {},
                    randomized: false,
                    requirementId: 1,
                    surveillanceId: 1,
                    workType: 'create',
                    $uibModalInstance: Mock.modalInstance,
                    $scope: scope,
                });
                scope.$digest();
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.debug('\n Debug: ' + $log.debug.logs.join('\n Debug: '));
                /* eslint-enable no-console,angular/log */
            }
        });

        it('should exist', function () {
            expect(vm).toBeDefined();
        });

        it('should be able close it\'s own modal', function () {
            expect(vm.cancel).toBeDefined();
            vm.cancel();
            expect(Mock.modalInstance.dismiss).toHaveBeenCalled();
        });

        it('should convert dateTime longs to javascript objects on load', function () {
            var aDate = new Date('1/1/2003');
            var nc = {
                dateOfDetermination: aDate.getTime(),
                capApprovalDate: aDate.getTime(),
                capStartDate: aDate.getTime(),
                capEndDate: aDate.getTime(),
                capMustCompleteDate: aDate.getTime(),
            };
            vm = $controller('EditNonconformityController', {
                surveillance: Mock.surveillances[0],
                surveillanceTypes: {},
                disableValidation: false,
                nonconformity: nc,
                randomized: false,
                requirementId: 1,
                surveillanceId: 1,
                workType: 'create',
                $uibModalInstance: Mock.modalInstance,
                $scope: scope,
            });
            scope.$digest();
            expect(vm.nonconformity.dateOfDeterminationObject).toEqual(aDate);
            expect(vm.nonconformity.capApprovalDateObject).toEqual(aDate);
            expect(vm.nonconformity.capStartDateObject).toEqual(aDate);
            expect(vm.nonconformity.capEndDateObject).toEqual(aDate);
            expect(vm.nonconformity.capMustCompleteDateObject).toEqual(aDate);
        });

        it('should convert ncType and statuses to objects on load', function () {
            var nc = {
                nonconformityType: {id: 1},
                status: {id: 2},
            };
            var data = {
                nonconformityTypes: {data: [{id: 1, name: 'something'}]},
                nonconformityStatusTypes: {data: [{id: 1, name: 'name1'},{id: 2, name: 'name2'}]},
            };
            vm = $controller('EditNonconformityController', {
                surveillance: Mock.surveillances[0],
                surveillanceTypes: data,
                disableValidation: false,
                nonconformity: nc,
                randomized: false,
                requirementId: 1,
                surveillanceId: 1,
                workType: 'create',
                $uibModalInstance: Mock.modalInstance,
                $scope: scope,
            });
            scope.$digest();
            expect(vm.nonconformity.nonconformityType).toBe(data.nonconformityTypes.data[0]);
            expect(vm.nonconformity.status).toBe(data.nonconformityStatusTypes.data[1]);
        });

        describe('when editing the FileUploader', function () {
            beforeEach(function () {
                vm = $controller('EditNonconformityController', {
                    surveillance: Mock.surveillances[0],
                    surveillanceTypes: {},
                    disableValidation: false,
                    nonconformity: {},
                    randomized: false,
                    requirementId: 1,
                    surveillanceId: 1,
                    workType: 'edit',
                    $uibModalInstance: Mock.modalInstance,
                    $scope: scope,
                });
                scope.$digest();
            });

            it('should exist', function () {
                expect(vm.uploader).toBeDefined();
            });

            it('should log results', function () {
                var logCount = $log.info.logs.length;
                vm.uploader.onCompleteItem();
                expect($log.info.logs.length).toBe(logCount + 1);
                vm.uploader.onErrorItem();
                expect($log.info.logs.length).toBe(logCount + 2);
                vm.uploader.onCancelItem();
                expect($log.info.logs.length).toBe(logCount + 3);
            });

            it('should mark the uploaded document as pending', function () {
                vm.nonconformity.documents = [];
                vm.uploader.onSuccessItem({file: {name: 'a name'}});
                expect(vm.nonconformity.documents[0]).toEqual({fileName: 'a name is pending'});
            });
        });

        describe('when deleting a document', function () {
            beforeEach(function () {
                vm.surveillanceId = 1;
                vm.nonconformity = {id: 2};
                vm.nonconformity.documents = [
                    {id: 1},
                    {id: 2},
                    {id: 3},
                ];
            });

            it('should call the common service', function () {
                vm.deleteDoc(3);
                scope.$digest();
                expect(networkService.deleteSurveillanceDocument).toHaveBeenCalledWith(1, 3);
            });

            it('should remove the deleted document from the list', function () {
                vm.deleteDoc(3);
                scope.$digest();
                expect(vm.nonconformity.documents.length).toBe(2);
            });
        });

        describe('when saving the nonconformity', function () {
            it('should convert date objects to longs', function () {
                var aDate = new Date('1/1/2003');
                vm.nonconformity = {
                    dateOfDeterminationObject: aDate,
                    capApprovalDateObject: aDate,
                    capStartDateObject: aDate,
                    capEndDateObject: aDate,
                    capMustCompleteDateObject: aDate,
                };
                expect(vm.nonconformity.dateOfDetermination).toBeUndefined();
                expect(vm.nonconformity.capApprovalDate).toBeUndefined();
                expect(vm.nonconformity.capStartDate).toBeUndefined();
                expect(vm.nonconformity.capEndDate).toBeUndefined();
                expect(vm.nonconformity.capMustCompleteDate).toBeUndefined();
                vm.save();
                expect(vm.nonconformity.dateOfDetermination).toBe(aDate.getTime());
                expect(vm.nonconformity.capApprovalDate).toBe(aDate.getTime());
                expect(vm.nonconformity.capStartDate).toBe(aDate.getTime());
                expect(vm.nonconformity.capEndDate).toBe(aDate.getTime());
                expect(vm.nonconformity.capMustCompleteDate).toBe(aDate.getTime());
            });

            it('should remove date values if no object exists', function () {
                vm.nonconformity = {
                    dateOfDetermination: 'fake',
                    capApprovalDate: 'fake',
                    capStartDate: 'fake',
                    capEndDate: 'fake',
                    capMustCompleteDate: 'fake',
                };
                vm.save();
                expect(vm.nonconformity.dateOfDetermination).toBe(null);
                expect(vm.nonconformity.capApprovalDate).toBe(null);
                expect(vm.nonconformity.capStartDate).toBe(null);
                expect(vm.nonconformity.capEndDate).toBe(null);
                expect(vm.nonconformity.capMustCompleteDate).toBe(null);
            });

            it('should close it\'s modal with the NC', function () {
                vm.nonconformity = {id: 'an NC'};
                vm.save();
                expect(Mock.modalInstance.close).toHaveBeenCalled();
            });
        });
    });
})();
