import { compareBoolean, compareObject, comparePrimitive } from 'pages/reports/reports.v2.service';
import { getDisplayDateFormat } from 'services/date-util';

/*
 * Attestation forms
 *
 * An attestation change request's details.form is a list of sections, each
 * holding form items (questions). A form item's submittedResponses are the
 * answers the developer picked, and its childFormItems are follow-up questions
 * asked for a particular parent answer (e.g. CAP status after "Noncompliant").
 * Before and after always have the same shape; only the answers change.
 */

// pair up items from both sides by id, keeping the order of `after`
const pairById = (before = [], after = []) => {
  const ids = [...new Set([...after.map((i) => i.id), ...before.map((i) => i.id)])];
  return ids.map((id) => [before.find((i) => i.id === id), after.find((i) => i.id === id)]);
};

const compareSubmittedResponses = (before = [], after = [], title) => {
  const removed = before.filter((b) => !after.some((a) => a.id === b.id));
  const added = after.filter((a) => !before.some((b) => b.id === a.id));
  if (removed.length === 0 && added.length === 0) { return []; }
  // a single answer replaced by another reads better as one change
  if (before.length <= 1 && after.length <= 1) {
    return [comparePrimitive(before[0], after[0], 'response', title)];
  }
  return [
    ...added.map((r) => `${title} added: ${r.response}`),
    ...removed.map((r) => `${title} removed: ${r.response}`),
  ];
};

const compareFormItems = (before, after) => pairById(before, after)
  .flatMap(([b, a]) => {
    const parent = (b ?? a).parentResponse;
    const title = parent ? `Follow-up response for "${parent.response}"` : 'Response';
    return [
      ...compareSubmittedResponses(b?.submittedResponses, a?.submittedResponses, title),
      ...compareFormItems(b?.childFormItems, a?.childFormItems),
    ];
  });

const compareSectionHeadings = (before, after) => {
  const sections = pairById(before, after)
    .sort(([, a], [, b]) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0))
    .map(([b, a]) => {
      const changes = compareFormItems(b?.formItems, a?.formItems);
      return changes.length > 0
        ? `<li>${(a ?? b).name} changes<ul>${changes.map((change) => `<li>${change}</li>`).join('')}</ul></li>`
        : '';
    })
    .filter((section) => !!section);
  return sections.length > 0 ? `Attestations changes<ul>${sections.join('')}</ul>` : undefined;
};

const lookup = {
  shortCircuit: [
    'root.currentStatus.certificationBody',
    'root.developer',
    'root.details.listing.developer',
    'root.details.listing.product',
    'root.details.listing.sed',
  ],
  'root.certificationBodies': { message: () => undefined },
  'root.currentStatus': { message: () => 'Current Status' },
  'root.currentStatus.actingUser': { message: () => undefined },
  'root.currentStatus.changeRequestStatusType': { message: () => 'Status' },
  'root.currentStatus.changeRequestStatusType.actingUser': { message: () => undefined },
  'root.currentStatus.changeRequestStatusType.id': { message: () => undefined },
  'root.currentStatus.changeRequestStatusType.name': { message: (before, after) => comparePrimitive(before, after, 'name', 'Status') },
  'root.currentStatus.changeRequestStatusType.userGroupName': { message: () => undefined },
  'root.currentStatus.comment': { message: (before, after) => comparePrimitive(before, after, 'comment', 'Comment') },
  'root.currentStatus.id': { message: () => undefined },
  'root.currentStatus.statusChangeDateTime': { message: () => undefined },
  'root.currentStatus.userGroupName': { message: () => undefined },
  'root.details': { message: () => 'Details' },
  'root.details.address': { message: () => 'Address' },
  'root.details.address.city': { message: (before, after) => comparePrimitive(before, after, 'city', 'City') },
  'root.details.address.country': { message: (before, after) => comparePrimitive(before, after, 'country', 'Country') },
  'root.details.address.line1': { message: (before, after) => comparePrimitive(before, after, 'line1', 'Street Line 1') },
  'root.details.address.line2': { message: (before, after) => comparePrimitive(before, after, 'line2', 'Street Line 2') },
  'root.details.address.state': { message: (before, after) => comparePrimitive(before, after, 'state', 'State') },
  'root.details.address.zipcode': { message: (before, after) => comparePrimitive(before, after, 'zipcode', 'Zipcode') },
  'root.details.contact': { message: () => 'Contact' },
  'root.details.contact.email': { message: (before, after) => comparePrimitive(before, after, 'email', 'Email') },
  'root.details.contact.fullName': { message: (before, after) => comparePrimitive(before, after, 'fullName', 'Full Name') },
  'root.details.contact.phoneNumber': { message: (before, after) => comparePrimitive(before, after, 'phoneNumber', 'Phone Number') },
  'root.details.form': { message: () => 'Attestations Submission' },
  'root.details.form.description': { message: () => undefined },
  'root.details.form.id': { message: () => undefined },
  'root.details.form.instructions': { message: () => undefined },
  'root.details.form.sectionHeadings': { message: compareSectionHeadings },
  'root.details.listing': { message: () => 'Listing' },
  'root.details.listing.accessibilityStandards': { message: () => undefined },
  'root.details.listing.businessErrorMessages': { message: () => undefined },
  'root.details.listing.certificationEvents': { message: () => undefined },
  'root.details.listing.certificationResults': { message: () => undefined },
  'root.details.listing.chplProductNumberHistory': { message: () => undefined },
  'root.details.listing.cqmResults': { message: () => undefined },
  'root.details.listing.dataErrorMessages': { message: () => undefined },
  'root.details.listing.directReviews': { message: () => undefined },
  'root.details.listing.errorMessages': { message: () => undefined },
  'root.details.listing.ics.children': { message: () => undefined },
  'root.details.listing.ics.parents': { message: () => undefined },
  'root.details.listing.measures': { message: () => undefined },
  'root.details.listing.promotingInteroperabilityUserHistory': { message: () => undefined },
  'root.details.listing.qmsStandards': { message: () => undefined },
  'root.details.listing.rwtPlansCheckDate': { message: (before, after) => comparePrimitive(before, after, 'rwtPlansCheckDate', 'RWT Plans Check Date', getDisplayDateFormat) }, // maybe not necessary? Check on this after a PROD DB pull
  'root.details.listing.rwtPlansUrl': { message: (before, after) => comparePrimitive(before, after, 'rwtPlansUrl', 'RWT Plans URL') },
  'root.details.listing.rwtResultsCheckDate': { message: (before, after) => comparePrimitive(before, after, 'rwtResultsCheckDate', 'RWT Results Check Date', getDisplayDateFormat) }, // maybe not necessary? Check on this after a PROD DB pull
  'root.details.listing.rwtResultsUrl': { message: (before, after) => comparePrimitive(before, after, 'rwtResultsUrl', 'RWT Results URL') },
  'root.details.listing.surveillance': { message: () => undefined },
  'root.details.listing.targetedUsers': { message: () => undefined },
  'root.details.listing.testingLabs': { message: () => undefined },
  'root.details.listing.warningMessages': { message: () => undefined },
  'root.details.selfDeveloper': { message: (before, after) => compareBoolean(before, after, 'selfDeveloper', 'Self-developer') },
  'root.details.signature': { message: (before, after) => comparePrimitive(before, after, 'signature', 'Signature') },
  'root.details.signatureEmail': { message: (before, after) => comparePrimitive(before, after, 'signatureEmail', 'Signer\'s Email') },
  'root.details.url': { message: (before, after) => comparePrimitive(before, after, 'url', 'URL') },
  'root.details.website': { message: (before, after) => comparePrimitive(before, after, 'website', 'Website') },
  'root.statuses': { message: () => undefined },
};

const compareChangeRequest = (prev, curr) => compareObject(prev, curr, lookup);

export default compareChangeRequest;
