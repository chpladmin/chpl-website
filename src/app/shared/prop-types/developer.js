/* eslint-disable import/no-extraneous-dependencies */
import {
  bool, number, oneOfType, shape, string,
} from 'prop-types';
import address from './address';
import contact from './contact';

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
