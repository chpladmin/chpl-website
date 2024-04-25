/* eslint-disable import/no-extraneous-dependencies */
import { number, shape, string } from 'prop-types';

const optionalStandard = shape({
  id: number,
  citation: string,
  displayValue: string,
  description: string,
});

const selectedOptionalStandard = shape({
  id: number,
  optionalStandard,
});

export { optionalStandard, selectedOptionalStandard };
