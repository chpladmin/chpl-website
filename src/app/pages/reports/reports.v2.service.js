const getMessage = (before, after, root, key, lookup) => {
  if (lookup[`${root}.${key}`]) {
    return lookup[`${root}.${key}`].message(before, after);
  }
  console.debug(`getMessage: ${root}.${key}:\n ${JSON.stringify(before)}\n=>\n${JSON.stringify(after)}\n\n`);
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

const compareObject = (before, after, lookup, root = 'root') => {
  // walk both sides, so a key that only exists on one side is still compared
  const keys = [...new Set([...Object.keys(before ?? {}), ...Object.keys(after ?? {})])];
  let messages;
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
        messages = compareObject(b, a, lookup, `${root}.${key}`).map((msg) => `<li>${msg}</li>`);
        return messages.length > 0 ? (`${getMessage(before, after, root, key, lookup)}<ul>${messages.join('')}</ul>`) : '';
      default:
        return undefined;
    }
  }).filter((msg) => !!msg);
  return diffs;
};

/**
 * Compare two arrays.
 * previous & current are arrays of objects
 * options is an object containing functions
 *   required functions:
 *      sort - function (a, b) : return negative number, 0, or positive number for whether a is <, =, or > b, respectively
 *      write - function (o) : return string of user friendly name of object o
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
      ret.push(`<li>Removed ${options.write(prev[p])}</li>`);
      p += 1;
    } else if (sort > 0) {
      ret.push(`<li>Added ${options.write(curr[c])}</li>`);
      c += 1;
    } else if (sort === 0) {
      const compared = compareObject(prev[p], curr[c], lookup, options.root);
      if (compared.length > 0) {
        ret.push(`<li>${options.write(curr[c])} changes<ul>${compared.map((msg) => `<li>${msg}</li>`).join('')}</ul></li>`);
      }
      p += 1;
      c += 1;
    } else {
      console.debug('Invalid sort', prev[p], curr[c], sort);
      p += 1;
      c += 1;
    }
  }
  while (c < curr.length) {
    ret.push(`<li>Added ${options.write(curr[c])}</li>`);
    c += 1;
  }
  while (p < prev.length) {
    ret.push(`<li>Removed ${options.write(prev[p])}</li>`);
    p += 1;
  }

  return ret;
};

/**
 * Compare a boolean field.
 * comparePrimitive can't be used for these: it treats false as "no value", so
 * false -> true reads as "added: true" and true -> false as "removed: true".
 * Anything other than true or false (undefined, null) counts as unset.
 * Returns undefined when the value didn't change.
 */
const compareBoolean = (before, after, key, title) => {
  const display = (value) => {
    if (value === true) { return 'Yes'; }
    if (value === false) { return 'No'; }
    return undefined;
  };
  const b = display(before?.[key]);
  const a = display(after?.[key]);
  if (b === a) { return undefined; }
  if (b === undefined) { return `${title} set to "${a}"`; }
  if (a === undefined) { return `${title} cleared (was "${b}")`; }
  return `${title} changed from "${b}" to "${a}"`;
};

const comparePrimitive = (before, after, key, title, transform = (val) => val, deprecatedBy) => {
  if (deprecatedBy && before[deprecatedBy]) { return undefined; }
  if ((!before || !before[key]) && after && after[key]) {
    return `${title} added: ${transform(after[key])}`;
  }
  if (before && before[key] && (!after || !after[key])) {
    return `${title} removed: ${transform(before[key])}`;
  }
  return `${title} changed from "${transform(before[key])}" to "${transform(after[key])}"`;
};

export {
  compareArrays,
  compareBoolean,
  compareObject,
  comparePrimitive,
};
