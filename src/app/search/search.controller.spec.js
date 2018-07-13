(function () {
    'use strict';

    describe('chpl.search.controller', function () {

        var $interval, $location, $log, $q, $uibModal, CACHE_REFRESH_TIMEOUT, Mock, networkService, scope, vm;

        var mock = {};
        mock.products = [
            { developer: 'Developer', product: 'Product' },
        ];
        mock.options = {};
        mock.options.developerNames = ['Developer 1', 'Developer 2'];
        mock.options.productNames = ['Product 1', 'Product 2'];
        mock.options.certificationCriterionNumbers = ['Cert 1', 'Cert 2'];
        mock.options.cqmCriterionNumbers = ['CQM 1', 'CQM 2'];
        mock.options.editions = ['Edition 1', 'Edition 2'];
        mock.options.practiceTypeNames = ['Practice 1', 'Practice 2'];
        mock.options.certBodyNames = ['CB 1', 'CB 2'];
        mock.options.certificationStatuses = ['Active', 'Retired'];
        mock.fakeModal = {
            result: {
                then: function (confirmCallback, cancelCallback) {
                    this.confirmCallBack = confirmCallback;
                    this.cancelCallback = cancelCallback;
                }},
            close: function (item) { this.result.confirmCallBack(item); },
            dismiss: function (type) { this.result.cancelCallback(type); },
        };
        mock.fakeModalOptions = {
            templateUrl: 'chpl.components/certificationStatus/certificationStatus.html',
            controller: 'CertificationStatusController',
            controllerAs: 'vm',
            animation: false,
            backdrop: 'static',
            keyboard: false,
            size: 'lg',
        };

        mock.refineModel = {
            certificationStatus: {
                'Active': true,
                'Retired': false,
                'Suspended by ONC-ACB': true,
                'Withdrawn by Developer': false,
                'Withdrawn by Developer Under Surveillance/Review': false,
                'Withdrawn by ONC-ACB': false,
                'Suspended by ONC': true,
                'Terminated by ONC': false,
            },
            certificationEdition: {
                '2011': false,
                '2014': true,
                '2015': true,
            },
            acb: {
                'Drummond Group': true,
                'ICSA Labs': true,
                'InfoGard': true,
            },
        }
        mock.refine = {
            certificationStatuses: ['Active', 'Suspended by ONC-ACB', 'Suspended by ONC'],
            certificationEditions: ['2014', '2015'],
            certificationBodies: ['Drummond Group', 'ICSA Labs', 'InfoGard'],
        };

        beforeEach(function () {
            module('chpl.mock', 'chpl.search', function ($provide) {
                $provide.decorator('networkService', function ($delegate) {
                    $delegate.getAll = jasmine.createSpy('getAll');
                    $delegate.getSearchOptions = jasmine.createSpy('getSearchOptions');
                    return $delegate;
                });
            });

            inject(function ($controller, _$interval_, _$location_, _$log_, _$q_, $rootScope, _$uibModal_, _CACHE_REFRESH_TIMEOUT_, _Mock_, _networkService_) {
                $interval = _$interval_;
                $location = _$location_;
                $log = _$log_;
                $q = _$q_;
                $uibModal = _$uibModal_;
                CACHE_REFRESH_TIMEOUT = _CACHE_REFRESH_TIMEOUT_;
                Mock = _Mock_;
                networkService = _networkService_;

                spyOn($uibModal, 'open').and.callFake(function () {
                    return mock.fakeModal;
                });
                networkService.getAll.and.returnValue($q.when({'results': angular.copy(Mock.allCps)}));
                networkService.getSearchOptions.and.returnValue($q.when(Mock.search_options));

                scope = $rootScope.$new();
                vm = $controller('SearchController', {
                    $scope: scope,
                    $location: $location,
                    networkService: networkService,
                });
                scope.$digest();
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + angular.toJson($log.debug.logs));
                /* eslint-enable no-console,angular/log */
            }
        });

        it('should exist', function () {
            expect(vm).toBeDefined();
        });

        it('should know if it has results', function () {
            expect(vm.hasResults).toBeDefined;
        });

        describe('viewing certification status', function () {
            it('should have a function to view certification statuses', function () {
                expect(vm.viewCertificationStatusLegend).toBeDefined();
            });

            it('should create a modal instance when then certification status legend is viewed', function () {
                expect(vm.viewCertificationStatusLegendInstance).toBeUndefined();
                vm.viewCertificationStatusLegend();
                expect(vm.viewCertificationStatusLegendInstance).toBeDefined();
                expect($uibModal.open).toHaveBeenCalledWith(mock.fakeModalOptions);
            });

            it('should log that the status was closed', function () {
                var initialCount = $log.info.logs.length;
                vm.viewCertificationStatusLegend();
                vm.viewCertificationStatusLegendInstance.close('closed');
                expect($log.info.logs.length).toBe(initialCount + 1);
            });

            it('should log that the status was closed', function () {
                var initialCount = $log.info.logs.length;
                vm.viewCertificationStatusLegend();
                vm.viewCertificationStatusLegendInstance.dismiss('dismissed');
                expect($log.info.logs.length).toBe(initialCount + 1);
            });
        });

        describe('updating results data in the background', function () {
            it('should refresh the /certified_products list on a timer', function () {
                expect(networkService.getAll.calls.count()).toBe(1);
                $interval.flush(CACHE_REFRESH_TIMEOUT * 1000);
                expect(networkService.getAll.calls.count()).toBe(2);
                $interval.flush(CACHE_REFRESH_TIMEOUT * 1000);
                expect(networkService.getAll.calls.count()).toBe(3);
            });

            it('should be able to stop the refresh interval', function () {
                expect(vm.stopCacheRefreshPromise).toBeDefined();
                expect(vm.stopCacheRefresh).toBeDefined();
                vm.stopCacheRefresh();
                expect(vm.stopCacheRefreshPromise).not.toBeDefined();
            });

            it('should integrate results on the timer', function () {
                var initialCount = Mock.allCps.length;
                var newResults = angular.copy(Mock.allCps);
                newResults.push(angular.copy(newResults[0]));
                expect(vm.allCps.length).toBe(initialCount);
                networkService.getAll.and.returnValue($q.when({'results': newResults}));
                $interval.flush(CACHE_REFRESH_TIMEOUT * 1000);
                expect(vm.allCps.length).toBe(initialCount + 1);
            });
        });
    });
})();
