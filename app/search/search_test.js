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
                    { developer: 'Developer', product: 'Product' }
                ];
                mockCommonService.searchResult = {data: {recordCount: 2, results: [{}, {}]}};
                mockCommonService.options = {};
                mockCommonService.options.developerNames = ['Developer 1', 'Developer 2'];
                mockCommonService.options.productNames = ['Product 1', 'Product 2'];
                mockCommonService.options.certificationCriterionNumbers = ['Cert 1', 'Cert 2'];
                mockCommonService.options.cqmCriterionNumbers = ['CQM 1', 'CQM 2'];
                mockCommonService.options.editions = ['Edition 1', 'Edition 2'];
                mockCommonService.options.practiceTypeNames  = ['Practice 1', 'Practice 2'];
                mockCommonService.options.certBodyNames  = ['CB 1', 'CB 2'];
                mockCommonService.options.certificationStatuses = ['Active', 'Retired'];
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

        it('should know if it has results', function () {
            expect(ctrl.hasResults).toBeDefined;
        });

        it('should know which elements are selected for comparison', function () {
            expect(ctrl.compareCps).toEqual([]);
            ctrl.toggleCompare({id: 1});
            expect(ctrl.compareCps.length).toBe(1);
            ctrl.toggleCompare({id: 1});
            expect(ctrl.compareCps.length).toBe(0);
        });

        it('should know if it has results', function () {
            scope.searchResults = ['one', 'two'];
            expect(scope.hasResults()).toBe(true);
        });

        it('should perform a simple string search', function () {
            scope.searchTerm = 'simpletext';
            scope.isSimpleSearch = true;

            ctrl.search();
            scope.$digest();

            expect(scope.hasResults()).toBe(true);
        });

        it('should perform a simple search on an object', function () {
            scope.searchTerm = { value: 'object value' };
            scope.isSimpleSearch = true;

            ctrl.search();
            scope.$digest();

            expect(scope.hasResults()).toBe(true);
        });

        it('should perform an advanced search', function () {
            scope.isSimpleSearch = false;

            ctrl.search();
            scope.$digest();

            expect(scope.hasResults()).toBe(true);
        });

        it('should redirect to /compare when "compare" is clicked', function () {
            spyOn($location, 'path');

            ctrl.toggleCompare({id: 123});
            ctrl.toggleCompare({id: 234});
            ctrl.compare();

            expect($location.path).toHaveBeenCalledWith('/compare/123&234');
        });

        it('should not redirect to /compare unless there are at least 2 ids to compare', function () {
            spyOn($location, 'path');

            ctrl.compare();

            expect($location.path).not.toHaveBeenCalled();

            ctrl.toggleCompare({id:123});

            ctrl.compare();
            expect($location.path).not.toHaveBeenCalled();
        });

        it('should have a way to clear search terms and results', function () {
            ctrl.searchForm = {};
            ctrl.searchForm.$setPristine = function () {};
            scope.clear();
            expect(scope.searchResults).toEqual([]);
            expect(scope.displayedResults).toEqual([]);
            expect(ctrl.query.searchTerm).toBeUndefined();
            expect(ctrl.query.developer).toBeUndefined();
            expect(ctrl.query.product).toBeUndefined();
            expect(ctrl.query.version).toBeUndefined();
            expect(ctrl.query.certificationCriteria).toBeUndefined();
            expect(ctrl.query.cqms).toBeUndefined();
            expect(ctrl.query.certificationEdition).toBeUndefined();
            expect(ctrl.query.practiceType).toBeUndefined();
            expect(ctrl.compareCps).toEqual([]);
        });
    });
})();
