(function () {
    'use strict';

    describe('the Certified Product Edit controller', function () {
        var $controller, $log, $q, $timeout, Mock, mock, networkService, scope, utilService, vm;

        mock = {};
        mock.activeCP = {
            certificationStatus: [],
            certifyingBody: [],
            chplProductNumber: 'CHP-123123',
            classificationType: [],
            ics: { inherits: false },
            practiceType: [],
            product: { productId: 1 },
            targetedUsers: [],
        };
        mock.resources = {
            accessibilityStandards: [{id: 1, name: 'name1'}],
            bodies: [{id: 1, name: 'name1'}, {id: 2, name: 'name2'}],
            classifications: [{id: 1, name: 'name1'}],
            practices: [{id: 1, name: 'name1'}],
            qmsStandards: [{id: 1, name: 'name1'}],
            statuses: [{id: 1, name: 'name1'}],
            testingLabs: [{id: 1, name: 'name1'}],
        }
        mock.relatedListings = [{id: 1, edition: '2015'}, {id: 2, edition: '2014'}];

        beforeEach(function () {
            module('chpl.admin', 'chpl.mock', function ($provide) {
                $provide.decorator('networkService', function ($delegate) {
                    $delegate.getRelatedListings = jasmine.createSpy('getRelatedListings');
                    $delegate.updateCP = jasmine.createSpy('updateCP');
                    return $delegate;
                });
                $provide.decorator('utilService', function ($delegate) {
                    $delegate.extendSelect = jasmine.createSpy('extendSelect');
                    return $delegate;
                });
            });

            inject(function (_$controller_, _$log_, _$q_, $rootScope, _$timeout_, _Mock_, _networkService_, _utilService_) {
                $controller = _$controller_;
                $log = _$log_;
                $q = _$q_;
                $timeout = _$timeout_;
                networkService = _networkService_;
                networkService.getRelatedListings.and.returnValue($q.when(mock.relatedListings));
                networkService.updateCP.and.returnValue($q.when(mock));
                Mock = _Mock_;
                utilService = _utilService_;
                utilService.extendSelect.and.returnValue([]);

                scope = $rootScope.$new();
                vm = $controller('EditCertifiedProductController', {
                    activeCP: mock.activeCP,
                    isAcbAdmin: true,
                    isAcbStaff: true,
                    isChplAdmin: true,
                    resources: mock.resources,
                    workType: 'manage',
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

        it('should have a way to close it\'s modal', function () {
            expect(vm.cancel).toBeDefined();
            vm.cancel();
            expect(Mock.modalInstance.dismiss).toHaveBeenCalled();
        });

        it('should warn the user if the status will cause developer suspension', function () {
            expect(vm.willCauseSuspension('Active')).toBe(false);
            expect(vm.willCauseSuspension('Retired')).toBe(false);
            expect(vm.willCauseSuspension('Suspended by ONC')).toBe(false);
            expect(vm.willCauseSuspension('Suspended by ONC-ACB')).toBe(false);
            expect(vm.willCauseSuspension('Terminated by ONC')).toBe(true);
            expect(vm.willCauseSuspension('Withdrawn by Developer')).toBe(false);
            expect(vm.willCauseSuspension('Withdrawn by Developer Under Surveillance/Review')).toBe(true);
            expect(vm.willCauseSuspension('Withdrawn by ONC-ACB')).toBe(false);
            expect(vm.willCauseSuspension('not a status')).toBe(false);
        });

        it('should not create parents if they exist', function () {
            var cp = angular.copy(mock.activeCP);
            cp.ics.parents = [{name: 'a parent'}];
            vm = $controller('EditCertifiedProductController', {
                activeCP: cp,
                isAcbAdmin: true,
                isAcbStaff: true,
                isChplAdmin: true,
                resources: mock.resources,
                workType: 'manage',
                $uibModalInstance: Mock.modalInstance,
                $scope: scope,
            });
            scope.$digest();
            expect(vm.cp.ics.parents).toEqual([{name: 'a parent'}]);
        });

        it('should break the parts of the product number apart if it\'s the new style', function () {
            var cp = angular.copy(mock.activeCP);
            cp.chplProductNumber = '15.07.07.2713.CQ01.02.00.1.170331';
            vm = $controller('EditCertifiedProductController', {
                activeCP: cp,
                isAcbAdmin: true,
                isAcbStaff: true,
                isChplAdmin: true,
                resources: mock.resources,
                workType: 'manage',
                $uibModalInstance: Mock.modalInstance,
                $scope: scope,
            });
            scope.$digest();
            expect(vm.idFields).toEqual({
                prefix: '15.07.07.2713',
                prod: 'CQ01',
                ver: '02',
                ics: '00',
                suffix: '1.170331',
            });
        });

        describe('when deailing with ics family', function () {
            it('should call the common service to get related listings', function () {
                expect(networkService.getRelatedListings).toHaveBeenCalled();
            });

            it('should load the related listings on load, without the 2014 ones', function () {
                expect(vm.relatedListings).toEqual([mock.relatedListings[0]]);
            });

            it('should build an icsParents object if the Listing doesn\'t come with one', function () {
                expect(vm.cp.ics.parents).toEqual([]);
            });

            describe('when disabling related options', function () {
                it('should disable itself', function () {
                    expect(vm.disabledParent({ chplProductNumber: 'CHP-123123'})).toBe(true);
                });

                it('should disable ones that are already parents', function () {
                    expect(vm.disabledParent({ chplProductNumber: '123'})).toBe(false);
                    vm.cp.ics.parents = [{ chplProductNumber: '123' }];
                    expect(vm.disabledParent({ chplProductNumber: '123'})).toBe(true);
                });
            });

            describe('with respect to ics code calculations', function () {
                it('should expect the code to be 00 if no parents', function () {
                    vm.cp.ics.parents = [];
                    expect(vm.requiredIcsCode()).toBe('00');
                });

                it('should expect the code to be 1 if one parent and parent has ICS 00', function () {
                    vm.cp.ics.parents = [{chplProductNumber: '15.07.07.2713.CQ01.02.00.1.170331'}];
                    expect(vm.requiredIcsCode()).toBe('01');
                });

                it('should expect the code to be 1 if two parents and parents have ICS 00', function () {
                    vm.cp.ics.parents = [
                        {chplProductNumber: '15.07.07.2713.CQ01.02.00.1.170331'},
                        {chplProductNumber: '15.07.07.2713.CQ01.02.00.1.170331'},
                    ];
                    expect(vm.requiredIcsCode()).toBe('01');
                });

                it('should expect the code to be 2 if two parents and parents have ICS 01', function () {
                    vm.cp.ics.parents = [
                        {chplProductNumber: '15.07.07.2713.CQ01.02.01.1.170331'},
                        {chplProductNumber: '15.07.07.2713.CQ01.02.01.1.170331'},
                    ];
                    expect(vm.requiredIcsCode()).toBe('02');
                });

                it('should expect the code to be 3 if two parents and parents have ICS 01,02', function () {
                    vm.cp.ics.parents = [
                        {chplProductNumber: '15.07.07.2713.CQ01.02.01.1.170331'},
                        {chplProductNumber: '15.07.07.2713.CQ01.02.02.1.170331'},
                    ];
                    expect(vm.requiredIcsCode()).toBe('03');
                });

                it('should expect the code to be 10 if two parents and parents have ICS 03,09', function () {
                    vm.cp.ics.parents = [
                        {chplProductNumber: '15.07.07.2713.CQ01.02.09.1.170331'},
                        {chplProductNumber: '15.07.07.2713.CQ01.02.03.1.170331'},
                    ];
                    expect(vm.requiredIcsCode()).toBe('10');
                });

                it('should expect the code to be 18 if two parents and parents have ICS 17,11', function () {
                    vm.cp.ics.parents = [
                        {chplProductNumber: '15.07.07.2713.CQ01.02.17.1.170331'},
                        {chplProductNumber: '15.07.07.2713.CQ01.02.11.1.170331'},
                    ];
                    expect(vm.requiredIcsCode()).toBe('18');
                });
            });
        });

        it('should know which statuses should be disabled', function () {
            vm.workType = 'manage';
            expect(vm.disabledStatus('Pending')).toBe(true);
            expect(vm.disabledStatus('Active')).toBe(false);
            vm.workType = 'confirm';
            expect(vm.disabledStatus('Pending')).toBe(false);
            expect(vm.disabledStatus('Active')).toBe(true);
        });

        it('should attach the model for the select boxes', function () {
            vm.cp.practiceType = {id: 1};
            vm.cp.classificationType = {id: 1};
            vm.cp.certifyingBody = {id: 2};
            vm.cp.certificationStatus = {id: 1};
            vm.attachModel();
            expect(vm.cp.practiceType).toBe(mock.resources.practices[0]);
            expect(vm.cp.classificationType).toBe(mock.resources.classifications[0]);
            expect(vm.cp.certifyingBody).toBe(mock.resources.bodies[1]);
            expect(vm.cp.certificationStatus).toBe(mock.resources.statuses[0]);
            expect(vm.cp.testingLab).not.toBe(mock.resources.testingLabs[0]);
            vm.cp.testingLab = {id: 1};
            vm.attachModel();
            expect(vm.cp.testingLab).toBe(mock.resources.testingLabs[0]);
        });

        describe('when saving a Listing', function () {
            it('should combine values to make the chpl product number if required', function () {
                vm.cp.chplProductNumber = '15.04.04.2879.Your.09.2.1.170530';
                vm.idFields = {
                    prefix: '14.03.03.2879',
                    prod: 'prod',
                    ver: 'vr',
                    ics: '02',
                    suffix: '0.140303',
                };
                vm.save();
                expect(vm.cp.chplProductNumber).toBe('14.03.03.2879.prod.vr.02.0.140303');
            });

            describe('that is active', function () {
                it('should set a "saving" flag save', function () {
                    vm.save();
                    expect(vm.isSaving).toBe(true);
                });

                it('should close it\'s modal on a successful update', function () {
                    networkService.updateCP.and.returnValue($q.when({status: 200}));
                    vm.save();
                    scope.$digest();
                    expect(Mock.modalInstance.close).toHaveBeenCalled();
                });

                it('should report errors and turn off the saving flag', function () {
                    networkService.updateCP.and.returnValue($q.when({status: 400, error: 'an error'}));
                    vm.save();
                    scope.$digest();
                    expect(vm.errors).toEqual(['an error']);
                    expect(vm.isSaving).toBe(false);
                });

                it('should report errors on server data.error', function () {
                    networkService.updateCP.and.returnValue($q.reject({data: {error: 'an error'}}));
                    vm.save();
                    scope.$digest();
                    expect(vm.errors).toEqual(['an error']);
                    expect(vm.isSaving).toBe(false);
                });

                it('should report errors on server data.errorMessages', function () {
                    networkService.updateCP.and.returnValue($q.reject({data: {errorMessages: ['an error2']}}));
                    vm.save();
                    scope.$digest();
                    expect(vm.errors).toEqual(['an error2']);
                    expect(vm.isSaving).toBe(false);
                });

                it('should report errors on server data.warningMessages', function () {
                    networkService.updateCP.and.returnValue($q.reject({data: {warningMessages: ['an error3']}}));
                    vm.save();
                    scope.$digest();
                    expect(vm.errors).toEqual(['an error3']);
                    expect(vm.isSaving).toBe(false);
                });

                it('should report no errors if none were returned', function () {
                    networkService.updateCP.and.returnValue($q.reject({}));
                    vm.save();
                    scope.$digest();
                    expect(vm.errors).toEqual([]);
                    expect(vm.isSaving).toBe(false);
                });
            });

            describe('that is pending', function () {
                it('should close it\'s modal with the current Listing', function () {
                    vm.workType = 'confirm';
                    vm.save();
                    expect(Mock.modalInstance.close).toHaveBeenCalledWith(vm.cp);
                });
            });

            describe('that has an unknown worktype', function () {
                it('log something', function () {
                    vm.workType = '';
                    var logCount = $log.info.logs.length;
                    vm.save();
                    expect($log.info.logs.length).toBe(logCount + 1);
                });
            });

            it('should trigger saving from the cert directive', function () {
                spyOn(vm, 'directCertsDirective');
                spyOn(vm, 'save');
                vm.prep();
                expect(vm.directCertsDirective).toHaveBeenCalled();
                $timeout.flush();
                expect(vm.save).toHaveBeenCalled();
            });

            it('should trigger cert handlers when directed', function () {
                var certSave = jasmine.createSpy('certSave');
                vm.handlers = [certSave];
                vm.directCertsDirective();
                expect(certSave).toHaveBeenCalled();
            });
        });

        describe('when registering cert save handlers', function () {
            var certSave;
            beforeEach(function () {
                certSave = jasmine.createSpy('certSave');
            });

            it('should save them', function () {
                vm.registerCerts(certSave);
                expect(vm.handlers[0]).toBe(certSave);
            });

            it('should return a way to clear the handler', function () {
                var clear = vm.registerCerts(certSave);
                clear();
                expect(vm.handlers[0]).toBeUndefined();
            });
        });
    });
})();
