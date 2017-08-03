(function () {
    'use strict';

    describe('the Developer Edit controller', function () {
        var $controller, $log, $q, Mock, authService, commonService, mock, scope, utilService, vm;

        mock = {};
        mock.acbs = ['Drummond','ICSA','Infogard'];

        beforeEach(function () {
            module('chpl.mock', 'chpl.admin', function ($provide) {
                $provide.decorator('authService', function ($delegate) {
                    $delegate.isChplAdmin = jasmine.createSpy('isChplAdmin');
                    return $delegate;
                });
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.updateDeveloper = jasmine.createSpy('updateDeveloper');
                    return $delegate;
                });
            });

            inject(function (_$controller_, _$log_, _$q_, $rootScope, _Mock_, _authService_, _commonService_, _utilService_) {
                $controller = _$controller_;
                $log = _$log_;
                $q = _$q_;
                authService = _authService_;
                authService.isChplAdmin.and.returnValue(true);
                commonService = _commonService_;
                commonService.updateDeveloper.and.returnValue($q.when({}));
                utilService = _utilService_;
                Mock = _Mock_;
                mock.firstDev = angular.copy(Mock.developers[0]);
                for (var i = 0; i < mock.firstDev.statusEvents.length; i++) {
                    mock.firstDev.statusEvents[i].statusDateObject = new Date(mock.firstDev.statusEvents[i].statusDate);
                }

                scope = $rootScope.$new();
                vm = $controller('EditDeveloperController', {
                    activeAcbs: mock.acbs,
                    activeDeveloper: Mock.developers[0],
                    $uibModalInstance: Mock.modalInstance,
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

        it('should know if the developer is loaded as inactive', function () {
            expect(vm.loadedAsInactiveByOnc).toBe(true);
            var dev = angular.copy(Mock.developers[0]);
            dev.status.status = 'Under certification ban by ONC';
            vm = $controller('EditDeveloperController', {
                activeAcbs: mock.acbs,
                activeDeveloper: dev,
                $uibModalInstance: Mock.modalInstance,
            });
            expect(vm.loadedAsInactiveByOnc).toBe(true);
            dev.status.status = 'Active';
            vm = $controller('EditDeveloperController', {
                activeAcbs: mock.acbs,
                activeDeveloper: dev,
                $uibModalInstance: Mock.modalInstance,
            });
            expect(vm.loadedAsInactiveByOnc).toBe(false);
        });

        it('should farm out address checks to the utility service', function () {
            spyOn(utilService, 'addressRequired');
            vm.addressRequired();
            expect(utilService.addressRequired).toHaveBeenCalledWith(vm.developer.address);
        });

        describe('when handling developer status history', function () {
            it('should add statusEventObjects for each statusDate in history', function () {
                expect(vm.developer.statusEvents).toEqual(mock.firstDev.statusEvents);
            });

            it('should remove previous statuses', function () {
                var initLength = vm.developer.statusEvents.length;
                vm.removePreviousStatus(0);
                expect(vm.developer.statusEvents.length).toBe(initLength - 1);
            });

            it('should add an empty status', function () {
                var initLength = vm.developer.statusEvents.length;
                vm.addPreviousStatus();
                expect(vm.developer.statusEvents.length).toBe(initLength + 1);
                expect(vm.developer.statusEvents[vm.developer.statusEvents.length - 1].statusDateObject).toBeDefined();
            });

            it('should initialize an empty array if required', function () {
                var dev = angular.copy(Mock.developers[0]);
                dev.statusEvents = undefined;
                vm = $controller('EditDeveloperController', {
                    activeAcbs: mock.acbs,
                    activeDeveloper: dev,
                    $uibModalInstance: Mock.modalInstance,
                });
                expect(vm.developer.statusEvents).toEqual([]);
            });
        });

        describe('when validating the form', function () {
            it('should know when two status events were on the same day', function () {
                vm.developer.statusEvents = [
                    {
                        status: {status: 'Active'},
                        statusDateObject: new Date('1/1/2009'),
                    },{
                        status: {status: 'Suspended by ONC'},
                        statusDateObject: new Date('1/1/2009'),
                    },
                ];
                expect(vm.hasDateMatches()).toBe(true);
                vm.developer.statusEvents[0].statusDateObject = new Date('2/2/2002');
                expect(vm.hasDateMatches()).toBe(false);
            });

            it('should know when two status events are the same an consecutive', function () {
                vm.developer.statusEvents = [
                    {
                        status: {status: 'Suspended by ONC'},
                        statusDateObject: new Date('1/1/2009'),
                    },{
                        status: {status: 'Suspended by ONC'},
                        statusDateObject: new Date('2/2/2009'),
                    },
                ];
                expect(vm.hasStatusMatches()).toBe(true);
                vm.developer.statusEvents[0].status.status = 'Active'
                expect(vm.hasStatusMatches()).toBe(false);
            });

            it('should know when the status object hasn\'t been entered', function () {
                vm.developer.statusEvents = [
                    {
                        status: {status: 'Suspended by ONC'},
                        statusDateObject: new Date('1/1/2009'),
                    },{
                        statusDateObject: new Date('2/2/2009'),
                    },
                ];
                expect(vm.isMissingRequiredFields()).toBe(true);
                vm.developer.statusEvents[1].status = {status: 'Active'};
                expect(vm.isMissingRequiredFields()).toBe(false);
            });
        });

        it('should know when the Developer is being activated', function () {
            vm.developer.statusEvents = [
                {
                    status: {status: 'Active'},
                    statusDateObject: new Date('1/1/2009'),
                },{
                    status: {status: 'Suspended by ONC'},
                    statusDateObject: new Date('2/2/2009'),
                },
            ];
            vm.loadedAsInactveByOnc = true;
            expect(vm.isBeingActivatedFromOncInactiveStatus()).toBe(false);
            vm.developer.statusEvents[1].status = {status: 'Under certification ban by ONC'};
            expect(vm.isBeingActivatedFromOncInactiveStatus()).toBe(false);
            vm.developer.statusEvents[1].status = {status: 'Active'};
            expect(vm.isBeingActivatedFromOncInactiveStatus()).toBe(true);
            vm.loadedAsInactiveByOnc = false;
            expect(vm.isBeingActivatedFromOncInactiveStatus()).toBe(false);
            vm.developer.statusEvents = [];
            expect(vm.isBeingActivatedFromOncInactiveStatus()).toBe(false);
        });

        describe('when saving the Developer', function () {
            it('should add date longs from the date objects', function () {
                var aDate = new Date('1/1/2009');
                var dateValue = aDate.getTime();
                vm.developer.statusEvents = [
                    {
                        status: {status: 'Active'},
                        statusDateObject: aDate,
                    },
                ];
                vm.save();
                expect(vm.developer.statusEvents[0].statusDate).toBe(dateValue);
            });

            it('should add/remove/change transparency attestations', function () {
                vm.developer.transparencyAttestations = [
                    {
                        acbName: 'Drummond',
                        attestation: 'Negative',
                    },{
                        acbName: 'ICSA Labs',
                        attestation: 'Affirmative',
                    },
                ];
                vm.developer.transMap = {
                    'Drummond': 'Affirmative',
                    'Infogard': 'Not Applicable',
                };
                vm.save();
                expect(vm.developer.transparencyAttestations).toEqual([
                    {
                        acbName: 'Drummond',
                        attestation: 'Affirmative',
                    },{
                        acbName: 'ICSA Labs',
                        attestation: 'Affirmative',
                    },{
                        acbName: 'Infogard',
                        attestation: 'Not Applicable',
                    },
                ]);
            });

            it('should call the common service to update the developer', function () {
                vm.save();
                scope.$digest();
                expect(commonService.updateDeveloper).toHaveBeenCalled();
            });

            it('should close the modal if status 200', function () {
                var response = {status: 200}
                commonService.updateDeveloper.and.returnValue($q.when(response));
                vm.save();
                scope.$digest();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith(response);
            });

            it('should close the modal if status undefined', function () {
                var response = {status: undefined}
                commonService.updateDeveloper.and.returnValue($q.when(response));
                vm.save();
                scope.$digest();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith(response);
            });

            it('should close the modal if status is an object', function () {
                var response = {status: {messages: []}}
                commonService.updateDeveloper.and.returnValue($q.when(response));
                vm.save();
                scope.$digest();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith(response);
            });

            it('should dismiss the modal if bad status', function () {
                var response = {status: 400}
                commonService.updateDeveloper.and.returnValue($q.when(response));
                vm.save();
                scope.$digest();
                expect(Mock.modalInstance.dismiss).toHaveBeenCalledWith('An error occurred');
            });

            it('should dismiss the modal if bad response', function () {
                var response = {data: {error: 'An error occurred'}};
                commonService.updateDeveloper.and.returnValue($q.reject(response));
                vm.save();
                scope.$digest();
                expect(Mock.modalInstance.dismiss).toHaveBeenCalledWith('An error occurred');
            });
        });
    });
})();
