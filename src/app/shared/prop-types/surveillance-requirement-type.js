/* eslint-disable import/no-extraneous-dependencies */
import { number, shape, string } from 'prop-types';

const surveillanceRequirementType = shape({
  id: number,
  name: string,
});

export default surveillanceRequirementType;
