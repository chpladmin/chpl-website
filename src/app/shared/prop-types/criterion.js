/* eslint-disable import/no-extraneous-dependencies */
import { bool, number, shape, string } from 'prop-types';

const criterion = shape({
  certificationEdition: string,
  certificationEditionId: number,
  description: string,
  id: number,
  number: string,
  removed: bool,
  title: string,
});

export default criterion;
