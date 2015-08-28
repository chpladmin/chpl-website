;(function () {
    'use strict';

    angular.module('app.search')
        .controller('SearchController', ['$scope', '$rootScope', '$log', '$location', '$localStorage', 'commonService', function ($scope, $rootScope, $log, $location, $localStorage, commonService) {
            var self = this;
            $scope.searchResults = [];
            $scope.displayedResults = [];
            $scope.lookaheadSource = [];
            $scope.isSimpleSearch = true;
            $scope.filterGroup = {};
            self.hasDoneASearch = false;
            $scope.resultCount = 0;
            $scope.currentPage = 1;
            $scope.resultsPerPage = 10;
            $scope.orderBy = 'vendor';

            if ($localStorage.searchResults) {
                $scope.searchResults = $localStorage.searchResults;
                $scope.displayedResults = [].concat($scope.searchResults);
                self.hasDoneASearch = true;
            }

            self.setupLookahead = function () {
                if ($localStorage.lookaheadResults && $localStorage.lookaheadResults.length > 0) {
                    $log.info('Restoring lookahead from localstorage');
                    $scope.lookaheadResults = $localStorage.lookaheadResults;
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
                $scope.clearFilter();
                if ($scope.isSimpleSearch) {
                    var query;
                    if ($scope.searchTerm !== undefined) {
                        if (typeof $scope.searchTerm === 'object') {
                            query = $scope.searchTerm.value;
                        } else {
                            query = $scope.searchTerm;
                        }
                        if (query.length > 0)
                            query = encodeURIComponent(query);
                    } else {
                        query = "";
                    }
                    query = query + '&orderBy=' + $scope.orderBy;

                    commonService.search(query,$scope.currentPage - 1,$scope.resultsPerPage)
                        .then(function (data) {
                            //$localStorage.searchResults = data;
                            $scope.searchResults = data.results;
                            $scope.displayedResults = [].concat($scope.searchResults);
                            $scope.resultCount = data.recordCount;
                        }, function (error) {
                            $log.error(error);
                    });
                } else {
                    var queryObj = {orderBy: $scope.orderBy};
                    if ($scope.vendorTerm !== undefined && $scope.vendorTerm.length > 0) queryObj.vendor = $scope.vendorTerm;
                    if ($scope.productTerm !== undefined && $scope.productTerm.length > 0) queryObj.product = $scope.productTerm;
                    if ($scope.versionTerm !== undefined && $scope.versionTerm.length > 0) queryObj.version = $scope.versionTerm;
                    if ($scope.editionTerm !== undefined && $scope.editionTerm.length > 0) queryObj.certificationEdition = $scope.editionTerm;
                    if ($scope.classificationTerm !== undefined && $scope.classificationTerm.length > 0) queryObj.productClassification = $scope.classificationTerm;
                    if ($scope.practiceTerm !== undefined && $scope.practiceTerm.length > 0) queryObj.practiceType = $scope.practiceTerm;
                    if ($scope.certTerm !== undefined && $scope.certTerm.length > 0) queryObj.certificationCriteria = $scope.certTerm;
                    if ($scope.cqmTerm !== undefined && $scope.cqmTerm.length > 0) queryObj.cqms = $scope.cqmTerm;

                    commonService.searchAdvanced(queryObj,$scope.currentPage - 1,$scope.resultsPerPage)
                        .then(function (data) {
                            //$localStorage.searchResults = data;
                            $scope.searchResults = data.results;
                            $scope.displayedResults = [].concat($scope.searchResults);
                            $scope.resultCount = data.recordCount;
                        }, function (error) {
                            $log.error(error);
                        });
                }
            };
            $scope.search = self.search;

            $scope.doFilter = function () {
                var queryObj = {orderBy: $scope.orderBy};
                if ($scope.filterGroup.vendor !== undefined && $scope.filterGroup.vendor.length > 0) queryObj.vendor = $scope.filterGroup.vendor;
                if ($scope.filterGroup.product !== undefined && $scope.filterGroup.product.length > 0) queryObj.product = $scope.filterGroup.product;
                if ($scope.filterGroup.edition !== undefined && $scope.filterGroup.edition.length > 0) queryObj.certificationEdition = $scope.filterGroup.edition;
                if ($scope.filterGroup.classification !== undefined && $scope.filterGroup.classification.length > 0) queryObj.productClassification = $scope.filterGroup.classification;
                if ($scope.filterGroup.practiceType !== undefined && $scope.filterGroup.practiceType.length > 0) queryObj.practiceType = $scope.filterGroup.practiceType;
                if ($scope.filterGroup.certBody !== undefined && $scope.filterGroup.certBody.length > 0) queryObj.practiceType = $scope.filterGroup.certBody;

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
                        //$localStorage.searchResults = data;
                        $scope.searchResults = data.results;
                        $scope.displayedResults = [].concat($scope.searchResults);
                        $scope.resultCount = data.recordCount;
                    }, function (error) {
                        $log.error(error);
                    });
            };

            $scope.hasResults = function () {
                return $scope.searchResults !== undefined && $scope.searchResults.length > 0;
            };

            $scope.hasSearched = function () {
                return self.hasDoneASearch;
            };

            $scope.clear = function () {
                delete $localStorage.searchResults;
                $scope.searchResults = [];
                $scope.displayedResults = [];
                $scope.searchTerm = '';
                $scope.vendorTerm = '';
                $scope.productTerm = '';
                $scope.versionTerm = '';
                $scope.certTerm = '';
                $scope.cqmTerm = '';
                $scope.editionTerm = '';
                $scope.classificationTerm = '';
                $scope.practiceTerm = '';
                $scope.resultCount = 0;
                $scope.orderBy = 'vendor';
                self.compareIds = Object.create(null);
                self.hasDoneASearch = false;

//                angular.element.find('#resetLink').click();
            };

            $scope.clearFilter = function () {
                $scope.filterGroup.vendor = '';
                $scope.filterGroup.product = '';
                $scope.filterGroup.edition = '';
                $scope.filterGroup.classification = '';
                $scope.filterGroup.practiceType = '';
                $scope.filterGroup.certBody = '';

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

            $scope.pageChanged = function () {
                self.search();
            };
        }]);
})();
