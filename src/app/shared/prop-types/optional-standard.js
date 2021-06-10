/* eslint-disable import/no-extraneous-dependencies */
import { number, shape, string } from 'prop-types';

const optionalStandard = shape({
  id: number,
  citation: string,
  description: string,
});

const selectedOptionalStandard = shape({
  id: number,
  optionalStandard: shape({
    citation: string,
    description: string,
    id: number,
  }),
});

export { optionalStandard, selectedOptionalStandard };
