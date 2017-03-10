(function () {
    'use strict';
    angular.module('chpl.common')
        .filter('customFilter', CustomFilter);

    /** @ngInject */
    function CustomFilter ($filter, cfpLoadingBar) {
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

                    //surveillance match
                    if (expected.surveillance) {
                        if (!actual) {
                            return false;
                        }
                        var surv = angular.fromJson(actual);
                        if (expected.surveillance === 'never') {
                            ret = !surv.hasOpenSurveillance && !surv.hasClosedSurveillance;
                        } else {
                            ret = surv.hasOpenSurveillance || surv.hasClosedSurveillance;
                            if (expected.NC) {
                                var never = expected.NC.never;
                                var open = expected.NC.open;
                                var closed = expected.NC.closed;
                                var openNC = surv.hasOpenNonconformities;
                                var closedNC = surv.hasClosedNonconformities;
                                /*
                                 * matching one of the posibles
                                 */
                                if (never && !open && !closed) {
                                    ret = ret && !openNC && !closedNC;
                                } else if (!never && open && !closed) {
                                    ret = ret && openNC
                                } else if (!never && !open && closed) {
                                    ret = ret && closedNC
                                    /*
                                     * if matching more than one, need to know if matchAll is true or not
                                     * if true, only valid "multiple" is !never && open && closed
                                     */
                                } else if (expected.matchAll && !never && open && closed) {
                                    ret = ret && openNC && closedNC;
                                } else if (expected.matchAll) {
                                    ret = false;
                                    /*
                                     * now matching "matchAny" with multiples
                                     */
                                } else if (never && open && !closed) {
                                    ret = ret && openNC && !closedNC;
                                } else if (never && !open && closed) {
                                    ret = ret && !openNC && closedNC;
                                } else if (!never && open && closed) {
                                    ret = ret && (openNC || closedNC);
                                }
                                /*
                                 * triple multiples on matchAny
                                 * never && open && closed
                                 * !never && !open && !closed
                                 * fall back to "all", and the original return value
                                 */
                            }
                        }
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
            cfpLoadingBar.start();
            output = filterFilter(array, expression, customComparator);
            cfpLoadingBar.complete()
            return output;
        };
    }
})();
