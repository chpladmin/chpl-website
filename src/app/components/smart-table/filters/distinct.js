const distinct = (input, rules) => {
  if (!input || input.toLowerCase() !== rules.distinct.toLowerCase()) {
    return false;
  }

  return true;
};

export { distinct };
