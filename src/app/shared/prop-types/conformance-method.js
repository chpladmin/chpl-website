/* eslint-disable import/no-extraneous-dependencies */
import { number, shape, string } from 'prop-types';

const conformanceMethod = shape({
  id: number,
  name: string,
});

const selectedConformanceMethod = shape({
  id: number,
  name: string,
  conformanceMethodId: number,
});

export { conformanceMethod, selectedConformanceMethod };
