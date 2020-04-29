(function () {
    'use strict';
    angular.module('chpl.components')
        .filter('customFilter', CustomFilter);

    /** @ngInject */
    function CustomFilter ($filter) { // will need cfpLoadingBar back if we want the "spinny circle" on smart-table filtering
        let filterFilter = $filter('filter');

        let dateRangeComparator = (actual, expected) => {
            let higherLimit, itemDate, lowerLimit, queryDate;

            try {
                if (expected.before) {
                    higherLimit = expected.before;

                    itemDate = new Date(actual);
                    queryDate = new Date(higherLimit);
                    if (itemDate > queryDate) {
                        return false;
                    }
                }

                if (expected.after) {
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
        };

        let distinctComparator = (actual, expected) => {
            if (!actual || actual.toLowerCase() !== expected.distinct.toLowerCase()) {
                return false;
            }

            return true;
        };

        let matchAnyComparator = (actual, expected) => {
            let separator = expected.separator ? expected.separator : '';

            if (expected.matchAny.items.length === 0) {
                return true;
            }

            if (!actual) {
                return false;
            }

            for (let i = 0; i < expected.matchAny.items.length; i++) {
                if (
                    (separator + actual + separator).toLowerCase() === (separator + expected.matchAny.items[i] + separator).toLowerCase()
                        ||
                        (
                            !expected.matchAny.matchFull
                                &&
                                (separator + actual + separator).toLowerCase().indexOf((separator + expected.matchAny.items[i] + separator).toLowerCase()) > -1
                        )
                ) {
                    return true;
                }
            }

            return false;
        };

        let matchAllComparator = (actual, expected) => {
            let ret;
            let separator = expected.separator ? expected.separator : '';

            if (expected.matchAll.items.length === 0) {
                return true;
            }

            if (!actual) {
                return false;
            }

            ret = true;
            for (let i = 0; i < expected.matchAll.items.length; i++) {
                ret = ret && ((separator + actual + separator).toLowerCase() === (separator + expected.matchAll.items[i] + separator).toLowerCase()
                              || (separator + actual + separator).toLowerCase().indexOf((separator + expected.matchAll.items[i] + separator).toLowerCase()) > -1);
            }

            return ret;
        };

        let nonconformityComparator = (actual, expected) => {
            let closed, closedNC, open, openNC, ret;
            if (!actual) {
                return false;
            }
            var nc = angular.fromJson(actual);
            open = expected.nonconformities.open;
            closed = expected.nonconformities.closed;
            openNC = nc.openNonconformityCount > 0;
            closedNC = nc.closedNonconformityCount > 0;
            if (expected.nonconformities.matchAll) {
                ret = (open === openNC) && (closed === closedNC);
            } else {
                if (!open && !closed) {
                    ret = true;
                } else {
                    ret = (open && openNC) || (closed && closedNC)
                }
            }
            return ret;
        };

        let rangeComparator = (actual, expected) => {
            if (expected.lower) {
                if (actual > expected.lower) {
                    return false;
                }
            }

            if (expected.higher) {
                if (actual < expected.higher) {
                    return false;
                }
            }

            return true;
        };

        let standardComparator = (obj, text) => {
            text = ('' + text).toLowerCase();
            return ('' + obj).toLowerCase().indexOf(text) > -1;
        };

        let surveillanceComparator = (actual, expected) => {
            let closed, closedNC, never, open, openNC, ret, surv;
            let separator = expected.separator ? expected.separator : '';

            if (typeof expected.surveillance === 'string') {
                if (!actual) {
                    return false;
                }
                surv = angular.fromJson(actual);
                if (expected.surveillance === 'never') {
                    ret = surv.surveillanceCount === 0;
                } else {
                    ret = surv.surveillanceCount !== 0;
                    if (expected.NC) {
                        never = expected.NC.never;
                        open = expected.NC.open;
                        closed = expected.NC.closed;
                        openNC = surv.openNonconformityCount > 0;
                        closedNC = surv.closedNonconformityCount > 0;
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

            // expanded surveillance filter
            if (typeof expected.surveillance === 'object') {
                if (!actual) {
                    return false;
                }
                surv = angular.fromJson(actual);
                if (expected.surveillance.status === 'never') {
                    ret = surv.openSurveillanceCount === 0 && surv.closedSurveillanceCount === 0;
                } else {
                    ret = surv.openSurveillanceCount !== 0 || surv.closedSurveillanceCount !== 0;
                    let openSurveillance = expected.surveillance.open;
                    let closedSurveillance = expected.surveillance.closed;
                    let openS = surv.openSurveillanceCount > 0;
                    let closedS = surv.closedSurveillanceCount > 0;
                    if (openSurveillance && !closedSurveillance) {
                        ret = ret && openS;
                    } else if (!openSurveillance && closedSurveillance) {
                        ret = ret && closedS;
                    } else if (expected.matchAll && openSurveillance && closedSurveillance) {
                        ret = ret && openS && closedS;
                    }
                    if (expected.NC) {
                        never = expected.NC.never;
                        open = expected.NC.open;
                        closed = expected.NC.closed;
                        openNC = surv.openNonconformityCount > 0;
                        closedNC = surv.closedNonconformityCount > 0;
                        /*
                         * matching one of the possibles
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
                    if (expected.dates && surv.surveillanceDates) {
                        let openAfter = expected.dates.openAfter ? expected.dates.openAfter.getTime() : false;
                        let openBefore = expected.dates.openBefore ? expected.dates.openBefore.getTime() : false;
                        let closeAfter = expected.dates.closeAfter ? expected.dates.closeAfter.getTime() : false;
                        let closeBefore = expected.dates.closeBefore ? expected.dates.closeBefore.getTime() : false;
                        let passes = {
                            oa: !expected.dates.openAfter,
                            ob: !expected.dates.openBefore,
                            ca: !expected.dates.closeAfter,
                            cb: !expected.dates.closeBefore,
                        };
                        if (!passes.oa || !passes.ob || !passes.ca || !passes.cb) { // at least one of the dates is defined
                            surv.surveillanceDates
                                .split(separator)
                                .forEach(pair => {
                                    let pairs = pair.split('&');
                                    passes.oa = passes.oa || parseInt(pairs[0], 10) > openAfter;
                                    passes.ob = passes.ob || parseInt(pairs[0], 10) < openBefore;
                                    passes.ca = passes.ca || (pairs[1] && parseInt(pairs[1], 10) > closeAfter);
                                    passes.cb = passes.cb || (pairs[1] && parseInt(pairs[1], 10) < closeBefore);
                                });
                            if (expected.matchAll) {
                                ret = ret && passes.oa && passes.ob && passes.ca && passes.cb;
                            } else {
                                ret = ret && (openAfter && passes.oa ||
                                              openBefore && passes.ob ||
                                              closeAfter && passes.ca ||
                                              closeBefore && passes.cb);
                            }
                        }
                    }
                }
                return ret;
            }
        };

        return function customFilter (array, expression) {

            function customComparator (actual, expected) {
                if (angular.isObject(expected)) {
                    //exact match
                    if (expected.distinct) {
                        return distinctComparator(actual, expected);
                    }

                    //surveillance match
                    if (expected.surveillance) {
                        return surveillanceComparator(actual, expected);
                    }

                    //nonconformities match
                    if (expected.nonconformities) {
                        return nonconformityComparator(actual, expected);
                    }

                    //matchAny
                    if (expected.matchAny) {
                        return matchAnyComparator(actual, expected);
                    }

                    //matchAll
                    if (expected.matchAll) {
                        return matchAllComparator(actual, expected);
                    }

                    //date range
                    if (expected.before || expected.after) {
                        return dateRangeComparator(actual, expected);
                    }

                    // range comparator
                    if (expected.lower || expected.higher) {
                        return rangeComparator(actual, expected);
                    }

                    return true;

                }
                return standardComparator(actual, expected);
            }

            var output;
            // if we want the spinny circle on smart-table updates, add this line here: cfpLoadingBar.start();
            output = filterFilter(array, expression, customComparator);
            // and this line here: cfpLoadingBar.complete();
            return output;
        };
    }
})();
