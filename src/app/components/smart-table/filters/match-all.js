const matchAll = (input, rules) => {
  let separator = rules.separator ? rules.separator : '';

  if (rules.matchAll.items.length === 0) {
    return true;
  }

  if (!input) {
    return false;
  }

  return rules.matchAll.items.reduce((matching, item) => {
    let inp = (separator + input + separator).toLowerCase();
    let itm = (separator + item + separator).toLowerCase();
    return matching && (inp === itm || inp.indexOf(itm) > -1);
  }, true);
};

export { matchAll };
