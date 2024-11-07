import { compareArrays, compareObject, comparePrimitive } from 'pages/reports/reports.v2.service';
import { getDisplayDateFormat } from 'services/date-util';

let lookup;

/* eslint-disable no-nested-ternary */
const compare = (before, after, key, title = 'unknown') => {
  let options;
  switch (key) {
    case 'statusEvents':
      options = {
        sort: (p, c) => (p.eventDate < c.eventDate ? -1 : p.eventDate > c.eventDate ? 1 : 0),
        write: (f) => `Status "${f.status.name ?? f.status.statusName ?? f.status.status}"`,
      };
      break;
    case 'statuses':
      options = {
        sort: (p, c) => (p.startDate < c.startDate ? -1 : p.startDate > c.startDate ? 1 : 0),
        write: (f) => `Status "${f.status.name}"`,
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
  'root.contact': { message: () => 'Contact changes:' },
  'root.contact.email': { message: (before, after) => comparePrimitive(before, after, 'email', 'Email') },
  'root.contact.firstName': { message: (before, after) => comparePrimitive(before, after, 'firstName', 'First Name') },
  'root.contact.id': { message: () => undefined },
  'root.contact.lastName': { message: (before, after) => comparePrimitive(before, after, 'lastName', 'Last Name') },
  'root.contact.phoneNumber': { message: (before, after) => comparePrimitive(before, after, 'phoneNumber', 'Phone Number') },
  'root.creationDate': { message: (before, after) => comparePrimitive(before, after, 'creationDate', 'Creation Date', getDisplayDateFormat) },
  'root.developerName': { message: (before, after) => comparePrimitive(before, after, 'developerName', 'Developer Name') },
  'root.developerCode': { message: () => undefined },
  'root.developerId': { message: () => undefined },
  'root.lastModifiedDate': { message: () => undefined },
  'root.lastModifiedUser': { message: () => undefined },
  'root.productId': { message: () => undefined },
  'root.productName': { message: (before, after) => comparePrimitive(before, after, 'productName', 'Product Name') },
  'root.version': { message: (before, after) => comparePrimitive(before, after, 'version', 'Version') },

  'root.statusEvents': { message: (before, after) => compare(before, after, 'statusEvents', 'Status Events') },
};

const compareProducts = (prev, curr) => compareObject(prev, curr, lookup);

export default compareProducts;
