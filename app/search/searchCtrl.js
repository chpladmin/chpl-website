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
            self.defaultQuery = {simple: true,
                            orderBy: 'vendor',
                            sortDescending: false,
                            pageNumber: 0,
                            pageSize: 20,
                            visibleOnCHPL: 'yes'};
            $scope.query = angular.copy(self.defaultQuery);

            if ($localStorage.searchResults) {
                $scope.searchResults = $localStorage.searchResults.results;
                $scope.displayedResults = [].concat($scope.searchResults);
                self.hasDoneASearch = true;
                $scope.resultCount = $localStorage.searchResults.recordCount;
            }

            if ($localStorage.query) {
                $scope.query = $localStorage.query;
            }

            self.populateSearchOptions = function () {
                commonService.getSearchOptions()
                    .then(function (options) {
                        $scope.certs = options.certificationCriterionNumbers;
                        $scope.cqms = options.cqmCriterionNumbers;
                        $scope.editions = options.editions;
                        $scope.classifications = options.productClassifications;
                        $scope.practices = options.practiceTypeNames;
                        $scope.certBodies = options.certBodyNames;
                        $scope.certsNcqms = options.certificationCriterionNumbers.concat(options.cqmCriterionNumbers);
                        if ($localStorage.lookaheadSource && $localStorage.lookaheadSource.all.length > 0) {
                            $log.info('Restoring lookahead from localstorage');
                            $scope.lookaheadSource = $localStorage.lookaheadSource;
                        } else {
                            for (var i = 0; i < options.vendorNames.length; i++) {
                                $scope.lookaheadSource.all.push({type: 'vendor', value: options.vendorNames[i]});
                                $scope.lookaheadSource.vendors.push({type: 'vendor', value: options.vendorNames[i]});
                            }
                            for (var i = 0; i < options.productNames.length; i++) {
                                $scope.lookaheadSource.all.push({type: 'product', value: options.productNames[i]});
                                $scope.lookaheadSource.products.push({type: 'product', value: options.productNames[i]});
                            }
                            $localStorage.lookaheadSource = $scope.lookaheadSource;
                        }
                    });
            };
            self.populateSearchOptions();

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
                if ($scope.query.searchTermObject !== undefined) {
                    if (typeof($scope.query.searchTermObject) === 'string' && $scope.query.searchTermObject.length > 0) {
                        $scope.query.searchTermObject = {type: 'previous search', value: $scope.query.searchTermObject};
                        $scope.lookaheadSource.all.push($scope.query.searchTermObject);
                    }
                    $scope.query.searchTerm = $scope.query.searchTermObject.value;
                }
                if ($scope.query.vendorObject !== undefined) {
                    if (typeof($scope.query.vendorObject) === 'string' && $scope.query.vendorObject.length > 0) {
                        $scope.query.vendorObject = {type: 'previous search', value: $scope.query.vendorObject};
                        $scope.lookaheadSource.vendors.push($scope.query.vendorObject);
                    }
                    $scope.query.vendor = $scope.query.vendorObject.value;
                }
                if ($scope.query.productObject !== undefined) {
                    if (typeof($scope.query.productObject) === 'string' && $scope.query.productObject.length > 0) {
                        $scope.query.productObject = {type: 'previous search', value: $scope.query.productObject};
                        $scope.lookaheadSource.products.push($scope.query.productObject);
                    }
                    $scope.query.product = $scope.query.productObject.value;
                }
                $localStorage.lookaheadSource = $scope.lookaheadSource;
                commonService.search($scope.query)
                    .then(function (data) {
                        self.hasDoneASearch = true;

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

            $scope.browseAll = function () {
                $scope.clear();
                $scope.search();
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
                $scope.query = angular.copy(self.defaultQuery);
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
