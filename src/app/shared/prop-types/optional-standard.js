/* eslint-disable import/no-extraneous-dependencies */
import { number, shape, string } from 'prop-types';

const optionalStandard = shape({
  id: number,
  optionalStandard: string,
});

const selectedOptionalStandard = shape({
  id: number,
  optionalStandard: shape({
    optionalStandard: string,
    id: number,
  }),
});

export { optionalStandard, selectedOptionalStandard };
