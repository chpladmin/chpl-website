(function () {
    'use strict';
    angular.module('chpl')
        .directive('stManage', manage);

    /** @ngInject */
    function manage ($localStorage, $log) {
        return {
            require: '^stTable',
            scope: {
                storageKey: '@'
            },
            link: function (scope, element, attr, ctrl) {
                var nameSpace = scope.storageKey;

                //save the table state every time it changes
                scope.$watch(function () {
                    return ctrl.tableState();
                }, function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        $log.debug('persisiting', newValue, oldValue);
                        $localStorage[nameSpace] = angular.toJson(newValue);
                        $localStorage.searchTimestamp = Math.floor((new Date()).getTime() / 1000 / 60);
                    }
                }, true);

                //fetch the table state when the directive is loaded
                if ($localStorage[nameSpace]) {
                    var savedState = angular.fromJson($localStorage[nameSpace]);
                    var tableState = ctrl.tableState();
                    $log.debug('loading', tableState, savedState);
                    angular.extend(tableState, savedState);
                    ctrl.pipe();
                }
            }
        };
    }
})();
