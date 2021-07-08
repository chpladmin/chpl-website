/* eslint-disable import/no-extraneous-dependencies */
import { number, shape, string } from 'prop-types';

const surveillanceNonconformityDocument = shape({
  id: number,
  fileName: string,
  fileType: string,
});

export default surveillanceNonconformityDocument;
