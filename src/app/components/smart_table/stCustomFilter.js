(function () {
    'use strict';
    angular.module('chpl.common')
        .filter('customFilter', CustomFilter);

    /** @ngInject */
    function CustomFilter ($filter) {
        var filterFilter = $filter('filter');
        var standardComparator = function standardComparator(obj, text) {
            text = ('' + text).toLowerCase();
            return ('' + obj).toLowerCase().indexOf(text) > -1;
        };

        return function customFilter(array, expression) {

            function customComparator(actual, expected) {
                var isBeforeActivated = expected.before;
                var isAfterActivated = expected.after;
                var isLower = expected.lower;
                var isHigher = expected.higher;
                var higherLimit;
                var lowerLimit;
                var itemDate;
                var queryDate;
                var i,ret;

                if (angular.isObject(expected)) {
                    //exact match
                    if (expected.distinct) {
                        if (!actual || actual.toLowerCase() !== expected.distinct.toLowerCase()) {
                            return false;
                        }

                        return true;
                    }

                    if (!expected.matchAny) {
//                        $log.debug(expected);
                    }
                    //surveillance match
                    if (expected.anySurveillance) {
                        if (expected.anySurveillance.all) {
                            return true;
                        }

                        if (!actual) {
                            return false;
                        }
                        var surveillance = angular.fromJson(actual);
                          if (expected.anySurveillance.matchAll) {
                            ret = (expected.anySurveillance.hasOpenSurveillance === surveillance.hasOpenSurveillance) &&
                                (expected.anySurveillance.hasClosedSurveillance === surveillance.hasClosedSurveillance) &&
                                (expected.anySurveillance.hasOpenNonconformities === surveillance.hasOpenNonconformities) &&
                                (expected.anySurveillance.hasClosedNonconformities === surveillance.hasClosedNonconformities);
                        } else {
                            ret = (expected.anySurveillance.hasOpenSurveillance && surveillance.hasOpenSurveillance) ||
                                (expected.anySurveillance.hasClosedSurveillance && surveillance.hasClosedSurveillance) ||
                                (expected.anySurveillance.hasOpenNonconformities && surveillance.hasOpenNonconformities) ||
                                (expected.anySurveillance.hasClosedNonconformities && surveillance.hasClosedNonconformities);
                        }
//                        $log.debug(expected.anySurveillance, surveillance, ret);
                        return ret;
                    }

                    //matchAny
                    if (expected.matchAny) {
                        if (expected.matchAny.all) {
                            return true;
                        }

                        if (!actual) {
                            return false;
                        }

                        for (i = 0; i < expected.matchAny.items.length; i++) {
                            if (actual.toLowerCase() === expected.matchAny.items[i].toLowerCase()
                                || actual.toLowerCase().indexOf(expected.matchAny.items[i].toLowerCase()) > -1) {
                                return true;
                            }
                        }

                        return false;
                    }

                    //matchAll
                    if (expected.matchAll) {
                        if (expected.matchAll.all) {
                            return true;
                        }

                        if (!actual) {
                            return false;
                        }

                        ret = true;
                        for (i = 0; i < expected.matchAll.items.length; i++) {
                            ret = ret && (actual.toLowerCase() === expected.matchAll.items[i].toLowerCase()
                                          || actual.toLowerCase().indexOf(expected.matchAll.items[i].toLowerCase()) > -1);
                        }

                        return ret;
                    }

                    //date range
                    if (expected.before || expected.after) {
                        try {
                            if (isBeforeActivated) {
                                higherLimit = expected.before;

                                itemDate = new Date(actual);
                                queryDate = new Date(higherLimit);
                                if (itemDate > queryDate) {
                                    return false;
                                }
                            }

                            if (isAfterActivated) {
                                lowerLimit = expected.after;

                                itemDate = new Date(actual);
                                queryDate = new Date(lowerLimit);
                                if (itemDate < queryDate) {
                                    return false;
                                }
                            }

                            return true;
                        } catch (e) {
                            return false;
                        }

                    } else if (isLower || isHigher) {
                        //number range
                        if (isLower) {
                            higherLimit = expected.lower;

                            if (actual > higherLimit) {
                                return false;
                            }
                        }

                        if (isHigher) {
                            lowerLimit = expected.higher;
                            if (actual < lowerLimit) {
                                return false;
                            }
                        }

                        return true;
                    }
                    //etc

                    return true;

                }
                return standardComparator(actual, expected);
            }

            var output;
            output = filterFilter(array, expression, customComparator);
            return output;
        };
    }
})();
