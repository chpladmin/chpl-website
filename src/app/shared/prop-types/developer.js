import { bool, number, shape, string } from 'prop-types';
import { address, contact } from './';

const developer = shape({
  address: address,
  contact: contact,
  developerCode: string,
  developerId: number,
  name: string,
  selfDeveloper: bool,
  website: string,
});

export { developer };
