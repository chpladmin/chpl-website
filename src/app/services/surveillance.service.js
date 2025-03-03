import { getDisplayDateFormat } from './date-util';
import { sortCriteria } from './criteria.service';

const typeOrder = [
  '170.523 (k)(1)',
  '170.523 (k)(2)',
  '170.523 (l)',
  '170.523 (m)(1): Adaptations and updates',
  '170.523 (m)(2): Adaptations and updates',
  '170.523 (m)(3): Adaptations and updates',
  '170.523 (m)(4): Adaptations and updates',
  '170.523 (m)(5): Adaptations and updates',
  '170.523 (t): Health IT Module voluntary standards and implementation specifications updates notices',
  'Annual Real World Testing Plan',
  'Annual Real World Testing Results Reports',
  'Inherited Certified Status',
  'Semiannual Attestations Submission',
  'Other Non-Conformity',
];

const getRequirementDisplay = (req) => {
  if (req.requirementTypeOther) {
    return req.requirementTypeOther;
  }
  return `${req.requirementType?.removed ? 'Removed | ' : ''}${req.requirementType?.number ? (`${req.requirementType?.number}: `) : ''}${req.requirementType?.title}`;
};

const getSurveillanceTitle = (surv) => {
  let title = surv.endDay
    ? `Closed Surveillance, Ended ${getDisplayDateFormat(surv.endDay)}: `
    : `Open Surveillance, Began ${getDisplayDateFormat(surv.startDay)}: `;
  const open = surv.requirements.reduce((rCnt, r) => rCnt + r.nonconformities?.filter((nc) => nc.nonconformityStatus === 'Open').length, 0);
  const closed = surv.requirements.reduce((rCnt, r) => rCnt + r.nonconformities?.filter((nc) => nc.nonconformityStatus === 'Closed').length, 0);
  if (open && closed) {
    title += `${open} Open and ${closed} Closed Non-Conformities Were Found`;
  } else if (open) {
    if (open === 1) {
      title += '1 Open Non-Conformity Was Found';
    } else {
      title += `${open} Open Non-Conformities Were Found`;
    }
  } else if (closed) {
    if (closed === 1) {
      title += '1 Closed Non-Conformity Was Found';
    } else {
      title += `${closed} Closed Non-Conformities Were Found`;
    }
  } else {
    title += 'No Non-Conformities Were Found';
  }
  return title;
};

const sortRequirementTypes = (a, b) => {
  if (a.requirementGroupType.name === 'Certified Capability' || a.requirementGroupType.name === 'Inherited Certified Status') {
    return sortCriteria(a, b);
  }
  return typeOrder.indexOf(a.title) - typeOrder.indexOf(b.title);
};

const sortRequirements = (a, b) => {
  if (a.requirementTypeOther && b.requirementTypeOther) {
    return a.requirementTypeOther < b.requirementTypeOther ? -1 : 1;
  }
  if (a.requirementTypeOther || b.requirementTypeOther) {
    return a.requirementTypeOther ? 1 : -1;
  }
  return sortRequirementTypes(a.requirementType, b.requirementType);
};

const interpretRequirements = (reqs) => reqs
  .sort(sortRequirements)
  .map((req) => ({
    ...req,
    display: getRequirementDisplay(req),
  }));

const sortNonconformityTypes = (a, b) => {
  if (a.number && b.number) {
    return sortCriteria(a, b);
  }
  if (a.number || b.number) {
    return a.number ? -1 : 1;
  }
  return typeOrder.indexOf(a.title) - typeOrder.indexOf(b.title);
};

const sortSurveillances = (a, b) => (a.friendlyId < b.friendlyId ? -1 : 1);

export {
  getRequirementDisplay,
  getSurveillanceTitle,
  interpretRequirements,
  sortNonconformityTypes,
  sortRequirementTypes,
  sortRequirements,
  sortSurveillances,
};
