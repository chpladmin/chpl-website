;(function () {
    'use strict';

    angular.module('app.search')
        .controller('SearchController', ['$scope', '$log', '$filter', 'searchService', function ($scope, $log, $filter, searchService) {
            var self = this;
            $scope.searchResults = [];
            $scope.displayedResults = [];

            self.search = function (query) {
                $log.info('Searching for: ' + query);
                searchService.search(query)
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
                    var counts = value.certs.split(' ');
                    return (parseInt(counts[0]) + parseInt(counts[3]));
                }
            };

            self.clear = function () {
                $scope.searchResults = [];
                $scope.displayedResults = [];
            };
            $scope.clear = self.clear;
        }]);
})();
