import { compareArrays, compareObject, comparePrimitive } from 'pages/reports/reports.v2.service';
import { sortCriteria } from 'services/criteria.service';
import { getDisplayDateFormat } from 'services/date-util';

let rules;

/* eslint-disable no-nested-ternary */
const compare = (before, after, key, title = 'unknown') => {
  let options;
  switch (key) {
      /*
    case 'criteria':
      options = {
        sort: (p, c) => sortCriteria(p.certificationCriterion, c.certificationCriterion),
        write: (f) => `Criterion "${f.certificationCriterion.number}"`,
      };
      break;
      */
    case 'complaintTypes':
      options = {
        sort: (p, c) => (p.name < c.name ? -1 : p.name > c.name ? 1 : 0),
        write: (f) => `Type "${f.name}"`,
      };
      break;
      /*
    case 'listings':
      options = {
        sort: (p, c) => (p.chplProductNumber < c.chplProductNumber ? -1 : p.chplProductNumber > c.chplProductNumber ? 1 : 0),
        write: (f) => `Listing "${f.chplProductNumber}"`,
      };
      break;
      */
      /*
    case 'surveillances':
      options = {
        sort: (p, c) => (p.surveillanceId < c.surveillanceId ? -1 : p.surveillanceId > c.surveillanceId ? 1 : 0),
        write: (f) => `Surveillance "${f.surveillance.friendlyId}"`,
      };
      break;
      */
    default:
      if (after.length > 0) {
        console.debug({ before, after, key });
      }
      return undefined;
  }
  const changes = compareArrays(before, after, { ...options, root: key }, rules);
  if (changes && changes.length > 0) {
    return `${title} changes<ul>${changes.join('')}</ul>`;
  }
  return undefined;
};

const lookup = {
  shortCircuit: [
  ],
  'root.acbComplaintId': { message: (before, after) => comparePrimitive(before, after, 'acbComplaintId', 'ONC-ACB Complaint ID') },
  'root.actions': { message: (before, after) => comparePrimitive(before, after, 'actions', 'Actions') },
  'root.closedDate': { message: (before, after) => comparePrimitive(before, after, 'closedDate', 'Closed Date', getDisplayDateFormat) },
  'root.complainantContacted': { message: (before, after) => comparePrimitive(before, after, 'complainantContacted', 'Complainant Contacted') },
  'root.complainantType': { message: () => 'Complainant Type' },
  'root.complainantType.id': { message: () => undefined },
  'root.complainantType.name': { message: (before, after) => comparePrimitive(before, after, 'name', 'Name') },
  'root.complainantTypeOther': { message: (before, after) => comparePrimitive(before, after, 'complainantTypeOther', 'Complainant Type - Other') },
  'root.complaintTypes': { message: (before, after) => compare(before, after, 'complaintTypes', 'Complaint Types') },
  'root.complaintTypesOther': { message: (before, after) => comparePrimitive(before, after, 'complaintTypesOther', 'Complaint Types - Other') },
  'root.criteria': { message: (before, after) => compare(before, after, 'criteria', 'Criteria') },
  'root.developerContacted': { message: (before, after) => comparePrimitive(before, after, 'developerContacted', 'Developer Contacted') },
  'root.flagForOncReview': { message: (before, after) => comparePrimitive(before, after, 'flagForOncReview', 'Flag For ONC Review') },
  'root.lastModifiedDate': { message: () => undefined },
  'root.lastModifiedUser': { message: () => undefined },
  'root.listings': { message: (before, after) => compare(before, after, 'listings', 'Listings') },
  'root.oncAtlContacted': { message: (before, after) => comparePrimitive(before, after, 'oncAtlContacted', 'ONC-ATL Contacted') },
  'root.oncComplaintId': { message: (before, after) => comparePrimitive(before, after, 'oncComplaintId', 'ONC Complaint ID') },
  'root.receivedDate': { message: (before, after) => comparePrimitive(before, after, 'receivedDate', 'Received Date', getDisplayDateFormat) },
  'root.summary': { message: (before, after) => comparePrimitive(before, after, 'summary', 'Summary') },
  'root.surveillances': { message: (before, after) => compare(before, after, 'surveillances', 'Surveillance') },
};

const compareComplaint = (prev, curr) => {
  return compareObject(prev, curr, lookup);
};

export default compareComplaint;
