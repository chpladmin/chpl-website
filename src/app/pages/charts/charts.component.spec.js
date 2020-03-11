(() => {
    'use strict';

    describe('the Charts component', () => {
        var $compile, $log, $q, $rootScope, ctrl, el, mock, networkService, scope;
        mock = {
        };

        beforeEach(() => {
            angular.mock.module('chpl.charts', $provide => {
                $provide.factory('chplChartsDeveloperDirective', () => ({}));
                $provide.factory('chplChartsProductDirective', () => ({}));
                $provide.factory('chplChartsSedDirective', () => ({}));
                $provide.factory('chplChartsSurveillanceDirective', () => ({}));
                $provide.decorator('networkService', $delegate => {
                    $delegate.getCriterionProductStatistics = jasmine.createSpy('getCriterionProductStatistics');
                    $delegate.getIncumbentDevelopersStatistics = jasmine.createSpy('getIncumbentDevelopersStatistics');
                    $delegate.getListingCountStatistics = jasmine.createSpy('getListingCountStatistics');
                    $delegate.getNonconformityStatisticsCount = jasmine.createSpy('getNonconformityStatisticsCount');
                    $delegate.getSedParticipantStatisticsCount = jasmine.createSpy('getSedParticipantStatisticsCount');
                    $delegate.getParticipantGenderStatistics = jasmine.createSpy('getParticipantGenderStatistics');
                    $delegate.getParticipantAgeStatistics = jasmine.createSpy('getParticipantAgeStatistics');
                    $delegate.getParticipantEducationStatistics = jasmine.createSpy('getParticipantEducationStatistics');
                    $delegate.getParticipantProfessionalExperienceStatistics = jasmine.createSpy('getParticipantProfessionalExperienceStatistics');
                    $delegate.getParticipantComputerExperienceStatistics = jasmine.createSpy('getParticipantComputerExperienceStatistics');
                    $delegate.getParticipantProductExperienceStatistics = jasmine.createSpy('getParticipantProductExperienceStatistics');
                    return $delegate;
                });
            });

            inject((_$compile_, _$log_, _$q_, _$rootScope_, _networkService_) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                $rootScope = _$rootScope_;
                networkService = _networkService_;
                networkService.getCriterionProductStatistics.and.returnValue($q.when(mock));
                networkService.getIncumbentDevelopersStatistics.and.returnValue($q.when(mock));
                networkService.getListingCountStatistics.and.returnValue($q.when(mock));
                networkService.getNonconformityStatisticsCount.and.returnValue($q.when(mock));
                networkService.getSedParticipantStatisticsCount.and.returnValue($q.when(mock));
                networkService.getParticipantGenderStatistics.and.returnValue($q.when(mock));
                networkService.getParticipantAgeStatistics.and.returnValue($q.when(mock));
                networkService.getParticipantEducationStatistics.and.returnValue($q.when(mock));
                networkService.getParticipantProfessionalExperienceStatistics.and.returnValue($q.when(mock));
                networkService.getParticipantComputerExperienceStatistics.and.returnValue($q.when(mock));
                networkService.getParticipantProductExperienceStatistics.and.returnValue($q.when(mock));

                scope = $rootScope.$new();
                el = angular.element('<chpl-charts></chpl-charts>');

                $compile(el)(scope);
                scope.$digest();
                ctrl = el.isolateScope().$ctrl;
            });
        });

        afterEach(() => {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(o => angular.toJson(o)).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        describe('view', () => {
            it('should be compiled', () => {
                expect(el.html()).not.toEqual(null);
            });
        });

        describe('controller', () => {
            it('should exist', () => {
                expect(ctrl).toEqual(jasmine.any(Object));
            });

            it('should default to product charts', () => {
                expect(ctrl.chartState).toEqual({
                    tab: 'product',
                });
            });

            describe('during load', () => {
                it('should load the sed participant count statistics', () => {
                    expect(networkService.getSedParticipantStatisticsCount).toHaveBeenCalled();
                });

                describe('of the nonconformity statistics', () => {
                    it('should load the nonconformity count statistics', () => {
                        expect(networkService.getNonconformityStatisticsCount).toHaveBeenCalled();
                    });
                });

                describe('of the criterion/product statistics', () => {
                    it('should call the network service', () => {
                        expect(networkService.getCriterionProductStatistics).toHaveBeenCalled();
                    });
                });

                describe('of the incumbent developers statistics', () => {
                    it('should call the network service', () => {
                        expect(networkService.getIncumbentDevelopersStatistics).toHaveBeenCalled();
                    });
                });

                describe('of the listing count statistics', () => {
                    it('should call the network service', () => {
                        expect(networkService.getListingCountStatistics).toHaveBeenCalled();
                    });
                });
            });
        });
    });
})();
