/* eslint-disable import/no-extraneous-dependencies */
import {
  arrayOf,
  bool,
  number,
  shape,
  string,
} from 'prop-types';

const certificationEdition = shape({
  id: number,
  retired: bool,
  name: string,
});

const surveillanceNonconformityType = shape({
  certificationEdition,
  id: number,
  number: string,
  removed: bool,
  title: string,
});

const surveillanceNonconformity = shape({
  capApprovalDay: string,
  capEndDay: string,
  capMustCompleteDay: string,
  capStartDay: string,
  dateOfDeterminationDay: string,
  developerExplanation: string,
  findings: string,
  id: number,
  lastModifiedDate: number,
  nonconformityCloseDay: string,
  nonconformityStatus: string,
  resolution: string,
  sitesPassed: number,
  summary: string,
  totalSites: number,
  type: surveillanceNonconformityType,
});

const requirementGroupType = shape({
  id: number,
  name: string,
});

const surveillanceRequirementType = shape({
  certificationEdition,
  id: number,
  number: string,
  removed: bool,
  requirementGroupType,
  title: string,
});

const surveillanceResultType = shape({
  id: number,
  name: string,
});

const certifiedProduct = shape({
  certificationDate: number,
  certificationStatus: string,
  chplProductNumber: string,
  curesUpdate: bool,
  edition: string,
  id: number,
});

const surveillanceRequirement = shape({
  id: number,
  nonconformities: arrayOf(surveillanceNonconformity),
  requirementType: surveillanceRequirementType,
  requirementTypeOther: string,
  result: surveillanceResultType,
});

const surveillanceType = shape({
  id: number,
  name: string,
});

const surveillance = shape({
  certifiedProduct,
  endDay: string,
  friendlyId: string,
  id: number,
  randomizedSitesUsed: number,
  requirements: arrayOf(surveillanceRequirement),
  startDay: string,
  type: surveillanceType,
});

export {
  surveillance,
  surveillanceNonconformity,
  surveillanceNonconformityType,
  surveillanceRequirement,
  surveillanceRequirementType,
};
