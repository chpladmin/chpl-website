(function () {
    'use strict';

    describe('the Developer Merge controller', function () {
        var $controller, $log, $q, Mock, commonService, mock, scope, utilService, vm;

        mock = {};
        mock.acbs = ['Drummond','ICSA','Infogard'];

        beforeEach(function () {
            module('chpl.mock', 'chpl.admin', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.updateDeveloper = jasmine.createSpy('updateDeveloper');
                    return $delegate;
                });
            });

            inject(function (_$controller_, _$log_, _$q_, $rootScope, _Mock_, _commonService_, _utilService_) {
                $controller = _$controller_;
                $log = _$log_;
                $q = _$q_;
                commonService = _commonService_;
                commonService.updateDeveloper.and.returnValue($q.when({}));
                utilService = _utilService_;
                Mock = _Mock_;
                mock.developers = [].concat(Mock.developers[0]).concat(Mock.developers[1]).concat(Mock.developers[2]).concat(Mock.developers[3]).concat(Mock.developers[4]);
                mock.developers[0].statusEvents = [{status: {status: 'new'}, statusDate: 'date'}];

                scope = $rootScope.$new();
                vm = $controller('MergeDeveloperController', {
                    developers: mock.developers,
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
            var devs = angular.copy(Mock.developers);
            var i;
            for (i = 0; i < devs.length; i++) {
                devs[i].status.status = 'Under certification ban by ONC';
            }
            vm = $controller('MergeDeveloperController', {
                developers: devs,
                $uibModalInstance: Mock.modalInstance,
            });
            expect(vm.loadedAsInactiveByOnc).toBe(true);
            for (i = 0; i < devs.length; i++) {
                devs[i].status.status = 'Active';
            }
            vm = $controller('MergeDeveloperController', {
                developers: devs,
                $uibModalInstance: Mock.modalInstance,
            });
            expect(vm.loadedAsInactiveByOnc).toBe(false);
        });

        it('should farm out address checks to the utility service', function () {
            spyOn(utilService, 'addressRequired');
            vm.addressRequired();
            expect(utilService.addressRequired).toHaveBeenCalledWith(vm.developer.address);
        });

        describe('developer status history', function () {
            it('should set status history to empty on the new developer', function () {
                expect(vm.developer.statusEvents.length).toBe(0);
            });

            it('should add an empty statuse', function () {
                vm.addPreviousStatus();
                expect(vm.developer.statusEvents.length).toBe(1);
                expect(vm.developer.statusEvents[0].statusDateObject).toBeDefined();
            });

            it('should remove previous statuses', function () {
                vm.addPreviousStatus();
                vm.addPreviousStatus();
                expect(vm.developer.statusEvents.length).toBe(2);
                vm.removePreviousStatus(0);
                expect(vm.developer.statusEvents.length).toBe(1);
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

            it('should show an error if bad status', function () {
                var response = {status: 400, error: 'An error occurred'}
                commonService.updateDeveloper.and.returnValue($q.when(response));
                vm.save();
                scope.$digest();
                expect(vm.errorMessage).toBe('An error occurred');
            });

            it('should dismiss the modal if bad response', function () {
                var response = {data: {error: 'An error occurred'}};
                commonService.updateDeveloper.and.returnValue($q.reject(response));
                vm.save();
                scope.$digest();
                expect(vm.errorMessage).toBe('An error occurred');
            });
        });
    });
})();
