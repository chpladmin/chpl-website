/* eslint-disable no-console,angular/log */
const compliance = (input, rules) => {
    let closed, hasClosedNc, hasOpenNc, listing, never, open;

    if (!input) {
        return false;
    }
    listing = angular.fromJson(input.compliance);
    if (rules.compliance === 'never') {
        return listing.complianceCount === 0;
    }
    if (!rules.NC) {
        return listing.complianceCount !== 0;
    }
    if (listing.complianceCount === 0) {
        return false;
    }
    never = rules.NC.never;
    open = rules.NC.open;
    closed = rules.NC.closed;
    hasOpenNc = listing.openNonconformityCount > 0;
    hasClosedNc = listing.closedNonconformityCount > 0;
    /*
     * matching only one of the possibles
     */
    if (never && !open && !closed) {
        return !hasOpenNc && !hasClosedNc;
    }
    if (!never && open && !closed) {
        return hasOpenNc;
    }
    if (!never && !open && closed) {
        return hasClosedNc;
    }
    /*
     * if matching more than one, need to know if matchAll is true or not
     * if true, only valid "multiple &" is !never && open && closed
     */
    if (rules.matchAll) {
        return !never && open && closed && hasOpenNc && hasClosedNc;
    }
    /*
     * now matching "matchAny" with at least two checkboxes selected
     */
    if (never && open && !closed) {
        return hasOpenNc && !hasClosedNc;
    }
    if (never && !open && closed) {
        return !hasOpenNc && hasClosedNc;
    }
    if (!never && open && closed) {
        return hasOpenNc || hasClosedNc;
    }
    /*
     * these triple multiples on matchAny:
     * * never && open && closed
     * * !never && !open && !closed
     * are equivalent to "all", and so if we get here, it's a listing that should be seen
     */
    return true;
};

export { compliance };
