import { sortCriteria } from './criteria.service';

const sortRequirements = (a, b) => {
  if (a.requirementDetailType.surveillanceRequirementType.name !== b.requirementDetailType.surveillanceRequirementType.name) {
    return a.requirementDetailType.surveillanceRequirementType.name < b.requirementDetailType.surveillanceRequirementType.name ? -1 : 1;
  }
  if (a.requirementDetailType.surveillanceRequirementType.name === 'Certified Capability') {
    return sortCriteria(a, b);
  }
  return a.requirementDetailType.title < b.requirementDetailType.title ? -1 : 1;
};

export {
  sortRequirements,
};
