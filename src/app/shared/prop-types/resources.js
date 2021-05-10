/* eslint-disable import/no-extraneous-dependencies */
import {
  arrayOf,
  bool,
  object,
  shape,
} from 'prop-types';
import acb from './acb';
import { optionalStandard } from './optional-standard';
import practiceType from './practice-type';
import { testData } from './test-data';
import { testFunctionality } from './test-functionality';
import { testProcedure } from './test-procedure';
import { testTool } from './test-tool';

const resources = shape({
  accessibilityStandards: arrayOf(object),
  bodies: arrayOf(acb),
  classifications: arrayOf(object),
  editions: arrayOf(object),
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
  testFunctionalities: shape({
    expandable: bool,
    data: arrayOf(testFunctionality),
  }),
  testProcedures: shape({
    expandable: bool,
    data: arrayOf(testProcedure),
  }),
  testStandards: shape({
    expandable: bool,
    data: arrayOf(optionalStandard),
  }),
  testTools: shape({
    expandable: bool,
    data: arrayOf(testTool),
  }),
  testingLabs: arrayOf(object),
  ucdProcesses: shape({
    expandable: bool,
    data: arrayOf(object),
  }),
});

export default resources;
