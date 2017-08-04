(function () {
    'use strict';

    describe('the Surveillance Edit controller', function () {
        var $controller, $log, $q, $uibModal, Mock, actualOptions, authService, networkService, scope, utilService, vm;

        beforeEach(function () {
            module('chpl.mock', 'chpl.admin', function ($provide) {
                $provide.decorator('authService', function ($delegate) {
                    $delegate.isAcbAdmin = jasmine.createSpy('isAcbAdmin');
                    $delegate.isAcbStaff = jasmine.createSpy('isAcbStaff');
                    $delegate.isChplAdmin = jasmine.createSpy('isChplAdmin');
                    return $delegate;
                });
                $provide.decorator('networkService', function ($delegate) {
                    $delegate.deleteSurveillance = jasmine.createSpy('deleteSurveillance');
                    $delegate.initiateSurveillance = jasmine.createSpy('initiateSurveillance');
                    $delegate.updateSurveillance = jasmine.createSpy('updateSurveillance');
                    return $delegate;
                });
                $provide.decorator('utilService', function ($delegate) {
                    $delegate.sortRequirements = jasmine.createSpy('sortRequirements');
                    return $delegate;
                });
            });

            inject(function (_$controller_, _$log_, _$q_, $rootScope, _$uibModal_, _Mock_, _authService_, _networkService_, _utilService_) {
                $controller = _$controller_;
                $log = _$log_;
                $q = _$q_;
                authService = _authService_;
                authService.isAcbAdmin.and.returnValue(false);
                authService.isAcbStaff.and.returnValue(false);
                authService.isChplAdmin.and.returnValue(false);
                networkService = _networkService_;
                networkService.deleteSurveillance.and.returnValue($q.when({}));
                networkService.initiateSurveillance.and.returnValue($q.when({}));
                networkService.updateSurveillance.and.returnValue($q.when({}));
                utilService = _utilService_;
                utilService.sortRequirements.and.returnValue(1);
                Mock = _Mock_;
                $uibModal = _$uibModal_;
                spyOn($uibModal, 'open').and.callFake(function (options) {
                    actualOptions = options;
                    return Mock.fakeModal;
                });

                scope = $rootScope.$new();
                vm = $controller('EditSurveillanceController', {
                    surveillance: Mock.surveillances[0],
                    surveillanceTypes: Mock.surveillanceData,
                    workType: 'edit',
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

        describe('during activation', function () {
            it('should provide authorities', function () {
                // base line
                expect(vm.authorities).toEqual([]);
                expect(typeof(vm.surveillance.startDateObject)).toBe('object');
                expect(typeof(vm.surveillance.endDateObject)).toBe('undefined');
                expect(vm.surveillance.type).toBeDefined();

                var newSurv = angular.copy(Mock.surveillances[0]);
                newSurv.endDate = angular.copy(newSurv.startDate);
                newSurv.startDate = undefined;
                newSurv.type = undefined;
                authService.isAcbAdmin.and.returnValue(true);
                authService.isAcbStaff.and.returnValue(true);
                authService.isChplAdmin.and.returnValue(true);
                vm = $controller('EditSurveillanceController', {
                    surveillance: newSurv,
                    surveillanceTypes: Mock.surveillanceData,
                    workType: 'edit',
                    $uibModalInstance: Mock.modalInstance,
                    $scope: scope,
                });
                scope.$digest();
                expect(vm.authorities).toEqual(['ROLE_ACB_ADMIN', 'ROLE_ACB_STAFF', 'ROLE_ADMIN']);
                expect(typeof(vm.surveillance.startDateObject)).toBe('undefined');
                expect(typeof(vm.surveillance.endDateObject)).toBe('object');
                expect(vm.surveillance.type).toBeUndefined();
            });
        });

        describe('when adding a new requirement', function () {
            var modalOptions;
            beforeEach(function () {
                modalOptions = {
                    templateUrl: 'app/admin/components/surveillance/requirement/edit.html',
                    controller: 'EditRequirementController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    resolve: {
                        disableValidation: jasmine.any(Function),
                        randomized: jasmine.any(Function),
                        requirement: jasmine.any(Function),
                        surveillanceId: jasmine.any(Function),
                        surveillanceTypes: jasmine.any(Function),
                        workType: jasmine.any(Function),
                    },
                };
            });

            it('should create a modal instance', function () {
                expect(vm.modalInstance).toBeUndefined();
                vm.addRequirement();
                expect(vm.modalInstance).toBeDefined();
            });

            it('should resolve elements on that modal', function () {
                vm.addRequirement();
                expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
                expect(actualOptions.resolve.disableValidation()).toBe(false);
                expect(actualOptions.resolve.randomized()).toBe(false);
                expect(actualOptions.resolve.requirement()).toEqual({nonconformities: []});
                expect(actualOptions.resolve.surveillanceId()).toEqual(Mock.surveillances[0].id);
                expect(actualOptions.resolve.surveillanceTypes()).toEqual(Mock.surveillanceData);
                expect(actualOptions.resolve.workType()).toEqual('add');
            });

            it('should create an array of requirements if one doesn\'t exist', function () {
                vm.surveillance.requirements = undefined;
                vm.addRequirement();
                vm.modalInstance.close({});
                expect(vm.surveillance.requirements.length).toBe(1);
            });

            it('should append the response to the array of requirements', function () {
                var reqCount = vm.surveillance.requirements.length;
                vm.addRequirement();
                vm.modalInstance.close({});
                expect(vm.surveillance.requirements.length).toBe(reqCount + 1);
            });

            it('should log a non-closed modal', function () {
                var logCount = $log.info.logs.length;
                vm.addRequirement();
                vm.modalInstance.dismiss('string');
                expect($log.info.logs.length).toBe(logCount + 1);
            });
        });

        describe('when deleting requirements', function () {
            it('should be able to remove requirements', function () {
                vm.surveillance.requirements = [
                    {id: 1, type: 'fake'},
                    {id: 2, type: 'fake2'},
                ];
                vm.deleteRequirement({id: 2, type: 'fake2'});
                expect(vm.surveillance.requirements).toEqual([{id: 1, type: 'fake'}]);
            });
        });

        describe('when deleting the surveillance', function () {
            it('should close it\'s own modal on a status:200 response', function () {
                networkService.deleteSurveillance.and.returnValue($q.when({status: 200}));
                vm.deleteSurveillance();
                scope.$digest();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({status: 200});
            });

            it('should close it\'s own modal if no status in the response', function () {
                networkService.deleteSurveillance.and.returnValue($q.when({}));
                vm.deleteSurveillance();
                scope.$digest();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({});
            });

            it('should close it\'s own modal if status is an object in the response', function () {
                networkService.deleteSurveillance.and.returnValue($q.when({status: {status: 'OK'}}));
                vm.deleteSurveillance();
                scope.$digest();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({status: {status: 'OK'}});
            });

            it('should report errors if status has errors', function () {
                networkService.deleteSurveillance.and.returnValue($q.when({status: 'bad'}));
                vm.deleteSurveillance();
                scope.$digest();
                expect(vm.errorMessages).toEqual([{status: 'bad'}]);
            });

            it('should report errors if request fails', function () {
                networkService.deleteSurveillance.and.returnValue($q.reject({statusText: 'errors'}));
                vm.deleteSurveillance();
                scope.$digest();
                expect(vm.errorMessages).toEqual(['errors']);
            });
        });

        describe('when editing a requirement', function () {
            var modalOptions;
            beforeEach(function () {
                modalOptions = {
                    templateUrl: 'app/admin/components/surveillance/requirement/edit.html',
                    controller: 'EditRequirementController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    resolve: {
                        disableValidation: jasmine.any(Function),
                        randomized: jasmine.any(Function),
                        requirement: jasmine.any(Function),
                        surveillanceId: jasmine.any(Function),
                        surveillanceTypes: jasmine.any(Function),
                        workType: jasmine.any(Function),
                    },
                };
                vm.surveillance.requirements = [
                    {id: 1, type: 'fake'},
                    {id: 2, type: 'fake2'},
                ];
            });

            it('should create a modal instance', function () {
                expect(vm.modalInstance).toBeUndefined();
                vm.editRequirement(vm.surveillance.requirements[1]);
                expect(vm.modalInstance).toBeDefined();
            });

            it('should resolve elements on that modal', function () {
                vm.editRequirement(vm.surveillance.requirements[1]);
                expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
                expect(actualOptions.resolve.disableValidation()).toBe(false);
                expect(actualOptions.resolve.randomized()).toBe(false);
                expect(actualOptions.resolve.requirement()).toEqual(vm.surveillance.requirements[1]);
                expect(actualOptions.resolve.surveillanceId()).toEqual(Mock.surveillances[0].id);
                expect(actualOptions.resolve.surveillanceTypes()).toEqual(Mock.surveillanceData);
                expect(actualOptions.resolve.workType()).toEqual('edit');
            });

            it('should create a temporary guid if one doesn\'t exist', function () {
                var req = {name: 'fake'};
                vm.editRequirement(req);
                expect(req.guiId).toEqual(jasmine.any(Number));
            });

            it('should replace the array object with the response if the guid matches', function () {
                var req = angular.copy(vm.surveillance.requirements[1]);
                req.guiId = req.id;
                req.name = 'new name';
                vm.editRequirement(vm.surveillance.requirements[1]);
                vm.modalInstance.close(req);
                expect(vm.surveillance.requirements[1]).toEqual(req);
            });

            it('should append the response if it does not match', function () {
                vm.editRequirement(vm.surveillance.requirements[1]);
                vm.modalInstance.close({guiId: 123123})
                expect(vm.surveillance.requirements[1]).not.toEqual({guiId: 123123});
                expect(vm.surveillance.requirements[2]).toEqual({guiId: 123123});
            });

            it('should log a non-closed modal', function () {
                var logCount = $log.info.logs.length;
                vm.editRequirement(vm.surveillance.requirements[1]);
                vm.modalInstance.dismiss('string');
                expect($log.info.logs.length).toBe(logCount + 1);
            });
        });

        describe('when inspecting nonconformities', function () {
            var modalOptions;
            beforeEach(function () {
                modalOptions = {
                    templateUrl: 'app/admin/components/surveillance/nonconformity/inspect.html',
                    controller: 'NonconformityInspectController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    resolve: {
                        nonconformities: jasmine.any(Function),
                    },
                };
            });

            it('should create a modal instance', function () {
                expect(vm.modalInstance).toBeUndefined();
                vm.inspectNonconformities();
                expect(vm.modalInstance).toBeDefined();
            });

            it('should resolve elements on that modal', function () {
                var noncons = [1,2,3];
                vm.inspectNonconformities(noncons);
                expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
                expect(actualOptions.resolve.nonconformities()).toEqual(noncons);
            });

            it('should log a non-closed modal', function () {
                var logCount = $log.info.logs.length;
                vm.inspectNonconformities();
                vm.modalInstance.dismiss('string');
                expect($log.info.logs.length).toBe(logCount + 1);
            });
        });

        describe('when concerned with end dates', function () {
            beforeEach(function () {
                vm.surveillance = angular.copy(Mock.surveillances[0]);
            });

            it('should not require one when there are open NCs', function () {
                expect(vm.missingEndDate()).toBe(false);
            });

            it('should require one when all NCs are closed and there\'s no surveillance end date', function () {
                vm.surveillance.requirements[0].nonconformities[0].status = {id: 2, name: 'Closed'};
                expect(vm.missingEndDate()).toBe(true);
            });

            it('should require one when there are no NCs and there\'s no surveillance end date', function () {
                vm.surveillance.requirements[0].nonconformities = [];
                expect(vm.missingEndDate()).toBe(true);
            });

            it('should not require one when all NCs are closed and the surveillance has an end date', function () {
                vm.surveillance.requirements[0].nonconformities[0].status = {id: 2, name: 'Closed'};
                vm.surveillance.endDateObject = '1472702800000';
                expect(vm.missingEndDate()).toBe(false);
            });

            it('should not require one when there are no requirements', function () {
                vm.surveillance.requirements = undefined;
                expect(vm.missingEndDate()).toBeFalsy();
            });
        });

        describe('when saving the surveillance', function () {
            beforeEach(function () {
                vm.workType = '';
            });

            it('should set the start date', function () {
                var aDate = new Date();
                vm.surveillance.startDate = undefined;
                vm.surveillance.startDateObject = aDate;
                vm.save();
                expect(vm.surveillance.startDate).toBe(aDate.getTime());
            });

            it('should set the end date if it exists', function () {
                var aDate = new Date();
                vm.surveillance.endDate = undefined;
                vm.surveillance.endDateObject = aDate;
                vm.save();
                expect(vm.surveillance.endDate).toBe(aDate.getTime());
            });

            it('should set the end date to null if it doesn\'t exist', function () {
                vm.surveillance.endDate = undefined;
                vm.surveillance.endDateObject = null
                vm.save();
                expect(vm.surveillance.endDate).toBe(null);
            });

            describe('in a "confirm" workflow', function () {
                it('should close it\'s modal', function () {
                    vm.workType = 'confirm';
                    vm.save();
                    expect(Mock.modalInstance.close).toHaveBeenCalled();
                });
            });

            describe('in an "initiate" workflow', function () {
                beforeEach(function () {
                    vm.workType = 'initiate';
                    vm.surveillance.certifiedProduct.edition = undefined;
                    vm.surveillance.certifiedProduct.certificationEdition = {name: 'fake'};
                });

                it('should set the certification edition correctly', function () {
                    vm.surveillance.certifiedProduct.edition = undefined;
                    vm.surveillance.certifiedProduct.certificationEdition = {name: 'fake'};
                    vm.save();
                    expect(vm.surveillance.certifiedProduct.edition).toBe('fake');
                });

                it('should not assign an authority if one is already there', function () {
                    var initCount = vm.isChplAdmin.calls.count();
                    vm.surveillance.authority = 'ROLE_ADMIN';
                    vm.save();
                    expect(vm.isChplAdmin.calls.count()).toBe(initCount);
                });

                it('should assign the highest authority to the surveillance', function () {
                    vm.surveillance.authority = undefined;
                    authService.isAcbAdmin.and.returnValue(true);
                    authService.isAcbStaff.and.returnValue(true);
                    authService.isChplAdmin.and.returnValue(true);
                    vm.save();
                    expect(vm.surveillance.authority).toBe('ROLE_ADMIN');
                    vm.surveillance.authority = undefined;
                    authService.isChplAdmin.and.returnValue(false);
                    vm.save();
                    expect(vm.surveillance.authority).toBe('ROLE_ACB_ADMIN');
                    vm.surveillance.authority = undefined;
                    authService.isAcbAdmin.and.returnValue(false);
                    vm.save();
                    expect(vm.surveillance.authority).toBe('ROLE_ACB_STAFF');
                    vm.surveillance.authority = undefined;
                    authService.isAcbStaff.and.returnValue(false);
                    vm.save();
                    expect(vm.surveillance.authority).toBeUndefined();
                });

                it('should close it\'s own modal on a status:200 response', function () {
                    networkService.initiateSurveillance.and.returnValue($q.when({status: 200}));
                    vm.save();
                    scope.$digest();
                    expect(Mock.modalInstance.close).toHaveBeenCalledWith({status: 200});
                });

                it('should close it\'s own modal if no status in the response', function () {
                    networkService.initiateSurveillance.and.returnValue($q.when({}));
                    vm.save();
                    scope.$digest();
                    expect(Mock.modalInstance.close).toHaveBeenCalledWith({});
                });

                it('should close it\'s own modal if status is an object in the response', function () {
                    networkService.initiateSurveillance.and.returnValue($q.when({status: {status: 'OK'}}));
                    vm.save();
                    scope.$digest();
                    expect(Mock.modalInstance.close).toHaveBeenCalledWith({status: {status: 'OK'}});
                });

                it('should report errors if status has errors', function () {
                    networkService.initiateSurveillance.and.returnValue($q.when({status: 'bad'}));
                    vm.save();
                    scope.$digest();
                    expect(vm.errorMessages).toEqual([{status: 'bad'}]);
                });

                it('should report errors if request fails', function () {
                    networkService.initiateSurveillance.and.returnValue($q.reject({data: {errorMessages: ['errors']}}));
                    vm.save();
                    scope.$digest();
                    expect(vm.errorMessages).toEqual(['errors']);
                });

                it('should not report errors if request fails but no messages are returned', function () {
                    networkService.initiateSurveillance.and.returnValue($q.reject({data: {errorMessages: []}}));
                    vm.save();
                    scope.$digest();
                    expect(vm.errorMessages).toEqual([undefined]);
                });

                it('should not report errors if request fails but no messages are returned', function () {
                    networkService.initiateSurveillance.and.returnValue($q.reject({data: {errorMessages: undefined}}));
                    vm.save();
                    scope.$digest();
                    expect(vm.errorMessages).toEqual([undefined]);
                });

                it('should report errors if request fails and "data.error" is returned', function () {
                    networkService.initiateSurveillance.and.returnValue($q.reject({data: {error: 'an error'}}));
                    vm.save();
                    scope.$digest();
                    expect(vm.errorMessages).toEqual(['an error']);
                });

                it('should report errors if request fails and "statusText" is returned', function () {
                    networkService.initiateSurveillance.and.returnValue($q.reject({statusText: 'errors', data: {errorMessages: undefined}}));
                    vm.save();
                    scope.$digest();
                    expect(vm.errorMessages).toEqual(['errors']);
                });
            });

            describe('in an "edit" workflow', function () {
                beforeEach(function () {
                    vm.workType = 'edit';
                });

                it('should close it\'s own modal on a status:200 response', function () {
                    networkService.updateSurveillance.and.returnValue($q.when({status: 200}));
                    vm.save();
                    scope.$digest();
                    expect(Mock.modalInstance.close).toHaveBeenCalledWith({status: 200});
                });

                it('should close it\'s own modal if no status in the response', function () {
                    networkService.updateSurveillance.and.returnValue($q.when({}));
                    vm.save();
                    scope.$digest();
                    expect(Mock.modalInstance.close).toHaveBeenCalledWith({});
                });

                it('should close it\'s own modal if status is an object in the response', function () {
                    networkService.updateSurveillance.and.returnValue($q.when({status: {status: 'OK'}}));
                    vm.save();
                    scope.$digest();
                    expect(Mock.modalInstance.close).toHaveBeenCalledWith({status: {status: 'OK'}});
                });

                it('should report errors if status has errors', function () {
                    networkService.updateSurveillance.and.returnValue($q.when({status: 'bad'}));
                    vm.save();
                    scope.$digest();
                    expect(vm.errorMessages).toEqual([{status: 'bad'}]);
                });

                it('should report errors if request fails', function () {
                    networkService.updateSurveillance.and.returnValue($q.reject({data: {errorMessages: ['errors']}}));
                    vm.save();
                    scope.$digest();
                    expect(vm.errorMessages).toEqual(['errors']);
                });

                it('should not report errors if request fails but no messages are returned', function () {
                    networkService.updateSurveillance.and.returnValue($q.reject({data: {errorMessages: []}}));
                    vm.save();
                    scope.$digest();
                    expect(vm.errorMessages).toEqual([undefined]);
                });

                it('should not report errors if request fails but no messages are returned', function () {
                    networkService.updateSurveillance.and.returnValue($q.reject({data: {errorMessages: undefined}}));
                    vm.save();
                    scope.$digest();
                    expect(vm.errorMessages).toEqual([undefined]);
                });

                it('should report errors if request fails and "statusText" is returned', function () {
                    networkService.updateSurveillance.and.returnValue($q.reject({statusText: 'errors', data: {errorMessages: undefined}}));
                    vm.save();
                    scope.$digest();
                    expect(vm.errorMessages).toEqual(['errors']);
                });
            });
        });
    });
})();
