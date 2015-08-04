;(function () {
    'use strict';

    angular.module('app.admin')
        .directive('aiUserManagement', function () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'admin/components/userManagement.html',
                scope: {
                    users: '=users',
                    createUser: '&createUser',
                    modifyUser: '&modifyUser',
                    deleteUser: '&deleteUser',
                    cancelUser: '&cancelUser'
                },
                link: function (scope, element, attrs) {
                    scope.newUser = {};
                    scope.createUser = scope.createUser(scope.newUser);
                    scope.modifyUser = scope.modifyUser();
                    scope.deleteUser = scope.deleteUser();
                    scope.cancelUser = scope.cancelUser();
                }
            };
        });
})();
