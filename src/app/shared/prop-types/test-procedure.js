/* eslint-disable import/no-extraneous-dependencies */
import { arrayOf, number, shape, string } from 'prop-types';
import { criterion } from '.';

const testProcedure = shape({
  criteria: arrayOf(criterion),
  description: string,
  id: number,
  name: string,
  title: string,
});

const selectedTestProcedure = shape({
  id: number,
  testProcedure: shape({
    id: number,
    name: string,
  }),
  version: string,
});

export { testProcedure, selectedTestProcedure };
