import { compareArrays, compareObject, comparePrimitive } from 'pages/reports/reports.v2.service';
import { getDisplayDateFormat } from 'services/date-util';

let lookup;

/* eslint-disable no-nested-ternary */
const compare = (before, after, key, title = 'unknown') => {
  let options;
  switch (key) {
    case 'organizations':
      options = {
        sort: (p, c) => p.name.localeCompare(c.name, 'en', { sensitivity: 'base' }),
        write: (f) => `Organization "${f.name}"`,
      };
      break;
    default:
      if (after.length > 0) {
        console.debug({ before, after, key });
      }
      return undefined;
  }
  const changes = compareArrays(before, after, { ...options, root: key }, lookup);
  if (changes && changes.length > 0) {
    return `${title} changes<ul>${changes.join('')}</ul>`;
  }
  return undefined;
};

lookup = {
  shortCircuit: [
  ],
  'root.accountEnabled': { message: (before, after) => comparePrimitive(before, after, 'accountEnabled', 'Account Enabled') },
  'root.accountLocked': { message: (before, after) => comparePrimitive(before, after, 'accountLocked', 'Account Locked') },
  'root.accountNonLocked': { message: (before, after) => comparePrimitive(before, after, 'accountNonLocked', 'Account Non-Locked') },
  'root.email': { message: (before, after) => comparePrimitive(before, after, 'email', 'Email') },
  'root.enabled': { message: (before, after) => comparePrimitive(before, after, 'enabled', 'Enabled') },
  'root.failedLoginCount': { message: (before, after) => comparePrimitive(before, after, 'failedLoginCount', 'Failed Login Count') },
  'root.friendlyName': { message: (before, after) => comparePrimitive(before, after, 'friendlyName', 'Friendly Name') },
  'root.fullName': { message: (before, after) => comparePrimitive(before, after, 'fullName', 'Full Name') },
  'root.organizations': { message: (before, after) => compare(before, after, 'organizations', 'Organizations') },
  'root.passwordResetRequired': { message: (before, after) => comparePrimitive(before, after, 'passwordResetRequired', 'Password Reset Required') },
  'root.phoneNumber': { message: (before, after) => comparePrimitive(before, after, 'phoneNumber', 'Phone Number') },
  'root.signatureDate': { message: (before, after) => comparePrimitive(before, after, 'signatureDate', 'Signature Date', getDisplayDateFormat) },
  'root.title': { message: (before, after) => comparePrimitive(before, after, 'title', 'Title') },
};

const compareUser = (prev, curr) => compareObject(prev, curr, lookup);

export default compareUser;
