(function () {
    'use strict';

    describe('the SED Participant Modal controller', function () {
        var $controller, $log, $q, Mock, mock, networkService, scope, vm;

        mock = {};
        mock.participant = {
            id: 3,
            educationTypeName: 'edTypeName',
            educationTypeId: 'edTypeId',
            ageRange: 'ageRnge',
            ageRangeId: 'ageRngeId',
        };

        beforeEach(function () {
            angular.mock.module('chpl', 'chpl.admin', 'chpl.mock', /*'chpl.templates',*/ function ($provide) {
                $provide.decorator('networkService', function ($delegate) {
                    $delegate.getAgeRanges = jasmine.createSpy('getAgeRanges');
                    $delegate.getEducation = jasmine.createSpy('getEducation');
                    return $delegate;
                });
            });

            inject(function (_$controller_, _$log_, _$q_, $rootScope, _Mock_, _networkService_) {
                $controller = _$controller_;
                $log = _$log_;
                $q = _$q_;
                Mock = _Mock_;
                networkService = _networkService_;
                networkService.getAgeRanges.and.returnValue($q.when({}));
                networkService.getEducation.and.returnValue($q.when({}));

                scope = $rootScope.$new();
                vm = $controller('EditSedParticipantController', {
                    participant: angular.copy(mock.participant),
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

        describe('on load', function () {
            it('should load Education and AgeRanges', function () {
                expect(networkService.getAgeRanges).toHaveBeenCalled();
                expect(networkService.getEducation).toHaveBeenCalled();
                expect(vm.participant.education).toEqual({
                    name: mock.participant.educationTypeName,
                    id: mock.participant.educationTypeId,
                });
                expect(vm.participant.ageRangeObj).toEqual({
                    name: mock.participant.ageRange,
                    id: mock.participant.ageRangeId,
                });
            });

            it('should generate an id if one doesn\'t exist', function () {
                var part = angular.copy(mock.participant);
                part.id = undefined;
                vm = $controller('EditSedParticipantController', {
                    participant: angular.copy(part),
                    $uibModalInstance: Mock.modalInstance,
                    $scope: scope,
                });
                scope.$digest();
                expect(vm.participant.id).toEqual(jasmine.any(Number));
            });
        });

        describe('when saving the participant', function () {
            var aParticipant;

            beforeEach(function () {
                aParticipant = {
                    education: {
                        name: 'fake1',
                        id: 'fake2',
                    },
                    ageRangeObj: {
                        name: 'fake3',
                        id: 'fake4',
                    },
                    id: 1,
                };
            });

            it('should break apart the education & age objects', function () {
                vm.participant = aParticipant;
                vm.save();
                expect(vm.participant.educationTypeName).toBe('fake1');
                expect(vm.participant.educationTypeId).toBe('fake2');
                expect(vm.participant.ageRange).toBe('fake3');
                expect(vm.participant.ageRangeId).toBe('fake4');
            });

            it('should return the modal with the participant', function () {
                vm.participant = aParticipant;
                vm.save();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({participant: aParticipant});
            });
        });

        describe('when ordering ages', function () {
            it('should put "0-9" first', function () {
                expect(vm.orderAges({name: '0-9'})).toBeLessThan(vm.orderAges({name: '10-19'}));
            });

            it('should put "100+" last', function () {
                expect(vm.orderAges({name: '100+'})).toBeGreaterThan(vm.orderAges({name: '90-99'}));
            });

            it('should sort the rest by tens digit of lower bound', function () {
                expect(vm.orderAges({name: '10-19'})).toBeLessThan(vm.orderAges({name: '20-29'}));
            });
        });
    });
})();
