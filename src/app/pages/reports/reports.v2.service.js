const getMessage = (before, after, root, key, lookup) => {
  if (lookup[`${root}.${key}`]) {
    return lookup[`${root}.${key}`].message(before, after);
  }
  console.debug(`getMessage: ${root}.${key}: ${before[key]} => ${after[key]}`);
  return undefined;
};

const findType = (before, after) => {
  if (typeof before === 'boolean' || typeof after === 'boolean') {
    return 'primitive';
  }
  if (!before && after) {
    return 'added';
  }
  if (before && !after) {
    return 'deleted';
  }
  if (!before && !after) {
    return 'no-change';
  }
  if (typeof before !== 'object') {
    return 'primitive';
  }
  if (Array.isArray(before)) {
    return 'array';
  }
  return 'object';
};

const compareObject = (before, after, lookup, root = 'root') => {
  const keys = (before && Object.keys(before)) || (after && Object.keys(after)) || [];
  const diffs = keys.map((key) => {
    switch (findType(before[key], after[key])) {
      case 'primitive':
        return before[key] !== after[key] ? getMessage(before, after, root, key, lookup) : '';
      case 'added':
        console.debug(`compareObject.added: ${root}.${key}: ${before[key]} => ${after[key]}`);
        return undefined;
      case 'deleted':
        console.debug(`compareObject.deleted: ${root}.${key}: ${before[key]} => ${after[key]}`);
        return undefined;
      case 'no-change':
        // console.debug(`compareObject.no-change: ${root}.${key}: ${before[key]} => ${after[key]}`);
        return undefined;
      case 'array':
        // console.debug(`compareObject.array: ${root}.${key}: ${before[key]} => ${after[key]}`);
        return getMessage(before[key], after[key], root, key, lookup);
      case 'object':
        const messages = compareObject(before[key], after[key], lookup, `${root}.${key}`).map((msg) => `<li>${msg}</li>`);
        return messages.length > 0 ? (lookup[`${root}.${key}`].message() + `<ul>${messages.join('')}</ul>`) : '';
        // no default
    }
  }).filter((msg) => !!msg);
  return diffs;
};

const comparePrimitive = (before, after, title) => {
  if (!before && after) {
    return `${title} added: ${after}`;
  }
  if (before && !after) {
    return `${title} removed: ${before}`;
  }
  return `${title} changed from ${before} to ${after}`;
};

export {
  compareObject,
  comparePrimitive,
};
