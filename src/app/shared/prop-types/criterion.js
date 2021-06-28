/* eslint-disable import/no-extraneous-dependencies */
<<<<<<< HEAD
import {
  bool, number, shape, string,
} from 'prop-types';
=======
import { bool, number, shape, string } from 'prop-types';
>>>>>>> staging

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
