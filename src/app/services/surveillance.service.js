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

const sortNonconformityTypes = (a, b) => {
  if (a.number && b.number) {
    return sortCriteria(a, b);
  }
  if (a.number || b.number) {
    return a.number ? -1 : 1;
  }
  return typeOrder.indexOf(a.title) - typeOrder.indexOf(b.title);
};

const sortRequirementTypes = (a, b) => {
  if (a.requirementGroupType.name === 'Certified Capability') {
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

const sortSurveillances = (a, b) => (a.friendlyId < b.friendlyId ? -1 : 1);

const getRequirementDisplay = (req) => {
  if (req.requirementTypeOther) {
    return req.requirementTypeOther;
  }
  return `${req.requirementType.removed ? 'Removed | ' : ''}${req.requirementType.number ? (`${req.requirementType.number}: `) : ''}${req.requirementType.title}`;
};

const interpretRequirements = (reqs) => reqs
  .sort(sortRequirements)
  .map((req) => ({
    ...req,
    display: getRequirementDisplay(req),
  }));

export {
  getRequirementDisplay,
  interpretRequirements,
  sortNonconformityTypes,
  sortRequirementTypes,
  sortRequirements,
  sortSurveillances,
};
