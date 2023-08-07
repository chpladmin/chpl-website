/* eslint-disable import/no-extraneous-dependencies */
import {
  arrayOf,
  bool,
  number,
  shape,
  string,
} from 'prop-types';

import criterion from './criterion';
import functionalitiesTested from './functionalities-tested';
import reliedUponSoftware from './relied-upon-software';
import { selectedSvap, selectedTestTool, svap } from './standards';
import { selectedTestData } from './test-data';
import { selectedTestProcedure } from './test-procedure';
import { selectedTestStandard } from './test-standard';

const certificationResult = shape({
  additionalSoftware: arrayOf(reliedUponSoftware),
  allowedSvaps: arrayOf(svap),
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
  functionalitiesTested: arrayOf(functionalitiesTested),
  testProcedures: arrayOf(selectedTestProcedure),
  testStandards: arrayOf(selectedTestStandard),
  testToolsUsed: arrayOf(selectedTestTool),
  title: string,
  useCases: string,
});

export default certificationResult;
