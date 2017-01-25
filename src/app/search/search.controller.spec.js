(function () {
    'use strict';

    describe('chpl.search.controller', function () {

        var commonService, scope, vm, $log, $location, $q;

        var mock = {};
        mock.products = [
            { developer: 'Developer', product: 'Product' }
        ];
        mock.searchResult = {data: {recordCount: 2, results: [{}, {}]}};
        mock.options = {};
        mock.options.developerNames = ['Developer 1', 'Developer 2'];
        mock.options.productNames = ['Product 1', 'Product 2'];
        mock.options.certificationCriterionNumbers = ['Cert 1', 'Cert 2'];
        mock.options.cqmCriterionNumbers = ['CQM 1', 'CQM 2'];
        mock.options.editions = ['Edition 1', 'Edition 2'];
        mock.options.practiceTypeNames  = ['Practice 1', 'Practice 2'];
        mock.options.certBodyNames  = ['CB 1', 'CB 2'];
        mock.options.certificationStatuses = ['Active', 'Retired'];
        mock.options.certsNcqms = mock.options.certificationCriterionNumbers.concat(mock.options.cqmCriterionNumbers);

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
            module('chpl.search', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.search = jasmine.createSpy('search');
                    $delegate.searchAdvanced = jasmine.createSpy('searchadvanced');
                    $delegate.getSearchOptions = jasmine.createSpy('getSearchOptions');
                    return $delegate;
                });
            });

            inject(function (_$log_, $rootScope, $controller, _commonService_, _$location_, _$q_) {
                $log = _$log_;
                $q = _$q_;
                $location = _$location_;
                commonService = _commonService_;
                commonService.search.and.returnValue($q.when(mock.searchResult.data));
                commonService.searchAdvanced.and.returnValue($q.when(mock.searchResult.data));
                commonService.getSearchOptions.and.returnValue($q.when(mock.options));

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
            expect(vm.compareCps).toEqual([]);
            vm.toggleCompare({id: 1});
            expect(vm.compareCps.length).toBe(1);
            vm.toggleCompare({id: 1});
            expect(vm.compareCps.length).toBe(0);
        });

        it('should know if it has results', function () {
            scope.searchResults = ['one', 'two'];
            expect(scope.hasResults()).toBe(true);
        });

        it('should perform a simple string search', function () {
            scope.searchTerm = 'simpletext';
            scope.isSimpleSearch = true;

            vm.search();
            scope.$digest();

            expect(scope.hasResults()).toBe(true);
        });

        it('should perform a simple search on an object', function () {
            scope.searchTerm = { value: 'object value' };
            scope.isSimpleSearch = true;

            vm.search();
            scope.$digest();

            expect(scope.hasResults()).toBe(true);
        });

        it('should perform an advanced search', function () {
            scope.isSimpleSearch = false;

            vm.search();
            scope.$digest();

            expect(scope.hasResults()).toBe(true);
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
            scope.clear();
            expect(scope.searchResults).toEqual([]);
            expect(scope.displayedResults).toEqual([]);
            expect(vm.query.searchTerm).toBeUndefined();
            expect(vm.query.developer).toBeUndefined();
            expect(vm.query.product).toBeUndefined();
            expect(vm.query.version).toBeUndefined();
            expect(vm.query.certificationCriteria).toBeUndefined();
            expect(vm.query.cqms).toBeUndefined();
            expect(vm.query.certificationEdition).toBeUndefined();
            expect(vm.query.practiceType).toBeUndefined();
            expect(vm.compareCps).toEqual([]);
        });

        describe('filters', function () {
            beforeEach(function () {
                vm.clearFilters();
            });

            it('should change the filter to be the correct filter object', function () {
                expect(vm.refineModel).toEqual(mock.refineModel);

                vm.setRefine();

                expect(vm.query.certificationStatus).toEqual(mock.refine.certificationStatus);
                expect(vm.query.certificationEdition).toEqual(mock.refine.certificationEdition);
            });

            it('should have a way to tell if a filter has changed from the default', function () {
                expect(vm.isChangedFromDefault('certificationStatus', 'Active')).toBe(false);
                expect(vm.isChangedFromDefault('certificationEdition', '2014')).toBe(false);
                expect(vm.isChangedFromDefault('acb', 'ICSA Labs')).toBe(false);
                expect(vm.isChangedFromDefault('cqms', 'CMS05')).toBe(undefined);
                expect(vm.isChangedFromDefault('hasHadSurveillance', 'never')).toBe(undefined);

                vm.refineModel.certificationStatus['Active'] = false;
                vm.refineModel.certificationEdition['2014'] = false;
                vm.refineModel.acb['ICSA Labs'] = false;
                vm.refineModel.cqms = {CMS05: true};
                vm.refineModel.hasHadSurveillance = 'never';

                expect(vm.isChangedFromDefault('certificationStatus', 'Active')).toBe(true);
                expect(vm.isChangedFromDefault('certificationEdition', '2014')).toBe(true);
                expect(vm.isChangedFromDefault('acb', 'ICSA Labs')).toBe(true);
                expect(vm.isChangedFromDefault('cqms', 'CMS05')).toBe(true);
                expect(vm.isChangedFromDefault('hasHadSurveillance', 'never')).toBe(true);
            });

            it('should have a way to tell if a filter category has any change from the default', function () {
                expect(vm.isCategoryChanged(['certificationStatus','acb'])).toBe(false);
                vm.refineModel.certificationStatus['Active'] = false;
                expect(vm.isCategoryChanged(['certificationStatus','acb'])).toBe(true);
                vm.refineModel.certificationStatus['Active'] = true;
                vm.refineModel.acb['ICSA Labs'] = false;
                expect(vm.isCategoryChanged(['certificationStatus','acb'])).toBe(true);
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
                    expect(vm.statusFont('Suspended by ONC-ACB')).toBe('fa-warning status-warning');
                    expect(vm.statusFont('Retired')).toBe('fa-close status-bad');
                    expect(vm.statusFont('Withdrawn by Developer')).toBe('fa-times-circle status-warning');
                    expect(vm.statusFont('Withdrawn by Developer Under Surveillance/Review')).toBe('fa-exclamation-circle status-bad');
                    expect(vm.statusFont('Withdrawn by ONC-ACB')).toBe('fa-minus-circle status-bad');
                    expect(vm.statusFont('Suspended by ONC')).toBe('fa-minus-square status-warning');
                    expect(vm.statusFont('Terminated by ONC')).toBe('fa-window-close status-bad');
                });
            });
        });
    });
})();
