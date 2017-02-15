(function () {
    'use strict';
    angular.module('chpl')
        .directive('stManage', manage);

    /** @ngInclude */
    function manage ($localStorage) {
        return {
            require: '^stTable',
            scope: {
                registerSearch: '&',
                registerRestoreComponents: '&',
                nameSpace: '@'
            },
            link: function (scope, element, attr, ctrl) {
                //save the table state every time it changes
/*                scope.$watch(function () {
                    return ctrl.tableState();
                }, function (newValue, oldValue) {
                    if (newValue.sort !== oldValue.sort ||
                        newValue.pagination !== newValue.pagination) {
                        $localStorage[scope.nameSpace] = angular.toJson(newValue);
                        $localStorage.searchTimestamp = Math.floor((new Date()).getTime() / 1000 / 60);
                    }
                }, true);

                var restore = scope.registerRestoreComponents({
                    restore: function (state) {
                        var tableState = ctrl.tableState();
                        tableState.sort = state.sort;
                        tableState.pagination = state.pagination;
                        ctrl.pipe();
                    }
                });
                scope.$on('$destroy', restore);
                */
                var search = scope.registerSearch({
                    search: function () {
                        ctrl.search();
                    }
                });
                scope.$on('$destroy', search);
            }
        }
    }
})();
