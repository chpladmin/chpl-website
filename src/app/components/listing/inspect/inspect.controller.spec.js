(function () {
    'use strict';

    fdescribe('the Listing Inspection controller', function () {
        var $log, $q, Mock, mock, networkService, scope, vm;

        mock = {};
        mock.inspectingCp = {
            developer: { developerId: 1},
            transparencyAttestation: 'Affirmative',
        };
        mock.resources = {
            bodies: [],
            classifications: [],
            practices: [],
            qmsStandards: [],
            accessibilityStandards: [],
            targetedUsers: [],
            statuses: [],
            testingLabs: [],
        }

        beforeEach(function () {
            angular.mock.module('chpl.components', 'chpl.mock', function ($provide) {
                $provide.decorator('networkService', function ($delegate) {
                    $delegate.confirmPendingCp = jasmine.createSpy('confirmPendingCp');
                    $delegate.getDeveloper = jasmine.createSpy('getDeveloper');
                    $delegate.rejectPendingCp = jasmine.createSpy('rejectPendingCp');
                    $delegate.updateDeveloper = jasmine.createSpy('updateDeveloper');

                    return $delegate;
                });
            });

            inject(function ($controller, _$log_, _$q_, $rootScope, _Mock_, _networkService_) {
                $log = _$log_;
                $q = _$q_;
                Mock = _Mock_;
                networkService = _networkService_;
                networkService.confirmPendingCp.and.returnValue($q.when({}));
                networkService.getDeveloper.and.returnValue($q.when(Mock.developers[0]));
                networkService.rejectPendingCp.and.returnValue($q.when({}));
                networkService.updateDeveloper.and.returnValue($q.when({}));

                scope = $rootScope.$new();
                vm = $controller('InspectController', {
                    $scope: scope,
                    $uibModalInstance: Mock.modalInstance,
                    developers: Mock.developers,
                    inspectingCp: mock.inspectingCp,
                    isAcbAdmin: true,
                    isChplAdmin: true,
                    resources: mock.resources,
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

        describe('when confirming or rejecting', function () {
            it('should close the modal if confirmation is successful', function () {
                vm.confirm();
                scope.$digest();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({
                    status: 'confirmed',
                    developerCreated: false,
                    developer: undefined,
                });
            });

            it('should close the modal if rejection is successful', function () {
                vm.reject();
                scope.$digest();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({status: 'rejected'});
            });

            it('should not dismiss the modal if confirmation fails', function () {
                networkService.confirmPendingCp.and.returnValue($q.reject({data: {errorMessages: []}}));
                vm.confirm();
                scope.$digest();
                expect(Mock.modalInstance.dismiss).not.toHaveBeenCalled();
            });

            it('should not dismiss the modal if rejection fails', function () {
                networkService.rejectPendingCp.and.returnValue($q.reject({data: {errorMessages: []}}));
                vm.reject();
                scope.$digest();
                expect(Mock.modalInstance.dismiss).not.toHaveBeenCalled();
            });

            it('should have error messages if confirmation fails', function () {
                networkService.confirmPendingCp.and.returnValue($q.reject({data: {errorMessages: [1,2]}}));
                vm.confirm();
                scope.$digest();
                expect(vm.errorMessages).toEqual([1,2]);
            });

            it('should have error messages if rejection fails', function () {
                networkService.rejectPendingCp.and.returnValue($q.reject({data: {errorMessages: [1,2]}}));
                vm.reject();
                scope.$digest();
                expect(vm.errorMessages).toEqual([1,2]);
            });

            it('should dismiss the modal with the contact if the pending listing was already resolved on confirmation', function () {
                var contact = {name: 'person'};
                networkService.confirmPendingCp.and.returnValue($q.reject({data: {errorMessages: [1,2], contact: contact, objectId: 1}}));
                vm.confirm();
                scope.$digest();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({
                    contact: contact,
                    objectId: 1,
                    status: 'resolved',
                });
            });

            it('should dismiss the modal with the contact if the pending listing was already resolved on rejection', function () {
                var contact = {name: 'person'};
                networkService.rejectPendingCp.and.returnValue($q.reject({data: {errorMessages: [1,2], contact: contact, objectId: 1}}));
                vm.reject();
                scope.$digest();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({
                    contact: contact,
                    objectId: 1,
                    status: 'resolved',
                });
            });
        });

        fdescribe('when on step 1, and,', function () {
            beforeEach(function () {
                vm.developer = {
                    developerId: 999,
                    name: 'Dude',
                    website: 'http://www.abcdefgxyz123.com',
                    address: {
                        line1: '999 Bowling Way',
                        city: 'LA',
                        state: 'CA',
                        zipcode: '55555',
                    },
                    contact: {
                        fullName: 'The Dude',
                        email: 'abc@abcdefg.com',
                        phoneNumber: '999-999-9999',
                    },
                    transparencyAttestations: [{
                        acbId: 3,
                        acbName: 'Drummond Group',
                        attestation: {transparencyAttestation: 'Affirmative', removed: false},
                    }],
                };
                vm.cp.developer.developerId = vm.developer.developerId;
                vm.cp.certifyingBody = {
                    code: '04',
                    name: 'Drummond Group',
                    id: 3,
                };
            });

            describe('system developer info', function () {
                describe('is missing', function () {
                    function testMissingData (developerObj, propToRemove) {
                        expect(developerObj[propToRemove]).toBeTruthy();
                        expect(vm.isDisabled()).toBe(false);

                        developerObj[propToRemove] = '';
                        expect(developerObj[propToRemove]).toBeFalsy();
                        expect(vm.isDisabled()).toBe(true);
                        developerObj[propToRemove] = ' ';
                        expect(vm.isDisabled()).toBe(true);
                    }

                    const shouldDisableNextButton = 'then it should disable the next button';

                    it('developer name ' + shouldDisableNextButton, function () {
                        testMissingData(vm.developer, 'name');
                    });

                    it('developer website ' + shouldDisableNextButton, function () {
                        testMissingData(vm.developer, 'website');
                    });

                    it('contact full name ' + shouldDisableNextButton, function () {
                        testMissingData(vm.developer.contact, 'fullName');
                    });

                    it('contact email ' + shouldDisableNextButton, function () {
                        testMissingData(vm.developer.contact, 'email');
                    });

                    it('contact phone number ' + shouldDisableNextButton, function () {
                        testMissingData(vm.developer.contact, 'phoneNumber');
                    });

                    it('address line1 ' + shouldDisableNextButton, function () {
                        testMissingData(vm.developer.address, 'line1');
                    });

                    it('address city ' + shouldDisableNextButton, function () {
                        testMissingData(vm.developer.address, 'city');
                    });

                    it('address state ' + shouldDisableNextButton, function () {
                        testMissingData(vm.developer.address, 'state');
                    });

                    it('address zipcode ' + shouldDisableNextButton, function () {
                        testMissingData(vm.developer.address, 'zipcode');
                    });

                    it('transparency attestations ' + shouldDisableNextButton, function () {
                        testMissingData(vm.developer.transparencyAttestations[0], 'attestation');
                    });
                });

                const shouldEnableNextButton = 'should enable the next button';

                it('has all contact info then it ' + shouldEnableNextButton, function () {
                    expect(vm.developer.name).toBeTruthy();
                    expect(vm.developer.website).toBeTruthy();
                    expect(vm.developer.contact.fullName).toBeTruthy();
                    expect(vm.developer.contact.email).toBeTruthy();
                    expect(vm.developer.contact.phoneNumber).toBeTruthy();
                    expect(vm.developer.address.line1).toBeTruthy();
                    expect(vm.developer.address.city).toBeTruthy();
                    expect(vm.developer.address.state).toBeTruthy();
                    expect(vm.developer.address.zipcode).toBeTruthy();
                    expect(vm.developer.transparencyAttestations[0].attestation).toBeTruthy();
                    expect(vm.isDisabled()).toBe(false);
                });
            });

            describe('save as developer information is clicked which calls saveInspectingDeveloper()', function () {
                it('should call loadDev()', function () {
                    vm.cp.developer = angular.copy(vm.developer);

                    spyOn(vm, 'loadDev');
                    vm.saveInspectingDeveloper();
                    scope.$digest();
                    expect(vm.loadDev).toHaveBeenCalled();
                });
            });

            describe('viewing the system developer', function () {
                beforeEach(function () {
                    vm.cp.certifyingBody = {
                        code: '04',
                        name: 'Drummond Group',
                        id: 3,
                    };
                    vm.developer.transparencyAttestations = [{
                        acbId: 4,
                        acbName: 'Other Group',
                        attestation: null,
                    }, {
                        acbId: 3,
                        acbName: 'Drummond Group',
                        attestation: 'Affirmative',
                    }, {
                        acbId: 5,
                        acbName: 'Some ACB',
                        attestation: null,
                    }];
                });

                it('should display a relevant transparency attestation if available', function () {
                    let expectedAttestation = vm.developer.transparencyAttestations[1].attestation;
                    let attestation = vm.getAttestationForCurrentSystemDeveloper();
                    expect(attestation).toBe(expectedAttestation);
                });

                it('should not display a relevant transparency attestation if not available', function () {
                    vm.developer.transparencyAttestations[1].acbName = 'no acbName matches now';
                    let attestation = vm.getAttestationForCurrentSystemDeveloper();
                    expect(attestation).toBeUndefined();
                });

                describe('but no developer data is available', function () {
                    it('should skip the body of getAttestationStringForCurrentSystemDeveloper(), return null, '
                        + 'and display no system attestation info', function () {
                        vm.developer.transparencyAttestations = undefined;
                        let attestation = vm.getAttestationForCurrentSystemDeveloper();
                        expect(attestation).toBeNull();
                        vm.developer = undefined;
                        attestation = vm.getAttestationForCurrentSystemDeveloper();
                        expect(attestation).toBeNull();
                    });
                });
            });
        });
    });
})();
