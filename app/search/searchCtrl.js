;(function () {
    'use strict';

    angular.module('app.search')
        .controller('SearchController', ['$scope', '$log', 'searchService', function ($scope, $log, searchService) {
            var self = this;
            $scope.searchResults = [];
            $scope.displayedResults = [];

            self.search = function () {
                $scope.searchResults = searchService.search();
                $scope.displayedResults = [].concat(self.searchResults);
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
