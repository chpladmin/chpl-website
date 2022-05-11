import {
  arrayOf, number, oneOfType, shape, string,
} from 'prop-types';

import contact from './contact';
import developer from './developer';

const product = shape({
  contact,
  id: oneOfType([number, string]),
  lastModifiedDate: oneOfType([number, string]),
  name: string,
  owner: developer,
  ownerHistory: arrayOf(developer),
  reportFileLocation: string,
});

export default product;
