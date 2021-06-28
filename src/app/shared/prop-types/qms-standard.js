/* eslint-disable import/no-extraneous-dependencies */
import { number, shape, string } from 'prop-types';

const qmsStandard = shape({
  applicableCriteria: string,
  id: number,
  qmsModification: string,
  qmsStandardId: number,
  qmsStandardName: string,
});

export default qmsStandard;
