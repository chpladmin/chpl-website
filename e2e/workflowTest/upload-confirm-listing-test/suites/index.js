import columnsErrorsAndWarnings from './columns-errors-and-warnings';
import cqmsErrorsAndWarnings from './cqms-errors-and-warnings';
import criteriaRelationshipsErrorsAndWarnings from './criteria-relationships-errors-and-warnings';
import developerErrorsAndWarnings from './developer-errors-and-warnings';
import invalidFormatsErrorsAndWarnings from './invalid-formats-errors-and-warnings';
import measuresErrorsAndWarnings from './measures-errors-and-warnings';
import optionalStandardsErrorsAndWarnings from './optional-standards-errors-and-warnings';
import sedErrorsAndWarnings from './sed-errors-and-warnings';
import icsErrors from './ics-errors';
import svapErrorsAndWarnings from './svap-errors-and-warnings'
import noErrors from './no-errors';

const suites = [
  columnsErrorsAndWarnings,
  cqmsErrorsAndWarnings,
  criteriaRelationshipsErrorsAndWarnings,
  developerErrorsAndWarnings,
  invalidFormatsErrorsAndWarnings,
  measuresErrorsAndWarnings,
  optionalStandardsErrorsAndWarnings,
  sedErrorsAndWarnings,
  icsErrors,
  svapErrorsAndWarnings,
  noErrors,
];

export {
  columnsErrorsAndWarnings,
  cqmsErrorsAndWarnings,
  criteriaRelationshipsErrorsAndWarnings,
  developerErrorsAndWarnings,
  invalidFormatsErrorsAndWarnings,
  measuresErrorsAndWarnings,
  optionalStandardsErrorsAndWarnings,
  sedErrorsAndWarnings,
  icsErrors,
  svapErrorsAndWarnings,
  noErrors,
  suites,
};
