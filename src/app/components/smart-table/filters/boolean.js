const boolean = (input, rules) => {
  if (rules.boolean === 'Any') {
    return true;
  }
  if (input && rules.boolean === 'True') {
    return true;
  }
  if (!input && rules.boolean === 'False') {
    return true;
  }
  return false;
};

export { boolean };
