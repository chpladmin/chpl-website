;(function () {
    'use strict';

    angular.module('app.search')
        .controller('SearchController', ['$scope', '$log', '$filter', 'searchService', function ($scope, $log, $filter, searchService) {
            var self = this;
            $scope.searchResults = [];
            $scope.displayedResults = [];
            $scope.filteredResults = [];

            self.search = function (query) {
                $log.info('Searching for: ' + query);
                searchService.search(query)
                    .then(function (data) {
                        $scope.searchResults = data;
                        $scope.filteredResults = $filter('filter')($scope.searchResults, $scope.searchTerm);
                        $scope.displayedResults = [].concat($scope.filteredResults);
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
                    var counts = value.certs.split(' ');
                    return (parseInt(counts[0]) + parseInt(counts[3]));
                }
            };

            self.clear = function () {
                $scope.searchResults = [];
                $scope.displayedResults = [];
            };
            $scope.clear = self.clear;

            self.details = function(id) {
                $log.info('Getting details for ID: ' + id);
            };
            $scope.details = self.details;
        }]);
})();
