/* eslint-disable import/no-extraneous-dependencies */
import {
  arrayOf, number, shape, string,
} from 'prop-types';
import criterion from './criterion';
import surveillanceNonconformityStatus from './surveillance-nonconformity-status';
import surveillanceNonconformityDocument from './surveillance-nonconformity-document';

const surveillanceNonconformity = shape({
  id: number,
  capApprovalDate: number,
  capEndDate: number,
  capMustCompleteDate: number,
  capStartDate: number,
  criterion,
  dateOfDetermination: number,
  developerExplanation: string,
  documents: arrayOf(surveillanceNonconformityDocument),
  findings: string,
  nonconformityType: string,
  nonconformityTypeName: string,
  resolution: string,
  sitesPassed: number,
  status: surveillanceNonconformityStatus,
  summary: string,
  totalSites: number,
});

export default surveillanceNonconformity;
