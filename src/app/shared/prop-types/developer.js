/* eslint-disable import/no-extraneous-dependencies */
import {
  bool, number, oneOfType, shape, string,
} from 'prop-types';
import { address, contact } from '.';

const developer = shape({
  address,
  contact,
  developerCode: string,
  developerId: oneOfType([number, string]),
  name: string,
  selfDeveloper: bool,
  website: string,
});

export default developer;
