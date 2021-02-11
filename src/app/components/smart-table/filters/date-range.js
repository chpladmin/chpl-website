const dateRange = (input, rules) => {
  let higherLimit, itemDate, lowerLimit, queryDate;

  if (rules.before) {
    higherLimit = rules.before;

    itemDate = new Date(input);
    queryDate = new Date(higherLimit);
    if (itemDate > queryDate) {
      return false;
    }
  }

  if (rules.after) {
    lowerLimit = rules.after;

    itemDate = new Date(input);
    queryDate = new Date(lowerLimit);
    if (itemDate < queryDate) {
      return false;
    }
  }

  return true;
};

export { dateRange };
