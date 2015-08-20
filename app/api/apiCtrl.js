;(function () {
    'use strict';

    angular.module('app.api')
        .controller('ApiController', ['$scope', '$log', 'apiService', function($scope, $log, apiService) {
            var self = this;

            self.apiCalls = [];
            self.apiEntities = [];

            apiService.getApiCalls()
                .then(function (result) {
                    self.apiCalls = result;
                }, function (error) {
                    $log.debug(error);
                });
        }]);
})();
