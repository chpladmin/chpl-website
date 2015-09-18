;(function () {
    'use strict';

    angular.module('app.search')
        .controller('SearchController', ['$scope', '$log', '$location', '$localStorage', 'commonService', function ($scope, $log, $location, $localStorage, commonService) {
            var self = this;
            $scope.searchResults = [];
            $scope.displayedResults = [];
            $scope.lookaheadSource = {all: [], vendors: [], products: []};
            $scope.filterGroup = {};
            self.hasDoneASearch = false;
            $scope.resultCount = 0;
            $scope.query = {simple: true,
                            orderBy: 'vendor',
                            sortDescending: false,
                            pageNumber: 0,
                            pageSize: 10,
                            visibleOnCHPL: 'yes'};

            if ($localStorage.searchResults) {
                $scope.searchResults = $localStorage.searchResults.results;
                $scope.displayedResults = [].concat($scope.searchResults);
                self.hasDoneASearch = true;
                $scope.resultCount = $localStorage.searchResults.recordCount;
            }

            if ($localStorage.query) {
                $scope.query = $localStorage.query;
            }

            self.setupLookahead = function () {
//                if ($localStorage.lookaheadSource && $localStorage.lookaheadSource.all.length > 0) {
//                    $log.info('Restoring lookahead from localstorage');
//                    $scope.lookaheadSource = $localStorage.lookaheadSource;
//                } else {
                    commonService.getVendors()
                        .then(function (vendors) {
                            for (var i = 0; i < vendors.vendors.length; i++) {
                                $scope.lookaheadSource.all.push({type: 'vendor', value: vendors.vendors[i].name});
                                $scope.lookaheadSource.vendors.push({type: 'vendor', value: vendors.vendors[i].name});
                            }
                            $localStorage.lookaheadSource = $scope.lookaheadSource;
                        });
                    commonService.getProducts()
                        .then(function (products) {
//                            for (var i = 0; i < products.products.length; i++) {
//                                $scope.lookaheadSource.all.push({type: 'product', value: products.products[i].name});
//                                $scope.lookaheadSource.products.push({type: 'product', value: products.products[i].name});
//                            }
//                            $localStorage.lookaheadSource = $scope.lookaheadSource;
                        });
//                }
            };
            self.setupLookahead();

            self.setupFilters = function () {
                commonService.getCerts()
                    .then(function (certs) { $scope.certs = certs; });
                commonService.getCQMs()
                    .then(function (cqms) { $scope.cqms = cqms; });
                commonService.getEditions()
                    .then(function (editions) { $scope.editions = editions; });
                commonService.getClassifications()
                    .then(function (classifications) { $scope.classifications = classifications; });
                commonService.getPractices()
                    .then(function (practices) { $scope.practices = practices; });
                commonService.getCertBodies()
                    .then(function (bodies) { $scope.certBodies = bodies; });
                commonService.getCertsNCQMs()
                    .then(function (certsNcqms) { $scope.certsNcqms = certsNcqms; });
            };
            self.setupFilters();

            self.certFilters = Object.create(null);

            self.toggleCertFilter = function (category, title, number) {
                var key = category + ":" + title;
                if (key in self.certFilters) {
                    delete self.certFilters[key];
                } else {
                    self.certFilters[key] = number;
                }
                $log.info(self.certFilters);
            };
            $scope.toggleCertFilter = self.toggleCertFilter;

            self.compareIds = Object.create(null);
            self.getCompareIds = function() {
                return self.compareIds;
            };

            self.toggleCompareId = function (anId) {
                if (anId in self.compareIds) {
                    delete self.compareIds[anId];
                } else {
                    self.compareIds[anId] = true;
                }
            };
            $scope.toggleCompareId = self.toggleCompareId;

            self.search = function () {
                self.hasDoneASearch = true;

                if ($scope.query.searchTermObject !== undefined) {
                    if (typeof($scope.query.searchTermObject) === 'object') {
                        $scope.query.searchTerm = $scope.query.searchTermObject.value;
                    } else {
                        $scope.query.searchTerm = $scope.query.searchTermObject;
                    }
                }
                if ($scope.query.vendorObject !== undefined) {
                    if (typeof($scope.query.vendorObject) === 'object') {
                        $scope.query.vendor = $scope.query.vendorObject.value;
                    } else {
                        $scope.query.vendor = $scope.query.vendorObject;
                    }
                }
                if ($scope.query.productObject !== undefined) {
                    if (typeof($scope.query.productObject) === 'object') {
                        $scope.query.product = $scope.query.productObject.value;
                    } else {
                        $scope.query.product = $scope.query.productObject;
                    }
                }
                commonService.search($scope.query)
                    .then(function (data) {
                        $localStorage.searchResults = data;
                        $scope.searchResults = data.results;
                        $scope.displayedResults = [].concat($scope.searchResults);
                        $scope.resultCount = data.recordCount;
                    }, function (error) {
                        $log.error(error);
                    });

                $localStorage.query = $scope.query;
            };
            $scope.search = self.search;

            $scope.doFilter = function () {
                var certs = [];
                var cqms = [];
                for (var key in self.certFilters) {
                    if (key.indexOf('Clinical') !== 0) {
                        certs.push(self.certFilters[key]);
                    } else {
                        cqms.push(self.certFilters[key]);
                    }
                }
                if (certs.length > 0) $scope.query.certificationCriteria = certs;
                if (cqms.length > 0) $scope.query.cqms = cqms;
                self.search();
            };

            $scope.hasResults = function () {
                return $scope.searchResults !== undefined && $scope.searchResults.length > 0;
            };

            $scope.hasSearched = function () {
                return self.hasDoneASearch;
            };

            $scope.clear = function () {
                delete $localStorage.searchResults;
                delete $localStorage.query;
                delete $localStorage.lookaheadSource;
                $scope.searchResults = [];
                $scope.displayedResults = [];
                $scope.resultCount = 0;
                self.compareIds = Object.create(null);
                self.hasDoneASearch = false;
                $scope.query = {simple: true,
                                orderBy: 'vendor',
                                sortDescending: false,
                                pageNumber: 0,
                                pageSize: 10,
                                visibleOnCHPL: 'yes'};
            };

            $scope.clearFilter = function () {
                delete($scope.query.vendor);
                delete($scope.query.product);
                delete($scope.query.certificationEdition);
                delete($scope.query.productClassification);
                delete($scope.query.practiceType);
                delete($scope.query.certificationBody);

                for (var elem in self.certFilters) {
//                    $log.info(elem);
//                    $scope.certFilter[self.certFilters[elem]].click();
                    delete self.certFilters[elem];
                }
            };

            $scope.compare = function () {
                var comparePath = '/compare/';
                for (var property in self.compareIds) {
                    comparePath += property + '&';
                }
                comparePath = comparePath.substring(0, comparePath.length - 1);
                if (comparePath.indexOf('&') > 0) {
                    $location.path(comparePath);
                }
            };

            $scope.sort = function(header) {
                if (header === $scope.query.orderBy) {
                    $scope.query.sortDescending = !$scope.query.sortDescending;
                } else {
                    $scope.query.sortDescending = false;
                    $scope.query.orderBy = header;
                }
                self.search();
            }

            $scope.pageChanged = function () {
                $scope.query.pageNumber = $scope.visiblePage - 1;
                self.search();
            };
        }]);
})();
