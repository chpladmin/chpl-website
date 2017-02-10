(function () {
    'use strict';
    angular.module('chpl')
        .directive('stManage', manage);

    function manage () {
        return {
            link: stManageLink,
            require: '^stTable',
            scope: {
                registerSearch: '&'
            }
        }
    }

    function stManageLink (scope, element, attr, ctrl) {
        var search = scope.registerSearch({
            search: function () {
                ctrl.search();
            }
        });
        scope.$on('$destroy', search);
    }
})();
