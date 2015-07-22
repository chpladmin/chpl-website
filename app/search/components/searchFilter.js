;(function () {
    'use strict';
    angular.module('app.search')
        .filter('tableFilter', ['$filter', function ($filter) {
            var filterFilter = $filter('filter');

            var filterOutSpecialCases = function (expression) {
                var ret = [];
                for (var key in expression) {
                    if (expression.hasOwnProperty(key) &&
                        key !== 'certs') {
                        ret.push(key);
                    }
                }

                return ret;
            };

            var textCompare = function (obj, text) {
                text = ('' + text).toLowerCase();
                return ('' + obj).toLowerCase().indexOf(text) > -1;
            };

            return function (array, expression) {
                var output = [];
                var textFields = filterOutSpecialCases(expression);

                array.forEach(function (element, index) {
                    var include = true;

                    textFields.forEach(function (field, index) {
                        if (!textCompare(element[field], expression[field])) {
                            include = false;
                        }
                    });

                    if (include) {
                        output.push(element);
                    }
                });

                return output;
            };
        }]);
})();
