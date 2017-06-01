(function () {
    'use strict';
    angular.module('chpl.collections')
        .filter('apiCriteriaFilter', ApiCriteriaFilter);

    /** @ngInject */
    function ApiCriteriaFilter ($filter, $log) {
        var filterFilter = $filter('filter');
        var standardComparator = function standardComparator (obj, text) {
            text = ('' + text).toLowerCase();
            return ('' + obj).toLowerCase().indexOf(text) > -1;
        };

        return function customFilter (array, expression) {

            $log.debug(array, expression);
            function customComparator (actual, expected) {

                $log.debug(actual, expected);
                if (angular.isObject(expected)) {

                    if (actual.edition === '2015') {
                        return true;
                    } else {
                        return false;
                    }
                }
                return standardComparator(actual, expected);
            }

            var output;
            output = filterFilter(array, expression, customComparator);
            return output;
        };
    }
})();
