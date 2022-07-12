/* eslint-disable import/no-extraneous-dependencies */
import {
  arrayOf, number, shape, string,
} from 'prop-types';

import criterion from './criterion';
import surveillanceRequirementType from './surveillance-requirement-type';
import surveillanceResultType from './surveillance-result-type';
import surveillanceNonconformity from './surveillance-nonconformity';

const surveillanceRequirement = shape({
  id: number,
  criterion,
  requirement: string,
  nonconformities: arrayOf(surveillanceNonconformity),
  result: surveillanceResultType,
  type: surveillanceRequirementType,
});

export default surveillanceRequirement;
