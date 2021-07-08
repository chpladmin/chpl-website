/* eslint-disable import/no-extraneous-dependencies */
import { number, shape, string } from 'prop-types';

const surveillanceNonconformityStatus = shape({
  id: number,
  name: string,
});

export default surveillanceNonconformityStatus;
