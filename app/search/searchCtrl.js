;(function () {
    'use strict';

    angular.module('app.search')
        .controller('SearchController', ['$scope', '$log', '$filter', 'searchService', function ($scope, $log, $filter, searchService) {
            var self = this;
            $scope.searchResults = [];
            $scope.displayedResults = [];
            this.filteredResults = [];

            self.search = function () {
                $scope.searchResults = searchService.search();
                this.filteredResults = $filter('filter')($scope.searchResults, $scope.searchTerm);
                $scope.displayedResults = [].concat(this.filteredResults);
                $log.info($scope.searchResults.length);
                $log.info(this.filteredResults.length);
                $log.info($scope.displayedResults.length);
            };
            $scope.search = self.search;

            self.hasResults = function () {
                return $scope.searchResults.length != 0;
            };
            $scope.hasResults = self.hasResults;

            $scope.sorts = {
                certs: function (value) {
                    var counts = value.certs.split(' ');
                    return (parseInt(counts[0]) + parseInt(counts[3]));
                }
            };
        }]);
})();
