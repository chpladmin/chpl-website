/* eslint-disable import/no-extraneous-dependencies */
import {
  arrayOf, number, shape, string,
} from 'prop-types';

import criterion from './criterion';

const conformanceMethod = shape({
  id: number,
  name: string,
  removalDate: string,
  criteria: arrayOf(criterion),
});

const selectedConformanceMethod = shape({
  conformanceMethod,
  conformanceMethodVersion: string,
  id: number,
});

export { conformanceMethod, selectedConformanceMethod };
