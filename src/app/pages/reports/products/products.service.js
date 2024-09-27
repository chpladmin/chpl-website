import { compareObject, comparePrimitive } from 'pages/reports/reports.v2.service';
import { getDisplayDateFormat } from 'services/date-util';

const compareOwnerHistory = (before, after) => {
  if (before.length === 0 && after.length === 0) { return undefined; }
  let changes = 'Owner history changed. Was:<ul>';
  changes += (before.length === 0) ? '<li>No previous history</li>' : before
    .map((item) => `<li><strong>${item.developer.name}</strong> on ${getDisplayDateFormat(item.transferDay ? item.transferDay : item.transferDate)}</li>`)
    .join('');
  changes += '</ul>Now:<ul>';
  changes += (after.length === 0) ? '<li>No current history</li>' : after
    .map((item) => `<li><strong>${item.developer.name}</strong> on ${getDisplayDateFormat(item.transferDay ? item.transferDay : item.transferDate)}</li>`)
    .join('');
  changes += '</ul>';
  return changes;
};

const lookup = {
  shortCircuit: [
    'root.owner.address',
    'root.owner.contact',
  ],
  'root.contact': { message: () => 'Contact changes' },
  'root.contact.contactId': { message: () => undefined },
  'root.contact.email': { message: (before, after) => comparePrimitive(before, after, 'email', 'Email') },
  'root.contact.firstName': { message: (before, after) => comparePrimitive(before, after, 'firstName', 'First Name') },
  'root.contact.friendlyName': { message: (before, after) => comparePrimitive(before, after, 'friendlyName', 'Friendly Name') },
  'root.contact.fullName': { message: (before, after) => comparePrimitive(before, after, 'fullName', 'Full Name') },
  'root.contact.id': { message: () => undefined },
  'root.contact.lastName': { message: (before, after) => comparePrimitive(before, after, 'lastName', 'Last Name') },
  'root.contact.phoneNumber': { message: (before, after) => comparePrimitive(before, after, 'phoneNumber', 'Phone Number') },
  'root.contact.title': { message: (before, after) => comparePrimitive(before, after, 'title', 'Title') },
  'root.developerCode': { message: () => undefined },
  'root.developerId': { message: () => undefined },
  'root.developerName': { message: (before, after) => comparePrimitive(before, after, 'developerName', 'Developer') },
  'root.lastModifiedDate': { message: () => undefined },
  'root.lastModifiedUser': { message: () => undefined },
  'root.name': { message: (before, after) => comparePrimitive(before, after, 'name', 'Product Name') },
  'root.owner': { message: () => 'Developer changes' },
  'root.owner.attestations': { message: () => undefined },
  'root.owner.developerCode': { message: () => undefined },
  'root.owner.developerId': { message: () => undefined },
  'root.owner.id': { message: () => undefined },
  'root.owner.lastModifiedDate': { message: () => undefined },
  'root.owner.name': { message: (before, after) => comparePrimitive(before, after, 'name', 'Developer') },
  'root.owner.selfDeveloper': { message: () => undefined },
  'root.owner.statusEvents': { message: () => undefined },
  'root.owner.statuses': { message: () => undefined },
  'root.owner.transparencyAttestationMappings': { message: () => undefined },
  'root.owner.website': { message: () => undefined },
  'root.ownerHistory': { message: compareOwnerHistory },
  'root.productVersions': { message: () => undefined },
};

const compareProduct = (prev, curr) => compareObject(prev, curr, lookup);

export { compareProduct }; // eslint-disable-line import/prefer-default-export
