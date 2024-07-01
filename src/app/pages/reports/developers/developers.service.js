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

const compareAttestationData = (before, after) => {
  if (!before || !after || (before.length === 0 && after.length === 0)) {
    return undefined;
  }
  if (before.length === 0 && after.length === 1) {
    return `Attestation changes<ul><li>Attestations submitted for Attestation Period ending on ${after[0].attestationPeriod.periodEnd}</li></ul>`;
  }
  if (before.length === after.length) {
    const sortedBefore = before.sort((a, b) => (a.attestationPeriod.periodStart < b.attestationPeriod.periodStart ? -1 : 1));
    const sortedAfter = after.sort((a, b) => (a.attestationPeriod.periodStart < b.attestationPeriod.periodStart ? -1 : 1));
    const changes = sortedBefore
      .map((val, idx) => compareObject(val, sortedAfter[idx], lookup, 'attestations'))
      .filter((msgs) => msgs.length > 0)
      .map((msg) => `<li>${msg}</li>`);
    if (changes && changes.length > 0) {
      return `Attestation changes<ul>${changes.join('')}</ul>`;
    }
  }
  return undefined;
};

const compareTransparencyAttestations = (before, after) => {
  const changes = [];
  before.forEach((beforeTA) => {
    const afterTA = after.find((ta) => ta.acbId === beforeTA.acbId);
    const diffs = compareObject(beforeTA, afterTA, lookup)
      .filter((msgs) => msgs.length > 0)
      .map((msg) => `<li>${msg}</li>`);
    if (diffs && diffs.length > 0) {
      changes.push(...diffs);
    }
  });
  if (changes && changes.length > 0) {
    return `Transparency Attestation changes<ul>${changes.join('')}</ul>`;
  }
  return undefined;
};

lookup = {
  'attestations.id': {
    message: (before, after) => {
      if (before.status === after.status) {
        return `Attestations re-submitted for Attestation Period ending on ${after.attestationPeriod.periodEnd}`;
      }
      return undefined;
    },
  },
  'attestations.status': { message: (before, after) => `Attestations submitted for Attestation Period ending on ${after.attestationPeriod.periodEnd}` },
  'attestations.statusText': { message: () => undefined },
  'root.acbName': { message: (before, after) => comparePrimitive(before, after, 'acbName', 'ONC-ACB') },
  'root.address': { message: () => 'Address changes:' },
  'root.address.addressId': { message: () => undefined },
  'root.address.city': { message: (before, after) => comparePrimitive(before, after, 'city', 'City') },
  'root.address.country': { message: (before, after) => comparePrimitive(before, after, 'country', 'Country') },
  'root.address.creationDate': { message: () => undefined },
  'root.address.deleted': { message: () => undefined },
  'root.address.id': { message: () => undefined },
  'root.address.lastModifiedDate': { message: () => undefined },
  'root.address.lastModifiedUser': { message: () => undefined },
  'root.address.line1': { message: (before, after) => comparePrimitive(before, after, 'line1', 'Street Line 1') },
  'root.address.line2': { message: (before, after) => comparePrimitive(before, after, 'line2', 'Street Line 2') },
  'root.address.state': { message: (before, after) => comparePrimitive(before, after, 'state', 'State') },
  'root.address.streetLineOne': { message: (before, after) => comparePrimitive(before, after, 'streetLineOne', 'Street Line 1') },
  'root.address.streetLineTwo': { message: (before, after) => comparePrimitive(before, after, 'streetLineTwo', 'Street Line 2') },
  'root.address.zipcode': { message: (before, after) => comparePrimitive(before, after, 'zipcode', 'Zipcode') },
  'root.attestations': { message: compareAttestationData },
  'root.contact': { message: () => 'Contact changes:' },
  'root.contact.contactId': { message: () => undefined },
  'root.contact.email': { message: (before, after) => comparePrimitive(before, after, 'email', 'Email') },
  'root.contact.firstName': { message: (before, after) => comparePrimitive(before, after, 'firstName', 'First Name') },
  'root.contact.friendlyName': { message: (before, after) => comparePrimitive(before, after, 'friendlyName', 'Friendly Name') },
  'root.contact.fullName': { message: (before, after) => comparePrimitive(before, after, 'fullName', 'Full Name') },
  'root.contact.id': { message: () => undefined },
  'root.contact.lastName': { message: (before, after) => comparePrimitive(before, after, 'lastName', 'Last Name') },
  'root.contact.phoneNumber': { message: (before, after) => comparePrimitive(before, after, 'phoneNumber', 'Phone Number') },
  'root.contact.title': { message: (before, after) => comparePrimitive(before, after, 'title', 'Title') },
  'root.deleted': { message: (before, after) => comparePrimitive(before, after, 'deleted', 'Deleted') },
  'root.developerCode': { message: (before, after) => comparePrimitive(before, after, 'developerCode', 'Developer Code') },
  'root.id': { message: () => undefined },
  'root.lastModifiedDate': { message: () => undefined },
  'root.lastModifiedUser': { message: () => undefined },
  'root.name': { message: (before, after) => comparePrimitive(before, after, 'name', 'Name') },
  'root.selfDeveloper': { message: (before, after) => comparePrimitive(before, after, 'selfDeveloper', 'Self-developer') },
  'root.status': { message: () => 'Current status changes:' },
  'root.status.id': { message: () => undefined },
  'root.status.name': { message: (before, after) => comparePrimitive(before, after, 'name', 'Name') },
  'root.status.status': {
    message: (before, after) => {
      if (typeof before.status === 'string') {
        return comparePrimitive(before, after, 'status', 'Status');
      }
      return 'Current status:';
    },
  },
  'root.status.status.id': { message: () => undefined },
  'root.status.status.statusName': { message: (before, after) => comparePrimitive(before, after, 'statusName', 'Status') },
  'root.status.statusDate': { message: (before, after) => comparePrimitive(before, after, 'statusDate', 'Effective Date', getDisplayDateFormat) },
  'root.status.reason': { message: (before, after) => comparePrimitive(before, after, 'reason', 'Reason') },
  'root.statusEvents': { message: (before, after) => compare(before, after, 'statusEvents', 'Status Events') },
  'root.statuses': { message: (before, after) => compare(before, after, 'statuses', 'Statuses') },
  'root.transparencyAttestation': { message: (before, after) => comparePrimitive(before, after, 'transparencyAttestation', 'Transparency Attestation') },
  'root.transparencyAttestation.removed': { message: () => undefined },
  'root.transparencyAttestation.transparencyAttestation': { message: (before, after) => comparePrimitive(before, after, 'transparencyAttestation', 'Transparency Attestation') },
  'root.transparencyAttestationMappings': { message: compareTransparencyAttestations },
  'root.website': { message: (before, after) => comparePrimitive(before, after, 'website', 'Website') },
  'statusEvents.id': { message: () => undefined },
  'statusEvents.reason': { message: (before, after) => comparePrimitive(before, after, 'reason', 'Reason') },
  'statusEvents.status': { message: () => 'Status' },
  'statusEvents.status.id': { message: () => undefined },
  'statusEvents.status.name': { message: (before, after) => comparePrimitive(before, after, 'name', 'Name') },
  'statusEvents.status.statusName': { message: (before, after) => comparePrimitive(before, after, 'statusName', 'Name') },
  'statusEvents.statusDate': { message: (before, after) => comparePrimitive(before, after, 'statusDate', 'Date', getDisplayDateFormat) },
  'statuses.endDate': { message: (before, after) => comparePrimitive(before, after, 'endDate', 'End Date', getDisplayDateFormat) },
  'statuses.id': { message: () => undefined },
  'statuses.reason': { message: (before, after) => comparePrimitive(before, after, 'reason', 'Reason') },
  'statuses.status': { message: () => 'Status' },
  'statuses.status.id': { message: () => undefined },
  'statuses.status.name': { message: (before, after) => comparePrimitive(before, after, 'name', 'Name') },
};

const compareDeveloper = (prev, curr) => compareObject(prev, curr, lookup);

export { compareDeveloper }; // eslint-disable-line import/prefer-default-export
