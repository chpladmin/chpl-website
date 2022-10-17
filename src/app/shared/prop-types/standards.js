/* eslint-disable import/no-extraneous-dependencies */
import {
  arrayOf,
  bool,
  number,
  shape,
  string,
} from 'prop-types';

import criterion from './criterion';

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
  svap,
  selectedSvap,
  ucdProcess,
  ucdProcessType,
};
