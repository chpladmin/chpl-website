;(function () {
    'use strict';

    angular.module('app.admin')
        .directive('aiAcbManagement', ['authService', function (authService) {
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
                    scope.isChplAdmin = authService.isChplAdmin();
                    scope.isAcbAdmin = authService.isAcbAdmin();
                }
            };
        }]);
})();
