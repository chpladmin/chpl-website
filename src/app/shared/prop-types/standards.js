/* eslint-disable import/no-extraneous-dependencies */
import {
  arrayOf,
  number,
  shape,
  string,
} from 'prop-types';

import criterion from './criterion';

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
  ucdProcess,
  ucdProcessType,
};
