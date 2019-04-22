angular.module('chpl.components')
    .directive('chplSearch', ['$timeout', 'stConfig', function ($timeout, stConfig) {
        /* Like st-search, but relies on the value of ng-model to trigger changes.
        * Usage:
        * <input type="text" placeholder="Search..." ng-model="myCtrl.searchParams.search" chpl-search="search" />
        */
        return {
            require: ['^stTable', 'ngModel'],
            link: function (scope, element, attr, ctrls) {
                var modelCtrl = ctrls[1],
                    tableCtrl = ctrls[0];
                var promise = null;
                var throttle = attr.stDelay || stConfig.search.delay;

                function triggerSearch () {
                    var value = modelCtrl.$modelValue;

                    if (promise !== null) {
                        $timeout.cancel(promise);
                    }

                    promise = $timeout(function () {
                        tableCtrl.search(value, attr.mhSearch || '');
                        promise = null;
                    }, throttle);
                }

                scope.$watch(function () { return modelCtrl.$modelValue; }, triggerSearch);
            },
        };
    }])
