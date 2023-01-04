/* eslint-disable import/no-extraneous-dependencies */
import { number, shape, string } from 'prop-types';
import practiceType from './practice-type';

const functionalitiesTested = shape({
  description: string,
  id: number,
  name: string,
  practiceType,
});

const selectedFunctionalitiesTested = shape({
  description: string,
  id: number,
  name: string,
  functionalityTestedId: number,
});

export { functionalitiesTested, selectedFunctionalitiesTested };
