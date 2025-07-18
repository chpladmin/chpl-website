import { compareArrays, compareObject, comparePrimitive } from 'pages/reports/reports.v2.service';
import { sortCriteria } from 'services/criteria.service';
import { getDisplayDateFormat } from 'services/date-util';

let lookup;

/* eslint-disable no-nested-ternary */
const compare = (before, after, key, title = 'unknown') => {
  let options;
  switch (key) {
    case 'criteria':
      options = {
        sort: (p, c) => sortCriteria(p.certificationCriterion, c.certificationCriterion),
        write: (f) => `Criterion "${f.certificationCriterion.number}"`,
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
    'root.currentStatus.certificationBody',
    'root.developer',
    'root.details.form',
    'root.details.listing.developer',
    'root.details.listing.product',
    'root.details.listing.sed',
  ],
  'root.certificationBodies': { message: () => undefined },
  'root.currentStatus': { message: () => 'Current Status' },
  'root.currentStatus.id': { message: () => undefined },
  'root.currentStatus.changeRequestStatusType': { message: () => 'Status' },
  'root.currentStatus.changeRequestStatusType.id': { message: () => undefined },
  'root.currentStatus.changeRequestStatusType.name': { message: (before, after) => comparePrimitive(before, after, 'name', 'Status') },
  'root.currentStatus.comment': { message: (before, after) => comparePrimitive(before, after, 'comment', 'Comment') },
  'root.currentStatus.statusChangeDateTime': { message: () => undefined },
  'root.currentStatus.changeRequestStatusType.userGroupName': { message: () => undefined },
  'root.currentStatus.changeRequestStatusType.actingUser': { message: () => undefined },
  'root.currentStatus.actingUser': { message: () => undefined },
  'root.currentStatus.userGroupName': { message: () => undefined },
  'root.statuses': { message: () => undefined },
  'root.details': { message: () => 'Details' },
  'root.details.listing': { message: () => 'Listing' },
  'root.details.listing.': { message: () => undefined },
  'root.details.listing.testingLabs': { message: () => undefined },
  'root.details.listing.ics.parents': { message: () => undefined },
  'root.details.listing.ics.children': { message: () => undefined },
  'root.details.listing.surveillance': { message: () => undefined },
  'root.details.listing.directReviews': { message: () => undefined },
  'root.details.listing.chplProductNumberHistory': { message: () => undefined },
  'root.details.listing.accessibilityStandards': { message: () => undefined },
  'root.details.listing.targetedUsers': { message: () => undefined },
  'root.details.listing.qmsStandards': { message: () => undefined },
  'root.details.listing.measures': { message: () => undefined },
  //'root.details.listing.certificationResults': { message: () => undefined },
  'root.details.listing.cqmResults': { message: () => undefined },
  'root.details.listing.certificationEvents': { message: () => undefined },
  'root.details.listing.promotingInteroperabilityUserHistory': { message: () => undefined },
  'root.details.listing.businessErrorMessages': { message: () => undefined },
  'root.details.listing.warningMessages': { message: () => undefined },
  'root.details.listing.errorMessages': { message: () => undefined },
  'root.details.listing.dataErrorMessages': { message: () => undefined },
  'root.details.listing.rwtPlansUrl': { message: (before, after) => comparePrimitive(before, after, 'rwtPlansUrl', 'RWT Plans URL') },
  'root.details.listing.rwtPlansCheckDate': { message: (before, after) => comparePrimitive(before, after, 'rwtPlansCheckDate', 'RWT Plans Check Date', getDisplayDateFormat) }, // maybe not necessary? Check on this after a PROD DB pull
  'root.details.listing.rwtResultsUrl': { message: (before, after) => comparePrimitive(before, after, 'rwtResultsUrl', 'RWT Results URL') },
  'root.details.listing.rwtResultsCheckDate': { message: (before, after) => comparePrimitive(before, after, 'rwtResultsCheckDate', 'RWT Results Check Date', getDisplayDateFormat) }, // maybe not necessary? Check on this after a PROD DB pull
  'root.details.signature': { message: (before, after) => comparePrimitive(before, after, 'signature', 'Signature') },
  'root.details.signatureEmail': { message: (before, after) => comparePrimitive(before, after, 'signatureEmail', 'Signer\'s Email') },



  'root.complaintTypes': { message: (before, after) => compare(before, after, 'complaintTypes', 'Complaint Type(s)') },
};

const compareChangeRequest = (prev, curr) => compareObject(prev, curr, lookup);

export default compareChangeRequest;
