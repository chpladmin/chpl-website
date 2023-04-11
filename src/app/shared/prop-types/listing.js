import {
  arrayOf,
  bool,
  number,
  object,
  shape,
  string,
} from 'prop-types';

import criterion from './criterion';

const certificationEdition = shape({
  id: number,
  name: string,
});

const cqmCriterion = shape({
  certificationId: number,
  certificationNumber: string,
  criterion,
  id: number,
});

const cqm = shape({
  allVersions: arrayOf(string),
  cmsId: string,
  criteria: arrayOf(cqmCriterion),
  description: string,
  domain: string,
  id: number,
  nqfNumber: string,
  number: string,
  success: bool,
  successVersions: arrayOf(string),
  title: string,
  typeId: number,
});

const measure = shape({
  associatedCriteria: arrayOf(criterion),
  id: number,
  measure: shape({
    abbreviation: string,
    allowedCriteria: arrayOf(criterion),
    domain: shape({
      id: number,
      name: string,
    }),
    id: number,
    name: string,
    removed: bool,
    requiredTest: string,
    requiresCriteriaSelection: bool,
  }),
  measureType: shape({
    id: number,
    name: string,
  }),
});

const sed = shape({
  testTasks: arrayOf(object),
  ucdProcesses: arrayOf(object),
});

const listing = shape({
  certificationEdition,
  cqmResults: arrayOf(cqm),
  measures: arrayOf(measure),
  sed,
});

export {
  certificationEdition,
  cqm,
  listing,
  measure,
};
