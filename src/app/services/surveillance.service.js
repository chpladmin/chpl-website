import { sortCriteria } from './criteria.service';

const sortRequirementDetailTypes = (a, b) => {
  if (a.surveillanceRequirementType.name !== b.surveillanceRequirementType.name) {
    return a.surveillanceRequirementType.name < b.surveillanceRequirementType.name ? -1 : 1;
  }
  if (a.surveillanceRequirementType.name === 'Certified Capability') {
    return sortCriteria(a, b);
  }
  return a.title < b.title ? -1 : 1;
};

const sortRequirements = (a, b) => {
  if (a.requirementDetailOther && b.requirementDetailOther) {
    return a.requirementDetailOther < b.requirementDetailOther ? -1 : 1;
  }
  if (a.requirementDetailOther || b.requirementDetailOther) {
    return a.requirementDetailOther ? 1 : -1;
  }
  return sortRequirementDetailTypes(a.requirementDetailType, b.requirementDetailType);
};

const sortSurveillances = (a, b) => (a.friendlyId < b.friendlyId ? -1 : 1);

const getRequirementDisplay = (req) => {
  if (req.requirementDetailOther) {
    return req.requirementDetailOther;
  }
  return `${req.requirementDetailType.removed ? 'Removed | ' : ''}${req.requirementDetailType.number ? (`${req.requirementDetailType.number}: `) : ''}${req.requirementDetailType.title}`;
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
  sortRequirementDetailTypes,
  sortRequirements,
  sortSurveillances,
};
