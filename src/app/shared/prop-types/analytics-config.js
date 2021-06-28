/* eslint-disable import/no-extraneous-dependencies */
import { shape, string } from 'prop-types';

const analyticsConfig = shape({
  category: string,
  event: string,
  label: string,
});

export default analyticsConfig;
