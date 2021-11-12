import columnsErrorsAndWarnings from './columns-errors-and-warnings';
import cqmsErrorsAndWarnings from './cqms-errors-and-warnings';
import criteriaRelationshipsErrorsAndWarnings from './criteria-relationships-errors-and-warnings';
import developerErrorsAndWarnings from './developer-errors-and-warnings';
import invalidFormatsErrorsAndWarnings from './invalid-formats-errors-and-warnings';
import measuresErrorsAndWarnings from './measures-errors-and-warnings';
import optionalStandardsErrorsAndWarnings from './optional-standards-errors-and-warnings';
import sedErrorsAndWarnings from './sed-errors-and-warnings';

const suites = [
  columnsErrorsAndWarnings,
  cqmsErrorsAndWarnings,
  criteriaRelationshipsErrorsAndWarnings,
  developerErrorsAndWarnings,
  invalidFormatsErrorsAndWarnings,
  measuresErrorsAndWarnings,
  optionalStandardsErrorsAndWarnings,
  sedErrorsAndWarnings,
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
  suites,
};
