;(function () {
    'use strict';

    angular.module('app.api')
        .controller('ApiController', ['$scope', '$log', '$routeParams', 'apiService', function($scope, $log, $routeParams, apiService) {
            var self = this;

            self.apiCalls = [];
            self.apiEntities = [];

            apiService.getApiCalls()
                .then(function (result) {
                    self.apiCalls = result;
                }, function (error) {
                    $log.debug(error);
                });

            apiService.getApiEntities()
                .then(function (result) {
                    self.apiEntities = result;
                }, function (error) {
                    $log.debug(error);
                });
        }]);
})();
