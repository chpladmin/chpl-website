/* eslint-disable import/no-extraneous-dependencies */
import {
  bool, number, shape, string,
} from 'prop-types';
import { address } from '.';

const acb = shape({
  acbCode: string,
  address,
  id: number,
  name: string,
  retired: bool,
  retirementDate: number,
  website: string,
});

export default acb;
