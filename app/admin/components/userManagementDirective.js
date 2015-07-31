;(function () {
    'use strict';

    angular.module('app.admin')
        .directive('aiUserManagement', function () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'admin/components/userManagment.html',
                link: function (scope, element, attr, ctrl) {
                }
            };
        });
})();
