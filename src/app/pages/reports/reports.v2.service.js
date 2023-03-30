const getMessage = (before, after, root, key, lookup) => {
  if (lookup[`${root}.${key}`]) {
    return lookup[`${root}.${key}`].message(before, after);
  }
  console.debug(`getMessage: ${root}.${key}: ${before ? before[key] : undefined} => ${after ? after[key] : undefined}`);
  return undefined;
};

const findType = (before, after) => {
  if (typeof before === 'boolean' || typeof after === 'boolean') {
    return 'primitive';
  }
  if (before && after && typeof before !== 'object') {
    return 'primitive';
  }
  if (!before && after && typeof after !== 'object') {
    return 'primitive';
  }
  if (before && !after && typeof before !== 'object') {
    return 'primitive';
  }
  if (!before && !after) {
    return 'no-change';
  }
  if (Array.isArray(before)) {
    return 'array';
  }
  return 'object';
};

  /**
     * Compare two arrays.
     * previous & current are arrays of objects
     * options is an object containing functions
     *   required functions:
     *      sort - function (a, b) : return negative number, 0, or positive number for whether a is <, =, or > b, respectively
     *      write - function (o) : return string of user friendly name of object o
     *   optional functions:
     *      compare - f (a, b) : return true iff a !== b and should be considered as a change
     *      change - f (p, c) : return string of user friendly description of change from p to c
     * lookup is the lookup table to get messages from
     * Returns array of changes between the arrays
     */
const compareArrays = (previous, current, options, lookup) => {
  if (!Array.isArray(previous) || !Array.isArray(current)) {
    return [];
  }
  const ret = [];
  const prev = [...previous].sort(options.sort);
  const curr = [...current].sort(options.sort);
  let p = 0;
  let c = 0;

  while (p < prev.length && c < curr.length) {
    const sort = options.sort(prev[p], curr[c]);
    if (sort < 0) {
      ret.push('<li>Removed ' + options.write(prev[p]) + '</li>');
      p++;
    } else if (sort > 0) {
      ret.push('<li>Added ' + options.write(curr[c]) + '</li>');
      c++;
    } else if (sort === 0) {
      if (typeof options.compare === 'function' && options.compare(prev[p], curr[c])) {
        ret.push('<li>' + options.change(prev[p], curr[c]) + '</li>');
      }
      p++;
      c++;
    } else {
      console.debug('Invalid sort', prev[p], curr[c], sort);
      p++;
      c++;
    }
  }
  while (c < curr.length) {
    ret.push('<li>Added ' + options.write(curr[c]) + '</li>');
    c++;
  }
  while (p < prev.length) {
    ret.push('<li>Removed ' + options.write(prev[p]) + '</li>');
    p++;
  }

  return ret;
};

const compareObject = (before, after, lookup, root = 'root') => {
  const keys = (before && Object.keys(before)) || (after && Object.keys(after)) || [];
  const diffs = keys.map((key) => {
    const b = before ? before[key] : undefined;
    const a = after ? after[key] : undefined;
    switch (findType(b, a)) {
      case 'primitive':
        return b !== a ? getMessage(before, after, root, key, lookup) : '';
      case 'array':
        return getMessage(b, a, root, key, lookup);
      case 'object':
        if (lookup.shortCircuit?.includes(`${root}.${key}`)) { return undefined; }
        const messages = compareObject(b, a, lookup, `${root}.${key}`).map((msg) => `<li>${msg}</li>`);
        return messages.length > 0 ? (`${getMessage(before, after, root, key, lookup)}<ul>${messages.join('')}</ul>`) : '';
      default:
        return undefined;
    }
  }).filter((msg) => !!msg);
  return diffs;
};

const comparePrimitive = (before, after, key, title, transform = (val) => val) => {
  if ((!before || !before[key]) && after && after[key]) {
    return `${title} added: ${transform(after[key])}`;
  }
  if (before && before[key] && (!after || !after[key])) {
    return `${title} removed: ${transform(before[key])}`;
  }
  return `${title} changed from ${transform(before[key])} to ${transform(after[key])}`;
};

export {
  compareArrays,
  compareObject,
  comparePrimitive,
};
