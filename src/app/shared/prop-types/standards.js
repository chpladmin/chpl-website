/* eslint-disable import/no-extraneous-dependencies */
import {
  arrayOf,
  bool,
  number,
  shape,
  string,
} from 'prop-types';

import criterion from './criterion';

const accessibilityStandard = shape({
  accessibilityStandardId: number,
  accessibilityStandardName: string,
  id: number,
});

const accessibilityStandardType = shape({
  id: number,
  name: string,
});

const qmsStandard = shape({
  applicableCriteria: string,
  id: number,
  qmsModification: string,
  qmsStandardId: number,
  qmsStandardName: string,
});

const qmsStandardType = shape({
  id: number,
  name: string,
});

const svap = shape({
  approvedStandardVersion: string,
  criteria: arrayOf(criterion),
  regulatoryTextCitation: string,
  replaced: bool,
  svapId: number,
});

const selectedSvap = shape({
  approvedStandardVersion: string,
  id: number,
  regulatoryTextCitation: string,
  replaced: bool,
  svapId: number,
});

const ucdProcessType = shape({
  id: number,
  name: string,
});

const ucdProcess = shape({
  ...ucdProcessType,
  details: string,
  criteria: arrayOf(criterion),
});

export {
  accessibilityStandard,
  accessibilityStandardType,
  qmsStandard,
  qmsStandardType,
  svap,
  selectedSvap,
  ucdProcess,
  ucdProcessType,
};
