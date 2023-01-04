/* eslint-disable import/no-extraneous-dependencies */
import {
  arrayOf,
  bool,
  object,
  shape,
} from 'prop-types';
import acb from './acb';
import practiceType from './practice-type';
import { testData } from './test-data';
import { testProcedure } from './test-procedure';
import { testStandard } from './test-standard';
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
  testProcedures: shape({
    expandable: bool,
    data: arrayOf(testProcedure),
  }),
  testStandards: shape({
    expandable: bool,
    data: arrayOf(testStandard),
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
