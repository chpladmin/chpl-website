/* eslint-disable import/no-extraneous-dependencies */
import {
  arrayOf, number, shape, string,
} from 'prop-types';

import surveillanceRequirement from './surveillance-requirement';
import surveillanceType from './surveillance-type';

const surveillance = shape({
  id: number,
  startDate: number,
  endDate: number,
  friendlyId: string,
  randomizedSitesUsed: number,
  requirements: arrayOf(surveillanceRequirement),
  type: surveillanceType,
});

export default surveillance;
