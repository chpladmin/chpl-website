import { boolean } from './filters/boolean';
import { compliance } from './filters/compliance';
import { distinct } from './filters/distinct';
import { dateRange } from './filters/date-range';
import { matchAll} from './filters/match-all';
import { matchAny} from './filters/match-any';

(function () {
    'use strict';
    angular.module('chpl.components')
        .filter('customFilter', CustomFilter);

    /** @ngInject */
    function CustomFilter ($filter) { // will need cfpLoadingBar back if we want the "spinny circle" on smart-table filtering
        let filterFilter = $filter('filter');

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
                    ret = (open && openNC) || (closed && closedNC);
                }
            }
            return ret;
        };

        let standardComparator = (obj, text) => {
            text = ('' + text).toLowerCase();
            return ('' + obj).toLowerCase().indexOf(text) > -1;
        };

        let surveillanceComparator = (actual, expected) => {
            let closed, closedNC, never, open, openNC, ret, surv;
            let separator = expected.separator ? expected.separator : '';

            if (typeof expected.surveillance === 'string') {
                return false;
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
                            ret = ret && openNC;
                        } else if (!never && !open && closed) {
                            ret = ret && closedNC;
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
                        return distinct(actual, expected);
                    }

                    //boolean match
                    if (expected.boolean) {
                        return boolean(actual, expected);
                    }

                    //compliance match
                    if (expected.compliance) {
                        return compliance(actual, expected);
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
                        return matchAny(actual, expected);
                    }

                    //matchAll
                    if (expected.matchAll) {
                        return matchAll(actual, expected);
                    }

                    //date range
                    if (expected.before || expected.after) {
                        return dateRange(actual, expected);
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
