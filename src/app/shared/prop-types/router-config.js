/* eslint-disable import/no-extraneous-dependencies */
import { object, shape, string } from 'prop-types';

const routerConfig = shape({
  sref: string,
  params: object, // eslint-disable-line react/forbid-prop-types
});

export default routerConfig;
