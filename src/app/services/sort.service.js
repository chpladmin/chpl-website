// One shared collator: building one per comparison (as `localeCompare` with an
// options object does) is around a hundred times slower on long lists.
//   sensitivity 'base': ignore case (and accents), so "AbCDeF" rather than "ACDFbe"
//   numeric: compare runs of digits as numbers, so "item2" comes before "item10"
const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });

// Compares human-readable strings for sorting. Equal strings (e.g. "Apple" and
// "apple") return 0, so a stable sort keeps them in their incoming order.
// null and undefined sort last. Negate the result for a descending sort.
const compareStrings = (a, b) => {
  const aMissing = a === null || a === undefined;
  const bMissing = b === null || b === undefined;
  if (aMissing || bMissing) {
    if (aMissing && bMissing) { return 0; }
    return aMissing ? 1 : -1;
  }
  return collator.compare(`${a}`, `${b}`);
};

export { compareStrings }; // eslint-disable-line import/prefer-default-export
