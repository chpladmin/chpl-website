import { sortCriteria } from './criteria.service';

const sortRequirementTypes = (a, b) => {
  if (a.requirementGroupType.name !== b.requirementGroupType.name) {
    return a.requirementGroupType.name < b.requirementGroupType.name ? -1 : 1;
  }
  if (a.requirementGroupType.name === 'Certified Capability') {
    return sortCriteria(a, b);
  }
  return a.title < b.title ? -1 : 1;
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
  sortRequirementTypes,
  sortRequirements,
  sortSurveillances,
};
