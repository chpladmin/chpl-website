;(function () {
    'use strict';

    angular.module('app.search')
        .controller('SearchController', ['$scope', '$rootScope', '$log', '$location', '$localStorage', 'commonService', function ($scope, $rootScope, $log, $location, $localStorage, commonService) {
            var self = this;
            $scope.searchResults = [];
            $scope.displayedResults = [];
            $scope.lookaheadSource = [];
            $scope.filterGroup = {};
            self.hasDoneASearch = false;
            $scope.resultCount = 0;
            $scope.query = {simple: true,
                            orderBy: 'vendor',
                            sortDescending: false,
                            currentPage: 1,
                            resultsPerPage: 10};

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
                if ($localStorage.lookaheadSource && $localStorage.lookaheadSource.length > 0) {
                    $log.info('Restoring lookahead from localstorage');
                    $scope.lookaheadSource = $localStorage.lookaheadSource;
                } else {
                    commonService.getVendors()
                        .then(function (vendors) {
                            for (var i = 0; i < vendors.vendors.length; i++) {
                                $scope.lookaheadSource.push({type: 'vendor', value: vendors.vendors[i].name});
                            }
                            $localStorage.lookaheadSource = $scope.lookaheadSource;
                        });
                    commonService.getProducts()
                        .then(function (products) {
//                            $scope.lookaheadSource = $scope.lookaheadSource.concat(products);
//                            $localStorage.lookaheadSource = $scope.lookaheadSource;
                        });
                }
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
            $rootScope.certFilters = self.certFilters;

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

                if ($scope.query.simple) {
                    var query;
                    if ($scope.query.searchTerm !== undefined) {
                        if (typeof($scope.query.searchTerm) === 'object') {
                            query = $scope.query.searchTerm.value;
                        } else {
                            query = $scope.query.searchTerm;
                            $scope.query.searchTerm = {value: query};
                        }
                        if (query.length > 0)
                            query = encodeURIComponent(query);
                    } else {
                        query = "";
                    }

                    query = query + '&orderBy=' + $scope.query.orderBy;
                    query = query + '&sortDescending=' + $scope.query.sortDescending;

                    commonService.search(query,$scope.query.currentPage - 1,$scope.query.resultsPerPage)
                        .then(function (data) {
                            $localStorage.searchResults = data;
                            $scope.searchResults = data.results;
                            $scope.displayedResults = [].concat($scope.searchResults);
                            $scope.resultCount = data.recordCount;
                        }, function (error) {
                            $log.error(error);
                    });
                } else {

                    commonService.searchAdvanced($scope.query,$scope.query.currentPage - 1,$scope.query.resultsPerPage)
                        .then(function (data) {
                            $localStorage.searchResults = data;
                            $scope.searchResults = data.results;
                            $scope.displayedResults = [].concat($scope.searchResults);
                            $scope.resultCount = data.recordCount;
                        }, function (error) {
                            $log.error(error);
                        });
                }
                $localStorage.query = $scope.query;
            };
            $scope.search = self.search;

            $scope.doFilter = function () {
                self.search();/*
                var queryObj = {orderBy: $scope.orderBy};
                if ($scope.filterGroup.vendor !== undefined && $scope.filterGroup.vendor.length > 0) queryObj.vendor = $scope.filterGroup.vendor;
                if ($scope.filterGroup.product !== undefined && $scope.filterGroup.product.length > 0) queryObj.product = $scope.filterGroup.product;
                if ($scope.filterGroup.edition !== undefined && $scope.filterGroup.edition.length > 0) queryObj.certificationEdition = $scope.filterGroup.edition;
                if ($scope.filterGroup.classification !== undefined && $scope.filterGroup.classification.length > 0) queryObj.productClassification = $scope.filterGroup.classification;
                if ($scope.filterGroup.practiceType !== undefined && $scope.filterGroup.practiceType.length > 0) queryObj.practiceType = $scope.filterGroup.practiceType;
                if ($scope.filterGroup.certBody !== undefined && $scope.filterGroup.certBody.length > 0) queryObj.certificationBody = $scope.filterGroup.certBody;

                var certs = [];
                var cqms = [];
                for (var key in self.certFilters) {
                    if (key.indexOf('Clinical') !== 0) {
                        certs.push(self.certFilters[key]);
                    } else {
                        cqms.push(self.certFilters[key]);
                    }
                }
                if (certs.length > 0) queryObj.certificationCriteria = certs;
                if (cqms.length > 0) queryObj.cqms = cqms;

                $scope.currentPage = 1;
                commonService.searchAdvanced(queryObj,$scope.currentPage - 1,$scope.resultsPerPage)
                    .then(function (data) {
                        $localStorage.searchResults = data;
                        $scope.searchResults = data.results;
                        $scope.displayedResults = [].concat($scope.searchResults);
                        $scope.resultCount = data.recordCount;
                    }, function (error) {
                        $log.error(error);
                    });*/
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
                $scope.searchResults = [];
                $scope.displayedResults = [];
                $scope.resultCount = 0;
                self.compareIds = Object.create(null);
                self.hasDoneASearch = false;
                $scope.query = {simple: true,
                                orderBy: 'vendor',
                                sortDescending: false,
                                currentPage: 1,
                                resultsPerPage: 10};
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
                self.search();
            };
        }]);
})();
