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
  if (a.requirementDetailTypeOther && b.requirementDetailTypeOther) {
    return a.requirementDetailTypeOther < b.requirementDetailTypeOther ? -1 : 1;
  }
  if (a.requirementDetailTypeOther || b.requirementDetailTypeOther) {
    return a.requirementDetailTypeOther ? 1 : -1;
  }
  return sortRequirementDetailTypes(a.requirementDetailType, b.requirementDetailType);
};

export {
  sortRequirementDetailTypes,
  sortRequirements,
};
