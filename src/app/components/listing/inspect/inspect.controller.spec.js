(() => {
    'use strict';

    describe('the Listing Inspection controller', () => {
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

        beforeEach(() => {
            angular.mock.module('chpl.components', 'chpl.mock', $provide => {
                $provide.decorator('networkService', $delegate => {
                    $delegate.confirmPendingCp = jasmine.createSpy('confirmPendingCp');
                    $delegate.getDeveloper = jasmine.createSpy('getDeveloper');
                    $delegate.rejectPendingCp = jasmine.createSpy('rejectPendingCp');

                    return $delegate;
                });
            });

            inject(($controller, _$log_, _$q_, $rootScope, _Mock_, _networkService_) => {
                $log = _$log_;
                $q = _$q_;
                Mock = _Mock_;
                networkService = _networkService_;
                networkService.confirmPendingCp.and.returnValue($q.when({}));
                networkService.getDeveloper.and.returnValue($q.when(Mock.developers[0]));
                networkService.rejectPendingCp.and.returnValue($q.when({}));

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

        afterEach(() => {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(o => angular.toJson(o)).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        it('should exist', () => {
            expect(vm).toBeDefined();
        });

        it('should have a way to close it\'s own modal', () => {
            expect(vm.cancel).toBeDefined();
            vm.cancel();
            expect(Mock.modalInstance.dismiss).toHaveBeenCalled();
        });

        describe('when confirming or rejecting', () => {
            it('should close the modal if confirmation is successful', () => {
                vm.confirm();
                scope.$digest();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({
                    status: 'confirmed',
                    developerCreated: false,
                    developer: undefined,
                });
            });

            it('should close the modal if rejection is successful', () => {
                vm.reject();
                scope.$digest();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({status: 'rejected'});
            });

            it('should not dismiss the modal if confirmation fails', () => {
                networkService.confirmPendingCp.and.returnValue($q.reject({data: {errorMessages: []}}));
                vm.confirm();
                scope.$digest();
                expect(Mock.modalInstance.dismiss).not.toHaveBeenCalled();
            });

            it('should not dismiss the modal if rejection fails', () => {
                networkService.rejectPendingCp.and.returnValue($q.reject({data: {errorMessages: []}}));
                vm.reject();
                scope.$digest();
                expect(Mock.modalInstance.dismiss).not.toHaveBeenCalled();
            });

            it('should have error messages if confirmation fails', () => {
                networkService.confirmPendingCp.and.returnValue($q.reject({data: {errorMessages: [1,2]}}));
                vm.confirm();
                scope.$digest();
                expect(vm.errorMessages).toEqual([1,2]);
            });

            it('should have error messages if rejection fails', () => {
                networkService.rejectPendingCp.and.returnValue($q.reject({data: {errorMessages: [1,2]}}));
                vm.reject();
                scope.$digest();
                expect(vm.errorMessages).toEqual([1,2]);
            });

            it('should dismiss the modal with the contact if the pending listing was already resolved on confirmation', () => {
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

            it('should dismiss the modal with the contact if the pending listing was already resolved on rejection', () => {
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

        describe('when analyzing the developer', () => {
            beforeEach(() => {
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

            describe('with respect to system developer info', () => {
                describe('that is missing', () => {
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

                    it('developer name ' + shouldDisableNextButton, () => {
                        testMissingData(vm.developer, 'name');
                    });

                    it('developer website ' + shouldDisableNextButton, () => {
                        testMissingData(vm.developer, 'website');
                    });

                    it('contact full name ' + shouldDisableNextButton, () => {
                        testMissingData(vm.developer.contact, 'fullName');
                    });

                    it('contact email ' + shouldDisableNextButton, () => {
                        testMissingData(vm.developer.contact, 'email');
                    });

                    it('contact phone number ' + shouldDisableNextButton, () => {
                        testMissingData(vm.developer.contact, 'phoneNumber');
                    });

                    it('address line1 ' + shouldDisableNextButton, () => {
                        testMissingData(vm.developer.address, 'line1');
                    });

                    it('address city ' + shouldDisableNextButton, () => {
                        testMissingData(vm.developer.address, 'city');
                    });

                    it('address state ' + shouldDisableNextButton, () => {
                        testMissingData(vm.developer.address, 'state');
                    });

                    it('address zipcode ' + shouldDisableNextButton, () => {
                        testMissingData(vm.developer.address, 'zipcode');
                    });

                    it('transparency attestations ' + shouldDisableNextButton, () => {
                        testMissingData(vm.developer.transparencyAttestations[0], 'attestation');
                    });
                });

                const shouldEnableNextButton = 'should enable the next button';

                it('has all contact info then it ' + shouldEnableNextButton, () => {
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
        });
    });
})();
