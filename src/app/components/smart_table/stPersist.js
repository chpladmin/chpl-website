(function () {
    'use strict';
    angular.module('chpl')
        .directive('stPersist', persist);

    /** @ngInject */
    function persist ($localStorage) {
        return {
            require: '^stTable',
            link: function (scope, element, attr, ctrl) {
                var nameSpace = attr.stPersist;

                //save the table state every time it changes
                scope.$watch(function () {
                    return ctrl.tableState();
                }, function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        console.log('persisiting', newValue);
                        $localStorage[nameSpace] = angular.toJson(newValue);
                        $localStorage.searchTimestamp = Math.floor((new Date()).getTime() / 1000 / 60);
                    }
                }, true);

                //fetch the table state when the directive is loaded
                if ($localStorage[nameSpace]) {
                    var savedState = angular.fromJson($localStorage[nameSpace]);
                    var tableState = ctrl.tableState();
                    console.log('loading', tableState);
                    angular.extend(tableState, savedState);
                    ctrl.pipe();
                }
            }
        };
    }
})();
