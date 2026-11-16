import {
  compareArrays,
  compareBoolean,
  compareObject,
  comparePrimitive,
} from 'pages/reports/reports.v2.service';
import { getDisplayDateFormat } from 'services/date-util';

let lookup;

/* eslint-disable no-nested-ternary */
const compare = (before, after, key, title = 'unknown') => {
  let options;
  switch (key) {
    case 'organizations':
      options = {
        // Exact and case-sensitive: 0 means "same organization", so a case-only rename still shows as a change
        sort: (p, c) => (p.name > c.name) - (p.name < c.name),
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

// Older user activity holds status as an object of account fields, newer activity as a string.
// For the object, compareObject lists the nested changes, so this is only their heading.
const compareStatus = (before, after) => {
  if (typeof (before?.status ?? after?.status) === 'object') {
    return 'Status';
  }
  return comparePrimitive(before, after, 'status', 'Status');
};

lookup = {
  shortCircuit: [
  ],
  'root.accountEnabled': { message: (before, after) => compareBoolean(before, after, 'accountEnabled', 'Account Enabled') },
  'root.accountLocked': { message: (before, after) => compareBoolean(before, after, 'accountLocked', 'Account Locked') },
  'root.accountNonLocked': { message: (before, after) => compareBoolean(before, after, 'accountNonLocked', 'Account Non-Locked') },
  'root.cognitoId': { message: () => undefined },
  'root.credentialsExpired': { message: (before, after) => compareBoolean(before, after, 'credentialsExpired', 'Credentials Expired') },
  'root.email': { message: (before, after) => comparePrimitive(before, after, 'email', 'Email') },
  'root.enabled': { message: (before, after) => compareBoolean(before, after, 'enabled', 'Enabled') },
  'root.failedLoginCount': { message: (before, after) => comparePrimitive(before, after, 'failedLoginCount', 'Failed Login Count') },
  'root.friendlyName': { message: (before, after) => comparePrimitive(before, after, 'friendlyName', 'Friendly Name') },
  'root.fullName': { message: (before, after) => comparePrimitive(before, after, 'fullName', 'Full Name') },
  'root.hash': { message: () => undefined },
  'root.lastLoggedInDate': { message: () => undefined },
  'root.organizations': { message: (before, after) => compare(before, after, 'organizations', 'Organizations') },
  'root.passwordResetRequired': { message: (before, after) => compareBoolean(before, after, 'passwordResetRequired', 'Password Reset Required') },
  'root.phoneNumber': { message: (before, after) => comparePrimitive(before, after, 'phoneNumber', 'Phone Number') },
  'root.role': { message: (before, after) => comparePrimitive(before, after, 'role', 'Role') },
  'root.signatureDate': { message: (before, after) => comparePrimitive(before, after, 'signatureDate', 'Signature Date', getDisplayDateFormat) },
  'root.status': { message: compareStatus },
  'root.status.accountEnabled': { message: (before, after) => compareBoolean(before, after, 'accountEnabled', 'Enabled') },
  'root.status.accountLocked': { message: (before, after) => compareBoolean(before, after, 'accountLocked', 'Locked') },
  'root.status.cognitoId': { message: (before, after) => comparePrimitive(before, after, 'cognitoId', 'Cognito ID') },
  'root.status.credentialsExpired': { message: (before, after) => compareBoolean(before, after, 'credentialsExpired', 'Credentials Expired') },
  'root.status.email': { message: (before, after) => comparePrimitive(before, after, 'email', 'Email') },
  'root.status.fullName': { message: (before, after) => comparePrimitive(before, after, 'fullName', 'Full Name') },
  'root.status.hash': { message: () => undefined },
  'root.status.lastLoggedInDate': { message: () => undefined },
  'root.status.organizations': { message: (before, after) => compare(before, after, 'organizations', 'Organizations') },
  'root.status.passwordResetRequired': { message: (before, after) => compareBoolean(before, after, 'passwordResetRequired', 'Password Reset Required') },
  'root.status.phoneNumber': { message: (before, after) => comparePrimitive(before, after, 'phoneNumber', 'Phone Number') },
  'root.status.role': { message: (before, after) => comparePrimitive(before, after, 'role', 'Role') },
  'root.status.status': { message: (before, after) => comparePrimitive(before, after, 'status', 'Status') },
  'root.status.subjectName': { message: (before, after) => comparePrimitive(before, after, 'subjectName', 'Subject Name') },
  'root.subjectName': { message: (before, after) => comparePrimitive(before, after, 'subjectName', 'Subject Name') },
  'root.title': { message: (before, after) => comparePrimitive(before, after, 'title', 'Title') },
};

const compareUser = (prev, curr) => compareObject(prev, curr, lookup);

export default compareUser;
