(function () {
    'use strict';

    describe('chpl.search.controller', function () {

        var commonService, scope, vm, $log, $location, $q, Mock, $uibModal;

        var mock = {};
        mock.products = [
            { developer: 'Developer', product: 'Product' }
        ];
        mock.options = {};
        mock.options.developerNames = ['Developer 1', 'Developer 2'];
        mock.options.productNames = ['Product 1', 'Product 2'];
        mock.options.certificationCriterionNumbers = ['Cert 1', 'Cert 2'];
        mock.options.cqmCriterionNumbers = ['CQM 1', 'CQM 2'];
        mock.options.editions = ['Edition 1', 'Edition 2'];
        mock.options.practiceTypeNames  = ['Practice 1', 'Practice 2'];
        mock.options.certBodyNames  = ['CB 1', 'CB 2'];
        mock.options.certificationStatuses = ['Active', 'Retired'];
        mock.fakeModal = {
            result: {
                then: function (confirmCallback, cancelCallback) {
                    this.confirmCallBack = confirmCallback;
                    this.cancelCallback = cancelCallback;
                }},
            close: function (item) { this.result.confirmCallBack(item); },
            dismiss: function (type) { this.result.cancelCallback(type); }
        };
        mock.fakeModalOptions = {
            templateUrl: 'app/components/certificationStatus/certificationStatus.html',
            controller: 'CertificationStatusController',
            controllerAs: 'vm',
            animation: false,
            backdrop: 'static',
            keyboard: false,
            size: 'lg'
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
                'Terminated by ONC': false
            },
            certificationEdition: {
                '2011': false,
                '2014': true,
                '2015': true
            },
            acb: {
                'Drummond Group': true,
                'ICSA Labs': true,
                'InfoGard': true
            }
        }
        mock.refine = {
            certificationStatuses: [
                'Active', 'Suspended by ONC-ACB', 'Suspended by ONC'
            ],
            certificationEditions: [
                '2014', '2015'
            ],
            certificationBodies: [
                'Drummond Group', 'ICSA Labs', 'InfoGard'
            ]
        };

        beforeEach(function () {
            module('chpl.mock', 'chpl.search', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.getAll = jasmine.createSpy('getAll');
                    $delegate.getSearchOptions = jasmine.createSpy('getSearchOptions');
                    return $delegate;
                });
            });

            inject(function (_$log_, $rootScope, $controller, _commonService_, _$location_, _$q_, _Mock_, _$uibModal_) {
                $log = _$log_;
                $q = _$q_;
                $location = _$location_;
                Mock = _Mock_;
                $uibModal = _$uibModal_;
                spyOn($uibModal, 'open').and.callFake(function () {
                    return mock.fakeModal;
                });
                commonService = _commonService_;
                commonService.getAll.and.returnValue($q.when({'results': Mock.allCps}));
                commonService.getSearchOptions.and.returnValue($q.when(Mock.search_options));

                scope = $rootScope.$new();
                vm = $controller('SearchController', {
                    $scope: scope,
                    $location: $location,
                    commonService: commonService
                });
                scope.$digest();
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                //console.log('Debug log, ' + $log.debug.logs.length + ' length:\n Debug: ' + $log.debug.logs.join('\n Debug: '));
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
    });
})();
