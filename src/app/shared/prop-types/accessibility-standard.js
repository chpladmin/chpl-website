/* eslint-disable import/no-extraneous-dependencies */
import { number, shape, string } from 'prop-types';

const accessibilityStandard = shape({
  accessibilityStandardId: number,
  accessibilityStandardName: string,
  id: number,
});

export default accessibilityStandard;
