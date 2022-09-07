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

const compareObject = (before, after, lookup, root = 'root') => {
  const keys = (before && Object.keys(before)) || (after && Object.keys(after)) || [];
  const diffs = keys.map((key) => {
    const b = before ? before[key] : undefined;
    const a = after ? after[key] : undefined;
    switch (findType(b, a)) {
      case 'primitive':
        return b !== a ? getMessage(before, after, root, key, lookup) : '';
      case 'no-change':
        // console.debug(`compareObject.no-change: ${root}.${key}: ${before[key]} => ${after[key]}`);
        return undefined;
      case 'array':
        // console.debug(`compareObject.array: ${root}.${key}: ${before[key]} => ${after[key]}`);
        return getMessage(b, a, root, key, lookup);
      case 'object':
        const messages = compareObject(b, a, lookup, `${root}.${key}`).map((msg) => `<li>${msg}</li>`);
        return messages.length > 0 ? (getMessage(before, after, root, key, lookup) + `<ul>${messages.join('')}</ul>`) : '';
        // no default
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
  compareObject,
  comparePrimitive,
};
