import { bool, number, shape, string } from 'prop-types';
import { address } from './';

const acb = shape({
  acbCode: string,
  address: address,
  id: number,
  name: string,
  retired: bool,
  retirementDate: number,
  website: string,
});

export default { acb };
