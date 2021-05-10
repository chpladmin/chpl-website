import {
  number, shape, string,
} from 'prop-types';
import criterion from './criterion';

const testData = shape({
  criteria: criterion,
  description: string,
  id: number,
  name: string,
  title: string,
});

const selectedTestData = shape({
  alteration: string,
  id: number,
  testData: shape({
    id: number,
    name: string,
  }),
  version: string,
});

export { testData, selectedTestData };
