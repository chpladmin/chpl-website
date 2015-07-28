;(function () {
    'use strict';
    angular.module('app.search')
        .filter('tableFilter', ['$filter', '$rootScope', function ($filter, $rootScope) {
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

                    var foundCert;
                    for (var key in $rootScope.certFilters) {
                        foundCert = false;
                        for (var j = 0; j < element.certs.length; j++) {
                            for (var k = 0; k < element.certs[j].certs.length; k++) {
                                if (element.certs[j].title + ':' + element.certs[j].certs[k].title === key) {
                                    if (!element.certs[j].certs[k].isActive) {
                                        include = false;
                                    } else {
                                        foundCert = true;
                                    }
                                    break;
                                }
                            }
                        }
                        if (!foundCert) {
                            include = false;
                        }
                    }

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
