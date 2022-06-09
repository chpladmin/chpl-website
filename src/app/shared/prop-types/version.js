import {
  number, oneOfType, shape, string,
} from 'prop-types';

const version = shape({
  id: oneOfType([number, string]),
  lastModifiedDate: oneOfType([number, string]),
  version: string,
});

export default version;
