;(function () {
    'use strict';

    angular.module('app.compare')
        .controller('CompareController', ['$scope', '$log', '$routeParams', 'commonService', function($scope, $log, $routeParams, commonService) {
            var self = this;
            var compareString = $routeParams.compareIds;
            self.products = [];
            if (compareString && compareString.length > 0) {
                self.compareIds = compareString.split('&');

                var errFun = function (error) { $log.error(error); };
                for (var i = 0; i < self.compareIds.length; i++) {
                    commonService.getProduct(self.compareIds[i])
                        .then(function (data) {
                            self.products.push(data);
                        }, errFun (error));
                }
            };

            self.toggle = function (elem) {
                if (self.openCert === elem) {
                    self.openCert = '';
                } else {
                    self.openCert = elem;
                }
            };

            self.isShowing = function (elem) {
                return self.openCert === elem;
            };
        }]);
})();
