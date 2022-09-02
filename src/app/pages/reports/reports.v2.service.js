const getMessage = (before, after, root, key, lookup) => {
  if (lookup[`${root}.${key}`]) {
    return lookup[`${root}.${key}`].message(before, after);
  }
  console.debug(`getMessage: ${root}.${key}: ${before[key]} => ${after[key]}`);
  return undefined;
};

const compareObject = (before, after, lookup, root = 'root') => {
  const keys = (before && Object.keys(before)) || (after && Object.keys(after)) || [];
  const diffs = keys.map((key) => {
    switch (typeof before[key]) {
      case 'boolean':
        return before[key] !== after[key] ? getMessage(before, after, root, key, lookup) : '';
      case 'string':
        return before[key] !== after[key] ? getMessage(before, after, root, key, lookup) : '';
      case 'number':
        return before[key] !== after[key] ? getMessage(before, after, root, key, lookup) : '';
      case 'object':
        if (before[key] !== null) {
          const messages = compareObject(before[key], after[key], lookup, `${root}.${key}`).map((msg) => `<li>${msg}</li>`)
          return messages.length > 0 ? `object - ${root}.${key}: <ul>${messages.join('')}</ul>` : '';
        } else {
          console.debug(`compareObject: ${root}.${key}: ${before[key]} => ${after[key]}`);
          return undefined;
        }
      default:
        return `${typeof before[key]} - ${getMessage(before, after, root, key, lookup)}`;
    }
  }).filter((msg) => !!msg);
  return diffs;
};

export { compareObject };
