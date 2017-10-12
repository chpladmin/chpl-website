(function () {
    'use strict';
    angular.module('chpl')
        .directive('stManage', manage);

    /** @ngInclude */
    function manage () {
        return {
            require: '^stTable',
            scope: {
                registerSearch: '&',
                registerRestoreComponents: '&',
                nameSpace: '@?',
            },
            link: function (scope, element, attr, ctrl) {
                var search = scope.registerSearch({
                    search: function () {
                        ctrl.search();
                    },
                });
                scope.$on('$destroy', search);
            },
        }
    }
})();
