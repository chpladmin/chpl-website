angular.module('chpl.components')
    .directive("aiSearch", ['stConfig', '$timeout','$parse', function (stConfig, $timeout, $parse) {
        /* Like st-search, but relies on the value of ng-model to trigger changes.
        * Usage:
        * <input type="text" placeholder="Search..." ng-model="myCtrl.searchParams.search" mh-search="search" />
        */
        return {
            require: ['^stTable', 'ngModel'],
            link: function(scope, element, attr, ctrls) {
                var tableCtrl = ctrls[0],
                    modelCtrl = ctrls[1];
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
