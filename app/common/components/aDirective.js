;(function () {
    'use strict';

    angular.module('app.common')
        .controller('AController', ['$scope', '$log', function ($scope, $log) {
            var vm = this;

            ////////////////////////////////////////////////////////////////////

        }]);

    angular.module('app.common')
        .directive('aiA', [function () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'common/components/a.html',
                bindToController: {
                    href: '@',
                    text: '@'
                },
                scope: {},
                controllerAs: 'vm',
                controller: 'AController'
            };
        }]);
})();
