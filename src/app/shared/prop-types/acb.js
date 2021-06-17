import {
  bool, number, shape, string,
} from 'prop-types';
import { address } from './address';

const acb = shape({
  acbCode: string,
  address,
  id: number,
  name: string,
  retired: bool,
  retirementDate: number,
  website: string,
});

export { acb };
