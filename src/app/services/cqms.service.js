const getCqmValue = (cqm) => {
  const str = (cqm.name.substring(0, 3) !== 'CMS') ? `NQF-${cqm.name}` : cqm.name;
  const edition = 1000 * str.indexOf('-');
  const num = parseInt(edition > 0 ? str.substring(4) : str.substring(3), 10);
  const ret = edition + num;
  return ret;
};

const sortCqms = (a, b) => getCqmValue(a) - getCqmValue(b);

export {
  sortCqms, // eslint-disable-line import/prefer-default-export
};
