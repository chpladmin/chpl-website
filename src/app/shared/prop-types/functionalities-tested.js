/* eslint-disable import/no-extraneous-dependencies */
import {
  arrayOf, number, shape, string,
} from 'prop-types';

import criterion from './criterion';
import practiceType from './practice-type';

const functionalitiesTested = shape({
  criteria: arrayOf(criterion),
  description: string,
  id: number,
  name: string,
  practiceType,
});

export default functionalitiesTested;
