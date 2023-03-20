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

const sed = shape({
  testTasks: arrayOf(object),
  uceProcesses: arrayOf(object),
});

const listing = shape({
  certificationEdition,
  sed,
});

export { certificationEdition, cqm, listing };
