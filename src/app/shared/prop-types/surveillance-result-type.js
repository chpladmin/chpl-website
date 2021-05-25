/* eslint-disable import/no-extraneous-dependencies */
import { number, shape, string } from 'prop-types';

const surveillanceResultType = shape({
  id: number,
  name: string,
});

export default surveillanceResultType;
