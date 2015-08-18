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
                mockCommonService.vendors = {vendors: [{name: 'Vendor 1'}, {name: 'Vendor 2'}]};
                mockCommonService.products = ['Product 1', 'Product 2'];
                mockCommonService.certs = ['Cert 1', 'Cert 2'];
                mockCommonService.cqms = ['CQM 1', 'CQM 2'];
                mockCommonService.editions = ['Edition 1', 'Edition 2'];
                mockCommonService.classifications = ['Classification 1', 'Classification 2'];
                mockCommonService.practices  = ['Practice 1', 'Practice 2'];
                mockCommonService.certBodies  = ['CB 1', 'CB 2'];

                mockCommonService.search = function (query) {
                    var defer = $q.defer();
                    defer.resolve(this.products);
                    return defer.promise;
                };

                mockCommonService.getVendors = function () {
                    var defer = $q.defer();
                    defer.resolve(this.vendors);
                    return defer.promise;
                };

                mockCommonService.getProducts = function () {
                    var defer = $q.defer();
                    defer.resolve(this.products);
                    return defer.promise;
                };

                mockCommonService.getCerts = function () {
                    var defer = $q.defer();
                    defer.resolve(this.certs);
                    return defer.promise;
                };

                mockCommonService.getCQMs = function () {
                    var defer = $q.defer();
                    defer.resolve(this.cqms);
                    return defer.promise;
                };

                mockCommonService.getEditions = function () {
                    var defer = $q.defer();
                    defer.resolve(this.editions);
                    return defer.promise;
                };

                mockCommonService.getClassifications = function () {
                    var defer = $q.defer();
                    defer.resolve(this.classifications);
                    return defer.promise;
                };

                mockCommonService.getPractices = function () {
                    var defer = $q.defer();
                    defer.resolve(this.practices);
                    return defer.promise;
                };

                mockCommonService.getCertBodies = function () {
                    var defer = $q.defer();
                    defer.resolve(this.certBodies);
                    return defer.promise;
                };

                mockCommonService.getCertsNCQMs = function () {
                    var defer = $q.defer();
                    defer.resolve(this.certs.concat(this.cqms));
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

        it('should load filter data on init', function () {
            expect(scope.certs).toEqual(commonService.certs);
            expect(scope.cqms).toEqual(commonService.cqms);
            expect(scope.editions).toEqual(commonService.editions);
            expect(scope.classifications).toEqual(commonService.classifications);
            expect(scope.practices).toEqual(commonService.practices);
            expect(scope.bodies).toEqual(commonService.bodies);
            expect(scope.certsNcqms).toEqual(commonService.certs.concat(commonService.cqms));
        });

        it('should toggle cert filters on and off', function () {
            var result = Object.create(null);
            expect(scope.certFilters).toEqual(result);
            scope.toggleCertFilter('category', 'title', 'number');
            result['category:title'] = 'number';
            expect(scope.certFilters).toEqual(result);
            delete result['category:title'];
            scope.toggleCertFilter('category', 'title', 'number');
            expect(scope.certFilters).toEqual(result);
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

        it('should return a number to help with sorting of certs and CQMs', function () {
            var value = { numCerts: 4, numCQMs: 4 };
            expect(scope.sorts.certs(value)).toBe(8);
        });

        it('should have a way to clear search terms and results', function () {
            scope.clear();
            expect(scope.searchResults).toEqual([]);
            expect(scope.displayedResults).toEqual([]);
            expect(scope.searchTerm).toEqual('');
            expect(scope.vendorTerm).toEqual('');
            expect(scope.productTerm).toEqual('');
            expect(scope.versionTerm).toEqual('');
            expect(scope.certTerm).toEqual('');
            expect(scope.cqmTerm).toEqual('');
            expect(scope.editionTerm).toEqual('');
            expect(scope.classificationTerm).toEqual('');
            expect(scope.practiceTerm).toEqual('');
            expect(ctrl.compareIds).toEqual(Object.create(null));
        });

        it('should have a way to clear filters', function () {
            scope.clearFilter();

            expect(scope.filterGroup.vendor).toEqual('');
            expect(scope.filterGroup.product).toEqual('');
            expect(scope.filterGroup.edition).toEqual('');
            expect(scope.filterGroup.classification).toEqual('');
            expect(scope.filterGroup.practiceType).toEqual('');
            expect(scope.filterGroup.certBody).toEqual('');

        });
    });
})();
