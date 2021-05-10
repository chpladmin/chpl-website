/* eslint-disable import/no-extraneous-dependencies */
import { number, shape, string } from 'prop-types';
import practiceType from './practice-type';

const testFunctionality = shape({
  description: string,
  id: number,
  name: string,
  practiceType,
  year: string,
});

const selectedTestFunctionality = shape({
  description: string,
  id: number,
  name: string,
  testFunctionalityId: number,
  year: string,
});

export { testFunctionality, selectedTestFunctionality };
