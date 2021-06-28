/* eslint-disable import/no-extraneous-dependencies */
import { number, shape, string } from 'prop-types';

const practiceType = shape({
  description: string,
  id: number,
  name: string,
});

export default practiceType;
