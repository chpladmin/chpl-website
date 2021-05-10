/* eslint-disable import/no-extraneous-dependencies */
import {
  arrayOf,
  bool,
  number,
  shape,
  string,
} from 'prop-types';
import criterion from './criterion';
import reliedUponSoftware from './relied-upon-software';
import { selectedOptionalStandard } from './optional-standard';
import { selectedSvap, svap } from './svap';
import { selectedTestData } from './test-data';
import { selectedTestFunctionality, testFunctionality } from './test-functionality';
import { selectedTestProcedure } from './test-procedure';
import { selectedTestTool } from './test-tool';

const certificationResult = shape({
  additionalSoftware: arrayOf(reliedUponSoftware),
  allowedSvaps: arrayOf(svap),
  allowedTestFunctionalities: arrayOf(testFunctionality),
  apiDocumentation: string,
  attestationAnswer: bool,
  attestationAnswerStr: string,
  criterion,
  documentationUrl: string,
  exportDocumentation: string,
  g1Succes: bool,
  g2Success: bool,
  gap: bool,
  id: number,
  number: string,
  privacySecurityFramework: string,
  sed: bool,
  serviceBaseUrlList: string,
  success: bool,
  svaps: arrayOf(selectedSvap),
  testDataUsed: arrayOf(selectedTestData),
  testFunctionalityUsed: arrayOf(selectedTestFunctionality),
  testProcedures: arrayOf(selectedTestProcedure),
  testStandards: arrayOf(selectedOptionalStandard),
  testToolsUsed: arrayOf(selectedTestTool),
  title: string,
  useCases: string,
});

export default certificationResult;
