;(function () {
    'use strict';

    angular.module('app.search')
        .controller('SearchController', ['$scope', '$log', '$filter', 'commonService', function ($scope, $log, $filter, commonService) {
            var self = this;
            $scope.searchResults = [];
            $scope.displayedResults = [];

            self.search = function (query) {
                $log.info('Searching for: ' + query);
                commonService.search(query)
                    .then(function (data) {
                        $scope.searchResults = data;
                        $scope.displayedResults = [].concat($scope.searchResults);
                    }, function (error) {
                        $log.error(error);
                    });
            };
            $scope.search = self.search;

            self.hasResults = function () {
                return $scope.searchResults.length > 0;
            };
            $scope.hasResults = self.hasResults;

            $scope.sorts = {
                certs: function (value) {
                    return value.numCQMs + value.numCerts;
                }
            };

            self.clear = function () {
                $scope.searchResults = [];
                $scope.displayedResults = [];
                $scope.searchTerm = '';
            };
            $scope.clear = self.clear;
        }]);
})();
