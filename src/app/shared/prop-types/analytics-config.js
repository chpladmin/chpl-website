/* eslint-disable import/no-extraneous-dependencies */
import { shape, string } from 'prop-types';

const analyticsConfig = shape({
  category: string,
  event: string,
  label: string,
  aggregationName: string,
  group: string,
});

export default analyticsConfig;
