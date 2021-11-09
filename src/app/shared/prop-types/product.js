import {
  arrayOf, number, oneOfType, shape, string,
} from 'prop-types';

import contact from './contact';
import developer from './developer';

const product = shape({
  contact,
  lastModifiedDate: oneOfType([number, string]),
  name: string,
  owner: developer,
  ownerHistory: arrayOf(developer),
  productId: oneOfType([number, string]),
  reportFileLocation: string,
});

export default product;
