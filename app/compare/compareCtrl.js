;(function () {
    'use strict';

    angular.module('app.compare')
        .controller('CompareController', ['$scope', '$log', '$routeParams', 'commonService', function($scope, $log, $routeParams, commonService) {
            var self = this;
            var compareString = $routeParams.compareIds;
            self.products = [];
            if (compareString && compareString.length > 0) {
                self.compareIds = compareString.split('&');

                var successResult = function (data) { self.products.push(data); };
                var failResult = function (error) { $log.error(error); };

                for (var i = 0; i < self.compareIds.length; i++) {
                    commonService.getProduct(self.compareIds[i])
                        .then(successResult, failResult);
                }
            };

            self.toggle = function (elem) {
                self.openCert = self.openCert === elem ? '' : elem;
            };

            self.isShowing = function (elem) {
                return self.openCert === elem;
            };
        }]);
})();
