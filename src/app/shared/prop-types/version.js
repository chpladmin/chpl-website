import {
  number, oneOfType, shape, string,
} from 'prop-types';

const version = shape({
  lastModifiedDate: oneOfType([number, string]),
  version: string,
  versionId: oneOfType([number, string]),
});

export default version;
