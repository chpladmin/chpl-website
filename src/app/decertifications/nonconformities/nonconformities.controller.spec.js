(function () {
    'use strict';

    describe('chpl.decertifications.nonconformities.controller', function () {

        var commonService, scope, vm, $log, $q, Mock;

        var mock = {};
        mock.options = {};
        mock.options.developerNames = ['Developer 1', 'Developer 2'];
        mock.options.productNames = ['Product 1', 'Product 2'];
        mock.options.certificationCriterionNumbers = ['Cert 1', 'Cert 2'];
        mock.options.cqmCriterionNumbers = ['CQM 1', 'CQM 2'];
        mock.options.editions = ['Edition 1', 'Edition 2'];
        mock.options.practiceTypeNames  = ['Practice 1', 'Practice 2'];
        mock.options.certBodyNames  = ['CB 1', 'CB 2'];
        mock.options.certificationStatuses = ['Active', 'Retired'];

        mock.refineModel = {
            certificationStatus: {
                'Active': true,
                'Retired': true,
                'Suspended by ONC-ACB': true,
                'Withdrawn by Developer': true,
                'Withdrawn by Developer Under Surveillance/Review': true,
                'Withdrawn by ONC-ACB': true,
                'Suspended by ONC': true,
                'Terminated by ONC': true
            },
            certificationEdition: {
                '2011': true,
                '2014': true,
                '2015': true
            },
            acb: {
                'Drummond Group': true,
                'ICSA Labs': true,
                'InfoGard': true
            }
        }

        beforeEach(function () {
            module('chpl.mock', 'chpl.decertifications', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.getAll = jasmine.createSpy('getAll');
                    $delegate.getSearchOptions = jasmine.createSpy('getSearchOptions');
                    return $delegate;
                });
            });

            inject(function (_$log_, $rootScope, $controller, _commonService_, _$q_, _Mock_) {
                $log = _$log_;
                $q = _$q_;
                Mock = _Mock_;
                commonService = _commonService_;
                commonService.getAll.and.returnValue($q.when({'results': Mock.allCps}));
                commonService.getSearchOptions.and.returnValue($q.when(Mock.search_options));

                scope = $rootScope.$new();
                vm = $controller('NonconformitiesController', {
                    $scope: scope,
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
    });
})();
