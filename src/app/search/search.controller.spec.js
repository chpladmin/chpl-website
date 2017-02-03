(function () {
    'use strict';

    describe('chpl.search.controller', function () {

        var commonService, scope, vm, $log, $location, $q, Mock;

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
            module('chpl.mock');
            module('chpl.search', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.getAll = jasmine.createSpy('getAll');
                    $delegate.getSearchOptions = jasmine.createSpy('getSearchOptions');
                    return $delegate;
                });
            });

            inject(function (_$log_, $rootScope, $controller, _commonService_, _$location_, _$q_, _Mock_) {
                $log = _$log_;
                $q = _$q_;
                $location = _$location_;
                Mock = _Mock_;
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

        it('should know which elements are selected for comparison', function () {
            expect(vm.compareCps).toBeUndefined();
            vm.toggleCompare({id: 1});
            expect(vm.compareCps.length).toBe(1);
            vm.toggleCompare({id: 1});
            expect(vm.compareCps.length).toBe(0);
        });

        it('should redirect to /compare when "compare" is clicked', function () {
            spyOn($location, 'path');

            vm.toggleCompare({id: 123});
            vm.toggleCompare({id: 234});
            vm.compare();

            expect($location.path).toHaveBeenCalledWith('/compare/123&234');
        });

        it('should not redirect to /compare unless there are at least 2 ids to compare', function () {
            spyOn($location, 'path');

            vm.compare();

            expect($location.path).not.toHaveBeenCalled();

            vm.toggleCompare({id:123});

            vm.compare();
            expect($location.path).not.toHaveBeenCalled();
        });

        it('should have a way to clear search terms and results', function () {
            vm.searchForm = {};
            vm.searchForm.$setPristine = function () {};
            vm.clear();
            expect(vm.query.searchTerm).toBeUndefined();
            expect(vm.compareCps).toEqual([]);
        });

        describe('certificationStatus filters', function () {

            var objToFilter;

            beforeEach(function () {
                objToFilter = {id: 1, statuses: {active: 1, withdrawnByDeveloper: 0, retired: 1, withdrawnByAcb: 0, suspendedByAcb: 0}};
            });

            it('should have a filter to filter out certificationStatuses', function () {
                expect(vm.certificationStatusFilter).toBeDefined();
            });

            it('should return false if the selected status has 0 objects', function () {
                vm.refineModel.certificationStatus['Active'] = false;
                vm.refineModel.certificationStatus['Withdrawn by ONC-ACB'] = false;
                vm.refineModel.certificationStatus['Suspended by ONC-ACB'] = false;
                vm.refineModel.certificationStatus['Withdrawn By Developer'] = true;
                vm.refineModel.certificationStatus['Withdrawn By Developer Under Surveillance/Review'] = false;
                vm.refineModel.certificationStatus['Retired'] = false;
                expect(vm.certificationStatusFilter(objToFilter)).toBe(false);
            });

            it('should return true if the selected status has 1 or more objects', function () {
                vm.refineModel.certificationStatus['Active'] = true;
                expect(vm.certificationStatusFilter(objToFilter)).toBe(true);
            });

            it('should return true if the object has no statuses', function () {
                delete objToFilter.statuses;
                expect(vm.certificationStatusFilter(objToFilter)).toBe(true);
            });

            it('should have a function to get the right icon for a status', function () {
                expect(vm.statusFont).toBeDefined();
            });

            it('should get the right icon for various statuses', function () {
                expect(vm.statusFont('Active')).toBe('fa-check-circle status-good');
                expect(vm.statusFont('Retired')).toBe('fa-university status-neutral');
                expect(vm.statusFont('Suspended by ONC')).toBe('fa-minus-square status-warning');
                expect(vm.statusFont('Suspended by ONC-ACB')).toBe('fa-minus-circle status-warning');
                expect(vm.statusFont('Terminated by ONC')).toBe('fa-window-close status-bad');
                expect(vm.statusFont('Withdrawn by Developer Under Surveillance/Review')).toBe('fa-exclamation-circle status-bad');
                expect(vm.statusFont('Withdrawn by Developer')).toBe('fa-stop-circle status-neutral');
                expect(vm.statusFont('Withdrawn by ONC-ACB')).toBe('fa-times-circle status-bad');
            });
        });
    });
})();
