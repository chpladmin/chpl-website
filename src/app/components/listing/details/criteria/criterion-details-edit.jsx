import React, { useState } from 'react';
import { func, object } from 'prop-types';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Collapse,
  Divider,
  FormControlLabel,
  MenuItem,
  Switch,
  Typography,
} from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { getAngularService } from '.';
import { ChplReliedUponSoftwareEdit } from './relied-upon-software';
import ChplOptionalStandardsEdit from './optional-standards';
import ChplSvapsEdit from './svaps';
import ChplTestFunctionalityEdit from './test-functionality';
import ChplTestDataEdit from './test-data';
import ChplTestProceduresEdit from './test-procedures';
import ChplTestToolsEdit from './test-tools';
import { ChplTextField } from '../../../util';

const validationSchema = yup.object({
  apiDocumentation: yup.string()
    .url('Enter a valid URL'),
  documentationUrl: yup.string()
    .url('Enter a valid URL'),
  exportDocumentation: yup.string()
    .url('Enter a valid URL'),
  useCases: yup.string()
    .url('Enter a valid URL'),
});

function ChplCriterionDetailsEdit(props) {
  /* eslint-disable react/destructuring-assignment */
  const [criterion, setCriterion] = useState(props.criterion);
  const [resources] = useState(props.resources);
  const $analytics = getAngularService('$analytics');
  /* eslint-enable react/destructuring-assignment */

  const formik = useFormik({
    initialValues: {
      success: criterion.success || false,
      apiDocumentation: criterion.apiDocumentation,
      attestationAnswer: criterion.attestationAnswer,
      documentationUrl: criterion.documentationUrl,
      exportDocumentation: criterion.exportDocumentation,
      g1Success: criterion.g1Success,
      g2Success: criterion.g2Success,
      gap: criterion.gap,
      privacySecurityFramework: criterion.privacySecurityFramework,
      sed: criterion.sed,
      serviceBaseUrlList: criterion.serviceBaseUrlList,
      useCases: criterion.useCases,
    },
    validationSchema,
    validateOnChange: false,
    validateOnMount: true,
  });

  const onChange = (...args) => {
    formik.handleChange(...args);
    props.onChange();
  };

  const save = () => {
    const toSave = {
      ...criterion,
      success: formik.values.success,
      apiDocumentation: formik.values.apiDocumentation,
      attestationAnswer: formik.values.attestationAnswer,
      documentationUrl: formik.values.documentationUrl,
      exportDocumentation: formik.values.exportDocumentation,
      g1Success: formik.values.g1Success,
      g2Success: formik.values.g2Success,
      gap: formik.values.gap,
      privacySecurityFramework: formik.values.privacySecurityFramework,
      sed: formik.values.sed,
      serviceBaseUrlList: formik.values.serviceBaseUrlList,
      useCases: formik.values.useCases,
    };
    props.onSave(toSave);
  };

  const handleDetailChange = (change) => {
    const updated = {
      ...criterion,
    };
    updated[change.key] = change.data;
    setCriterion(updated);
    props.onChange();
  };

  return (
    <Container>
      <Card>
        <CardContent>
          <Typography variant="subtitle1">{formik.values.success ? 'Attests' : 'Does not attest'} to Criterion</Typography>
          <FormControlLabel
            control={(
              <Switch
                id="success"
                name="success"
                color="primary"
                checked={formik.values.success}
                onChange={onChange}
              />
            )}
            label={`${criterion.criterion.number}: ${criterion.criterion.title}`}
          />
          <Collapse in={formik.values.success}>
            <div>
              <Divider />
            </div>
            <div>
              <Typography variant="subtitle1">Relied Upon Software</Typography>
              <ChplReliedUponSoftwareEdit
                software={criterion.additionalSoftware}
                onChange={handleDetailChange}
              />
            </div>
            { formik.values.gap !== null
              && (
                <>
                  <div>
                    <Divider />
                  </div>
                  <div>
                    <Typography variant="subtitle1">GAP</Typography>
                    <FormControlLabel
                      control={(
                        <Switch
                          id="gap"
                          name="gap"
                          color="primary"
                          checked={formik.values.gap}
                          onChange={onChange}
                        />
                      )}
                      label={`Gap: ${formik.values.gap ? 'True' : 'False'}`}
                    />
                  </div>
                </>
              )}
            { criterion.allowedSvaps?.length > 0
              && (
                <>
                  <div>
                    <Divider />
                  </div>
                  <div>
                    <Typography variant="subtitle1">Standards Version Advancement Process</Typography>
                    <ChplSvapsEdit
                      svaps={criterion.svaps}
                      options={criterion.allowedSvaps}
                      onChange={handleDetailChange}
                    />
                  </div>
                </>
              )}
            { criterion.testStandards
              && (
                <>
                  <div>
                    <Divider />
                  </div>
                  <div>
                    <Typography variant="subtitle1">Optional Standard</Typography>
                    <ChplOptionalStandardsEdit
                      optionalStandards={criterion.testStandards}
                      options={resources.testStandards.data}
                      onChange={handleDetailChange}
                    />
                  </div>
                </>
              )}
            { formik.values.g1Success !== null
              && (
                <>
                  <div>
                    <Divider />
                  </div>
                  <div>
                    <Typography variant="subtitle1">Measure Successfully Tested for G1</Typography>
                    <FormControlLabel
                      control={(
                        <Switch
                          id="g1Success"
                          name="g1Success"
                          color="primary"
                          checked={formik.values.g1Success}
                          onChange={onChange}
                        />
                      )}
                      label={`Measure Successfully Tested for G1: ${formik.values.g1Success ? 'True' : 'False'}`}
                    />
                  </div>
                </>
              )}
            { formik.values.g2Success !== null
              && (
                <>
                  <div>
                    <Divider />
                  </div>
                  <div>
                    <Typography variant="subtitle1">Measure Successfully Tested for G2</Typography>
                    <FormControlLabel
                      control={(
                        <Switch
                          id="g2Success"
                          name="g2Success"
                          color="primary"
                          checked={formik.values.g2Success}
                          onChange={onChange}
                        />
                      )}
                      label={`Measure Successfully Tested for G2: ${formik.values.g2Success ? 'True' : 'False'}`}
                    />
                  </div>
                </>
              )}
            { criterion.testFunctionality
              && (
                <>
                  <div>
                    <Divider />
                  </div>
                  <div>
                    <Typography variant="subtitle1">Functionality Tested</Typography>
                    <ChplTestFunctionalityEdit
                      testFunctionality={criterion.testFunctionality}
                      options={criterion.allowedTestFunctionalities}
                      onChange={handleDetailChange}
                    />
                  </div>
                </>
              )}
            { criterion.testProcedures
              && (
                <>
                  <div>
                    <Divider />
                  </div>
                  <div>
                    <Typography variant="subtitle1">Test Procedure</Typography>
                    <ChplTestProceduresEdit
                      testProcedures={criterion.testProcedures}
                      options={resources.testProcedures.data}
                      onChange={handleDetailChange}
                    />
                  </div>
                </>
              )}
            { criterion.testToolsUsed
              && (
                <>
                  <div>
                    <Divider />
                  </div>
                  <div>
                    <Typography variant="subtitle1">Test Tools Used</Typography>
                    <ChplTestToolsEdit
                      testTools={criterion.testToolsUsed}
                      options={resources.testTools.data}
                      onChange={handleDetailChange}
                    />
                  </div>
                </>
              )}
            { criterion.testDataUsed
              && (
                <>
                  <div>
                    <Divider />
                  </div>
                  <div>
                    <Typography variant="subtitle1">Test Data Used</Typography>
                    <ChplTestDataEdit
                      testData={criterion.testDataUsed}
                      options={resources.testData.data}
                      onChange={handleDetailChange}
                    />
                  </div>
                </>
              )}
            { formik.values.sed !== null
              && (
                <>
                  <div>
                    <Divider />
                  </div>
                  <div>
                    <Typography variant="subtitle1">SED</Typography>
                    <FormControlLabel
                      control={(
                        <Switch
                          id="sed"
                          name="sed"
                          color="primary"
                          checked={formik.values.sed}
                          onChange={onChange}
                        />
                      )}
                      label={`SED: ${formik.values.sed ? 'True' : 'False'}`}
                    />
                  </div>
                </>
              )}
            { formik.values.apiDocumentation !== null
              && (
                <>
                  <div>
                    <Divider />
                  </div>
                  <div>
                    <ChplTextField
                      id="api-documentation"
                      name="apiDocumentation"
                      label="API Documentation"
                      value={formik.values.apiDocumentation}
                      onChange={onChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.apiDocumentation && formik.errors.apiDocumentation}
                      helperText={formik.touched.apiDocumentation && formik.errors.apiDocumentation}
                    />
                  </div>
                </>
              )}
            { formik.values.exportDocumentation !== null
              && (
                <>
                  <div>
                    <Divider />
                  </div>
                  <div>
                    <ChplTextField
                      id="export-documentation"
                      name="exportDocumentation"
                      label="Export Documentation"
                      value={formik.values.exportDocumentation}
                      onChange={onChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.exportDocumentation && formik.errors.exportDocumentation}
                      helperText={formik.touched.exportDocumentation && formik.errors.exportDocumentation}
                    />
                  </div>
                </>
              )}
            { formik.values.attestationAnswer !== null
              && (
                <>
                  <div>
                    <Divider />
                  </div>
                  <div>
                    <Typography variant="subtitle1">Attestation</Typography>
                    <FormControlLabel
                      control={(
                        <Switch
                          id="attestation-answer"
                          name="attestationAnswer"
                          color="primary"
                          checked={formik.values.attestationAnswer}
                          onChange={onChange}
                        />
                      )}
                      label={`Attestation: ${formik.values.attestationAnswer ? 'Yes' : 'No'}`}
                    />
                  </div>
                </>
              )}
            { formik.values.documentationUrl !== null
              && (
                <>
                  <div>
                    <Divider />
                  </div>
                  <div>
                    <ChplTextField
                      id="documentation-url"
                      name="documentationUrl"
                      label="Documentation"
                      value={formik.values.documentationUrl}
                      onChange={onChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.documentationUrl && formik.errors.documentationUrl}
                      helperText={formik.touched.documentationUrl && formik.errors.documentationUrl}
                    />
                  </div>
                </>
              )}
            { formik.values.useCases !== null && formik.values.attestationAnswer
              && (
                <>
                  <div>
                    <Divider />
                  </div>
                  <div>
                    <ChplTextField
                      id="use-cases"
                      name="useCases"
                      label="Use Cases"
                      value={formik.values.useCases}
                      onChange={onChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.useCases && formik.errors.useCases}
                      helperText={formik.touched.useCases && formik.errors.useCases}
                    />
                  </div>
                </>
              )}
            { formik.values.serviceBaseUrlList !== null
              && (
                <>
                  <div>
                    <Divider />
                  </div>
                  <div>
                    <ChplTextField
                      id="service-base-url-list"
                      name="serviceBaseUrlList"
                      label="Service Base URL List"
                      value={formik.values.serviceBaseUrlList}
                      onChange={onChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.serviceBaseUrlList && formik.errors.serviceBaseUrlList}
                      helperText={formik.touched.serviceBaseUrlList && formik.errors.serviceBaseUrlList}
                    />
                  </div>
                </>
              )}
            { formik.values.privacySecurityFramework !== null
              && (
                <>
                  <div>
                    <Divider />
                  </div>
                  <div>
                    <ChplTextField
                      select
                      id="privacy-security-framework"
                      name="privacySecurityFramework"
                      label="Privacy &amp; Security Framework"
                      value={formik.values.privacySecurityFramework}
                      onChange={onChange}
                    >
                      <MenuItem value="Approach 1" key="Approach 1">Approach 1</MenuItem>
                      <MenuItem value="Approach 2" key="Approach 2">Approach 2</MenuItem>
                      <MenuItem value="Approach 1;Approach 2" key="Approach 1;Approach 2">Approach 1;Approach 2</MenuItem>
                    </ChplTextField>
                  </div>
                </>
              )}
          </Collapse>
        </CardContent>
        <CardActions>
          <Button
            color="default"
            variant="contained"
            size="small"
            onClick={() => props.onCancel()}
          >
            <CloseOutlinedIcon />
            {' '}
            Cancel
          </Button>
          <Button
            color="primary"
            variant="contained"
            size="small"
            onClick={save}
          >
            Accept
            <CheckOutlinedIcon />
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
}

export default ChplCriterionDetailsEdit;

ChplCriterionDetailsEdit.propTypes = {
  criterion: object.isRequired,
  resources: object.isRequired,
  onCancel: func.isRequired,
  onChange: func.isRequired,
  onSave: func.isRequired,
};
