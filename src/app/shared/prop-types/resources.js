/* eslint-disable import/no-extraneous-dependencies */
import {
  arrayOf,
  bool,
  object,
  shape,
} from 'prop-types';

import acb from './acb';
import functionalityTested from './functionalities-tested';
import practiceType from './practice-type';
import { testData } from './test-data';
import { testProcedure } from './test-procedure';
import { testStandard } from './test-standard';
import { testTool } from './standards';

const resources = shape({
  accessibilityStandards: arrayOf(object),
  bodies: arrayOf(acb),
  classifications: arrayOf(object),
  editions: arrayOf(object),
  functionaltiesTested: arrayOf(functionalityTested),
  measureTypes: shape({
    expandable: bool,
    data: arrayOf(object),
  }),
  measures: shape({
    expandable: bool,
    data: arrayOf(object),
  }),
  practices: arrayOf(practiceType),
  qmsStandards: arrayOf(object),
  statuses: arrayOf(object),
  targetedUsers: arrayOf(object),
  testData: shape({
    expandable: bool,
    data: arrayOf(testData),
  }),
  testProcedures: shape({
    expandable: bool,
    data: arrayOf(testProcedure),
  }),
  testStandards: shape({
    expandable: bool,
    data: arrayOf(testStandard),
  }),
  testTools: arrayOf(testTool),
  testingLabs: arrayOf(object),
  ucdProcesses: arrayOf(object),
});

export default resources;
