;(function () {
    'use strict';

    angular.module('app.admin')
        .directive('aiAcbManagement', function () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'admin/components/acbManagement.html',
                scope: {
                    acbs: '=acbs',
                    createACB: '&createAcb'
                },
                link: function (scope, element, attrs) {
                    scope.newACB = {};
                    scope.createACB = scope.createACB(scope.newACB);
                }
            };
        });
})();
