/* eslint-disable import/no-extraneous-dependencies */
import { number, shape, string } from 'prop-types';

const optionalStandard = shape({
  id: number,
  description: string,
  name: string,
  year: string,
});

const selectedOptionalStandard = shape({
  id: number,
  testStandardDescription: string,
  testStandardId: number,
  testStandardName: string,
});

export { optionalStandard, selectedOptionalStandard };
