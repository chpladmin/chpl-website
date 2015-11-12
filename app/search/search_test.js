;(function () {
    'use strict';

    describe('app.search.controller', function () {

        var commonService, scope, ctrl, $log, $location;

        beforeEach(function () {
            var mockCommonService = {};
            module('app.search', function($provide) {
                $provide.value('commonService', mockCommonService);
            });

            inject(function($q) {
                mockCommonService.products = [
                    { vendor: 'Vendor', product: 'Product' }
                ];
                mockCommonService.searchResult = {data: {recordCount: 2, results: [{}, {}]}};
                mockCommonService.options = {};
                mockCommonService.options.vendorNames = ['Vendor 1', 'Vendor 2'];
                mockCommonService.options.productNames = ['Product 1', 'Product 2'];
                mockCommonService.options.certificationCriterionNumbers = ['Cert 1', 'Cert 2'];
                mockCommonService.options.cqmCriterionNumbers = ['CQM 1', 'CQM 2'];
                mockCommonService.options.editions = ['Edition 1', 'Edition 2'];
                mockCommonService.options.productClassifications = ['Classification 1', 'Classification 2'];
                mockCommonService.options.practiceTypeNames  = ['Practice 1', 'Practice 2'];
                mockCommonService.options.certBodyNames  = ['CB 1', 'CB 2'];
                mockCommonService.options.certsNcqms = mockCommonService.options.certificationCriterionNumbers.concat(mockCommonService.options.cqmCriterionNumbers);

                mockCommonService.search = function (query,pageNum,pageSize) {
                    var defer = $q.defer();
                    defer.resolve(this.searchResult.data);
                    return defer.promise;
                };

                mockCommonService.searchAdvanced = function (query,pageNum,pageSize) {
                    var defer = $q.defer();
                    defer.resolve(this.searchResult.data);
                    return defer.promise;
                };

                mockCommonService.getSearchOptions = function () {
                    var defer = $q.defer();
                    defer.resolve(this.options);
                    return defer.promise;
                };
            });
        });

        beforeEach(inject(function (_$log_, $rootScope, $controller, _commonService_, _$location_) {
            $log = _$log_;
            scope = $rootScope.$new();
            commonService = _commonService_;
            $location = _$location_;
            ctrl = $controller('SearchController', {
                $scope: scope,
                $location: $location,
                commonService: commonService
            });
            scope.$digest();
        }));

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                console.log('Debug log, ' + $log.debug.logs.length + ' length:\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        it('should exist', function () {
            expect(ctrl).toBeDefined();
        });

        it('should initialize with no search results', function () {
            expect(scope.hasResults()).toBe(false);
        });

        it('should know if it has results', function () {
            expect(ctrl.hasResults).toBeDefined;
        });

        it('should know which elements are selected for comparison', function () {
            expect(ctrl.getCompareIds).toBeDefined();
            ctrl.toggleCompareId('an id');
            expect('an id' in ctrl.getCompareIds()).toBeTruthy();
            ctrl.toggleCompareId('an id');
            expect('an id' in ctrl.getCompareIds()).toBeFalsy();
        });

        it('should know if it has results', function () {
            scope.searchResults = ['one', 'two'];
            expect(scope.hasResults()).toBe(true);
        });

        it('should perform a simple string search', function () {
            scope.searchTerm = 'simpletext';
            scope.isSimpleSearch = true;

            scope.search();
            scope.$digest();

            expect(scope.hasResults()).toBe(true);
        });

        it('should perform a simple search on an object', function () {
            scope.searchTerm = { value: 'object value' };
            scope.isSimpleSearch = true;

            scope.search();
            scope.$digest();

            expect(scope.hasResults()).toBe(true);
        });

        it('should perform an advanced search', function () {
            scope.isSimpleSearch = false;

            scope.search();
            scope.$digest();

            expect(scope.hasResults()).toBe(true);
        });

        it('should redirect to /compare when "compare" is clicked', function () {
            spyOn($location, 'path');

            scope.toggleCompareId('123');
            scope.toggleCompareId('234');
            scope.compare();

            expect($location.path).toHaveBeenCalledWith('/compare/123&234');
        });

        it('should not redirect to /compare unless there are at least 2 ids to compare', function () {
            spyOn($location, 'path');

            scope.compare();

            expect($location.path).not.toHaveBeenCalled();

            scope.toggleCompareId('123');

            scope.compare();
            expect($location.path).not.toHaveBeenCalled();
        });

        it('should have a way to clear search terms and results', function () {
            scope.clear();
            expect(scope.searchResults).toEqual([]);
            expect(scope.displayedResults).toEqual([]);
            expect(scope.query.searchTerm).toBeUndefined();
            expect(scope.query.vendor).toBeUndefined();
            expect(scope.query.product).toBeUndefined();
            expect(scope.query.version).toBeUndefined();
            expect(scope.query.certificationCriteria).toBeUndefined();
            expect(scope.query.cqms).toBeUndefined();
            expect(scope.query.certificationEdition).toBeUndefined();
            expect(scope.query.productClassification).toBeUndefined();
            expect(scope.query.practiceType).toBeUndefined();
            expect(ctrl.compareIds).toEqual(Object.create(null));
        });
    });
})();
