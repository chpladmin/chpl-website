/* eslint-disable import/no-extraneous-dependencies */
import { number, shape, string } from 'prop-types';

const conformanceMethod = shape({
  id: number,
  name: string,
});

const selectedConformanceMethod = shape({
  conformanceMethod,
  conformanceMethodVersion: string,
  id: number,
});

export { conformanceMethod, selectedConformanceMethod };
