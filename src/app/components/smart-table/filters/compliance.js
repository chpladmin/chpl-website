const compliance = (input, rules) => {
  let closed, hasClosedNc, hasNoNc, hasOpenNc, listing, never, open;

  if (!input) {
    return false;
  }
  listing = angular.fromJson(input);
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
  hasNoNc = listing.openNonConformityCount === 0 && listing.closedNonConformityCount === 0;
  hasOpenNc = listing.openNonConformityCount > 0;
  hasClosedNc = listing.closedNonConformityCount > 0;
  /*
   * If matching all
   */
  if (rules.matchAll) {
    return never === hasNoNc
      && open === hasOpenNc
      && closed === hasClosedNc;
  }
  /*
   * matching only one of the possibles
   */
  if (never && !open && !closed) {
    return hasNoNc;
  }
  if (!never && open && !closed) {
    return hasOpenNc;
  }
  if (!never && !open && closed) {
    return hasClosedNc;
  }
  /*
   * now matching with at least two checkboxes selected
   */
  if (never && open && !closed) {
    return hasOpenNc || hasNoNc;
  }
  if (never && !open && closed) {
    return hasClosedNc || hasNoNc;
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
