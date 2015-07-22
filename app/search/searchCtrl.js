;(function () {
    'use strict';

    angular.module('app.search')
        .controller('SearchController', ['$scope', '$log', '$location', '$localStorage', 'commonService', function ($scope, $log, $location, $localStorage, commonService) {
            var self = this;
            $scope.searchResults = [];
            $scope.displayedResults = [];
            $scope.lookaheadSource = [];
            $scope.isSimpleSearch = true;
            if ($localStorage.searchResults) {
                $scope.searchResults = $localStorage.searchResults;
                $scope.displayedResults = [].concat($scope.searchResults);
            }

            self.setupLookahead = function () {
                if ($localStorage.lookaheadResults && $localStorage.lookaheadResults.length > 0) {
                    $log.info('Restoring lookahead from localstorage');
                    $scope.lookaheadResults = $localStorage.lookaheadResults;
                } else {
                    commonService.getVendors()
                        .then(function (vendors) {
                            $scope.lookaheadSource = $scope.lookaheadSource.concat(vendors);
                            $localStorage.lookaheadSource = $scope.lookaheadSource;
                        });
                    commonService.getProducts()
                        .then(function (products) {
                            $scope.lookaheadSource = $scope.lookaheadSource.concat(products);
                            $localStorage.lookaheadSource = $scope.lookaheadSource;
                        });
                }
            };
            self.setupLookahead();

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

            self.compareIds = Object.create(null);

            self.getCompareIds = function() {
                return self.compareIds;
            };

            self.toggleCompareId = function(anId) {
                if (anId in self.compareIds) {
                    delete self.compareIds[anId];
                } else {
                    self.compareIds[anId] = true;
                }
            };
            $scope.toggleCompareId = self.toggleCompareId;

            self.search = function () {
                var query;
                if ($scope.isSimpleSearch) {
                    if (typeof $scope.searchTerm === 'object') {
                        query = $scope.searchTerm.value;
                    } else {
                        query = $scope.searchTerm;
                    }
                } else {
                    query = 'vendor=' + $scope.vendorTerm +
                        '&product=' + $scope.productTerm +
                        '&version=' + $scope.versionTerm +
                        '&cert=' + $scope.certTerm +
                        '&cqm=' + $scope.cqmTerm +
                        '&edition=' + $scope.editionTerm +
                        '&classification=' + $scope.classificationTerm +
                        '&practice=' + $scope.practiceTerm;
                }

                $log.info('Searching for: ' + query);
                commonService.search(query)
                    .then(function (data) {
                        //$localStorage.searchResults = data;
                        $scope.searchResults = data;
                        $scope.displayedResults = [].concat($scope.searchResults);
                    }, function (error) {
                        $log.error(error);
                    });
            };
            $scope.search = self.search;

            $scope.hasResults = function () {
                return $scope.searchResults.length > 0;
            };

            $scope.sorts = {
                certs: function (value) {
                    return value.numCQMs + value.numCerts;
                }
            };

            $scope.clear = function () {
                delete $localStorage.searchResults;
                $scope.searchResults = [];
                $scope.displayedResults = [];
                $scope.searchTerm = null;
                $scope.vendorTerm = null;
                $scope.productTerm = null;
                $scope.versionTerm = null;
                $scope.certTerm = null;
                $scope.cqmTerm = null;
                $scope.editionTerm = null;
                $scope.classificationTerm = null;
                $scope.practiceTerm = null;
                self.compareIds = Object.create(null);
            };

            $scope.compare = function () {
                var comparePath = '/compare/';
                for (var property in self.compareIds) {
                    comparePath += property + "&";
                }
                comparePath = comparePath.substring(0, comparePath.length - 1);
                if (comparePath != '/compare') {
                    $location.path(comparePath);
                }
            };
        }]);
})();
