(function () {
    'use strict';

    describe('the SED Participant Modal controller', function () {
        var $log, $q, Mock, mock, networkService, scope, vm;

        mock = {};
        mock.participant = {
            educationTypeName: 'edTypeName',
            educationTypeId: 'edTypeId',
            ageRange: 'ageRnge',
            ageRangeId: 'ageRngeId',
        };

        beforeEach(function () {
            module('chpl', 'chpl.mock', 'chpl.templates', function ($provide) {
                $provide.decorator('networkService', function ($delegate) {
                    $delegate.getAgeRanges = jasmine.createSpy('getAgeRanges');
                    $delegate.getEducation = jasmine.createSpy('getEducation');
                    return $delegate;
                });
            });

            inject(function ($controller, _$log_, _$q_, $rootScope, _Mock_, _networkService_) {
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

        it('should load Education and AgeRanges on load', function () {
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

        describe('with respect to changes', function () {
            it('should not mark itself as changed if cancelled', function () {
                vm.participant.changed = true;
                vm.cancel();
                expect(vm.participant.changed).toBeUndefined();
            });

            it('should be able to mark itself as changed when the participant has an id', function () {
                vm.participant.testParticipantId = 1;
                expect(vm.participant.changed).toBeUndefined();
                vm.changed();
                expect(vm.participant.changed).toBe(true);
            });

            it('should not mark itself as changed if the participant has no id', function () {
                expect(vm.participant.changed).toBeUndefined();
                vm.changed();
                expect(vm.participant.changed).toBeUndefined();
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
                    testParticipantId: 1,
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
                expect(Mock.modalInstance.close).toHaveBeenCalledWith(aParticipant);
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
