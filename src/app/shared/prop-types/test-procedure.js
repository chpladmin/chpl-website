import {
  number, shape, string,
} from 'prop-types';
import { criterion } from '.';

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
  version: string,
});

export { testProcedure, selectedTestProcedure };
