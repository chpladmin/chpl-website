/* eslint-disable import/no-extraneous-dependencies */
import { number, shape, string } from 'prop-types';

const testStandard = shape({
  id: number,
  description: string,
  name: string,
  year: string,
});

const selectedTestStandard = shape({
  id: number,
  testStandardDescription: string,
  testStandardId: number,
  testStandardName: string,
});

export { testStandard, selectedTestStandard };
