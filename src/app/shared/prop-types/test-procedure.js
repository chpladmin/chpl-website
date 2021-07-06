import {
  number, shape, string,
} from 'prop-types';
import criterion from './criterion';

const testProcedure = shape({
  criteria: criterion,
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
  testProcedureVersion: string,
});

export { testProcedure, selectedTestProcedure };
