const nonconformity = (input, rules) => {
  let closed, closedNC, listing, open, openNC;

  if (!input) {
    return false;
  }
  listing = angular.fromJson(input);
  open = rules.nonconformities.open;
  closed = rules.nonconformities.closed;
  openNC = listing.openNonConformityCount > 0;
  closedNC = listing.closedNonConformityCount > 0;
  if (rules.nonconformities.matchAll) {
    return (openNC === open) && (closedNC === closed);
  } else {
    if (!open && !closed) {
      return true;
    } else {
      return !!((openNC && open) || (closedNC && closed));
    }
  }
};

export { nonconformity };
