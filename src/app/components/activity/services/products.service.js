import { compareArrays, compareObject, comparePrimitive } from 'pages/reports/reports.v2.service';
import { getDisplayDateFormat } from 'services/date-util';

let lookup;

/* eslint-disable no-nested-ternary */
const compare = (before, after, key, title = 'unknown') => {
  let options;
  switch (key) {
    case 'ownerHistory':
      options = {
        sort: (p, c) => (p.transferDate < c.transferDate ? -1 : p.transferDate > c.transferDate ? 1 : 0),
        write: (f) => `Developer "${f.developer.name}"`,
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
    'root.owner',
  ],
  'root.contact': { message: () => 'Contact changes:' },
  'root.contact.contactId': { message: () => undefined },
  'root.contact.email': { message: (before, after) => comparePrimitive(before, after, 'email', 'Email') },
  'root.contact.firstName': { message: (before, after) => comparePrimitive(before, after, 'firstName', 'First Name') },
  'root.contact.fullName': { message: (before, after) => comparePrimitive(before, after, 'fullName', 'Full Name') },
  'root.contact.id': { message: () => undefined },
  'root.contact.lastName': { message: (before, after) => comparePrimitive(before, after, 'lastName', 'Last Name') },
  'root.contact.phoneNumber': { message: (before, after) => comparePrimitive(before, after, 'phoneNumber', 'Phone Number') },
  'root.creationDate': { message: (before, after) => comparePrimitive(before, after, 'creationDate', 'Creation Date', getDisplayDateFormat) },
  'root.developerCode': { message: () => undefined },
  'root.developerId': { message: () => undefined },
  'root.developerName': { message: (before, after) => comparePrimitive(before, after, 'developerName', 'Developer Name') },
  'root.lastModifiedDate': { message: () => undefined },
  'root.lastModifiedUser': { message: () => undefined },
  'root.name': { message: (before, after) => comparePrimitive(before, after, 'name', 'Name') },
  'root.ownerHistory': { message: (before, after) => compare(before, after, 'ownerHistory', 'Owner History') },
  'root.productId': { message: () => undefined },
  'root.productName': { message: (before, after) => comparePrimitive(before, after, 'productName', 'Product Name') },
  'root.productVersions': { message: () => undefined },
  'root.version': { message: (before, after) => comparePrimitive(before, after, 'version', 'Version') },
};

const compareProducts = (prev, curr) => compareObject(prev, curr, lookup);

export default compareProducts;
