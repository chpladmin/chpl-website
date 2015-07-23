;(function () {
    'use strict';

    angular.module('app.search')
        .directive('aiCertFilter', function () {
            return {
                restrict: 'AE',
                replace: false,
                require: '^stTable',
                transclude: true,
                template: '<div><h3>Filter on Certifications and CQMs</h3><div ng-transclude></div></div>',
                link: function (scope, element, attr, ctrl) {
                    scope.certsChanged = function () {
                        ctrl.search();
                    }
                }
            };
        });
})();
