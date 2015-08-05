;(function () {
    'use strict';

    angular.module('app.common')
        .directive('aiCerts', ['commonService', '$log', function (commonService, $log) {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'common/components/certs.html',
                scope: { certs: '=certs' },
                controllerAs: 'vm',
                controller: function ($scope) {
                    var self = this;
                    self.certs = $scope.certs;
                }
            };
        }]);
})();
