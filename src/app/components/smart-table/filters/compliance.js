/* eslint-disable no-console,angular/log */
const compliance = (input, rules) => {
    let closed, closedNC, listing, never, open, openNC, ret;

    if (!input) {
        return false;
    }
    listing = angular.fromJson(input.compliance);
    if (rules.compliance === 'never') {
        ret = listing.complianceCount === 0;
    } else {
        ret = listing.complianceCount !== 0;
        if (rules.NC) {
            never = rules.NC.never;
            open = rules.NC.open;
            closed = rules.NC.closed;
            openNC = listing.openNonconformityCount > 0;
            closedNC = listing.closedNonconformityCount > 0;
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
            } else if (rules.matchAll && !never && open && closed) {
                ret = ret && openNC && closedNC;
            } else if (rules.matchAll) {
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
};

export { compliance };
