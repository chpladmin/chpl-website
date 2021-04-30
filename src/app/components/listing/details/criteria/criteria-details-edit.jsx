import React, { useState } from 'react';
import { func, object } from 'prop-types';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Divider,
  FormControlLabel,
  Grid,
  Switch,
  Typography,
  makeStyles,
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

const validationSchema = yup.object({
});

const useStyles = makeStyles(() => ({
  infoIcon: {
    fontSize: '1rem',
  },
}));

function ChplCriteriaDetailsEdit(props) {
  const [criteria, setCriteria] = useState(props.criteria);
  const [resources] = useState(props.resources);
  const $analytics = getAngularService('$analytics');
  const classes = useStyles();

  const formik = useFormik({
    initialValues: {
      success: criteria.success || false,
      gap: criteria.gap,
      g1Success: criteria.g1Success,
      g2Success: criteria.g2Success,
      sed: criteria.sed,
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
      ...criteria,
      success: formik.values.success,
      gap: formik.values.gap,
      g1Success: formik.values.g1Success,
      g2Success: formik.values.g2Success,
      sed: formik.values.sed,
    };
    props.onSave(toSave);
  };

  const handleDetailChange = (change) => {
    const updated = {
      ...criteria,
    };
    updated[change.key] = change.data;
    setCriteria(updated);
    props.onChange();
  };

  return (
    <>
      <Card>
        <CardContent>
          <Grid container spacing={4}>
            <Grid item xs={12}>
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
                label={`${criteria.criterion.number}: ${criteria.criterion.title}`}
              />
            </Grid>
            <Collapse in={formik.values.success}>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Relied Upon Software</Typography>
                <ChplReliedUponSoftwareEdit
                  software={criteria.additionalSoftware}
                  onChange={handleDetailChange}
                />
              </Grid>
              { formik.values.gap !== null
                && (
                <>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
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
                  </Grid>
                </>
                )}
              { criteria.allowedSvaps?.length > 0
                && (
                  <>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1">Standards Version Advancement Process</Typography>
                      <ChplSvapsEdit
                        svaps={criteria.svaps}
                        options={criteria.allowedSvaps}
                        onChange={handleDetailChange}
                      />
                    </Grid>
                  </>
                )}
              { criteria.testStandards
                && (
                  <>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1">Optional Standard</Typography>
                      <ChplOptionalStandardsEdit
                        optionalStandards={criteria.testStandards}
                        options={resources.testStandards.data}
                        onChange={handleDetailChange}
                      />
                    </Grid>
                  </>
                )}
              { formik.values.g1Success !== null
                && (
                <>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
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
                  </Grid>
                </>
                )}
              { formik.values.g2Success !== null
                && (
                <>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
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
                  </Grid>
                </>
                )}
              { criteria.testFunctionality
                && (
                  <>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1">Functionality Tested</Typography>
                      <ChplTestFunctionalityEdit
                        testFunctionality={criteria.testFunctionality}
                        options={criteria.allowedTestFunctionalities}
                        onChange={handleDetailChange}
                      />
                    </Grid>
                  </>
                )}
              { criteria.testProcedures
                && (
                  <>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1">Test Procedure</Typography>
                      <ChplTestProceduresEdit
                        testProcedures={criteria.testProcedures}
                        options={resources.testProcedures.data}
                        onChange={handleDetailChange}
                      />
                    </Grid>
                  </>
                )}
              { criteria.testToolsUsed
                && (
                  <>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1">Test Tools Used</Typography>
                      <ChplTestToolsEdit
                        testTools={criteria.testToolsUsed}
                        options={resources.testTools.data}
                        onChange={handleDetailChange}
                      />
                    </Grid>
                  </>
                )}
              { criteria.testDataUsed
                && (
                  <>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1">Test Data Used</Typography>
                      <ChplTestDataEdit
                        testData={criteria.testDataUsed}
                        options={resources.testData.data}
                        onChange={handleDetailChange}
                      />
                    </Grid>
                  </>
                )}
              { formik.values.sed !== null
                && (
                <>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
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
                  </Grid>
                </>
                )}
            </Collapse>
          </Grid>
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
    </>
  );
}

export default ChplCriteriaDetailsEdit;

ChplCriteriaDetailsEdit.propTypes = {
  criteria: object.isRequired,
  resources: object.isRequired,
  onCancel: func.isRequired,
  onChange: func.isRequired,
  onSave: func.isRequired,
};

/*
additional software
gap
            { criteria.svaps?.length > 0
              && (
              <TableRow key="svap">
                <TableCell component="th" scope="row">
                  Standards Version Advancement Process
                  <ChplTooltip title="Standards Version Advancement Process (SVAP) is a process to enable health IT developers’ ability to incorporate newer versions of Secretary-adopted standards and implementation specification">
                    <InfoOutlinedIcon className={classes.infoIcon} />
                  </ChplTooltip>
                </TableCell>
                <TableCell align="right">
                  <ul>
                    { criteria.svaps.map((svap) => (
                      <li key={svap.id}>
                        <ChplEllipsis text={`${(svap.replaced ? 'Replaced | ' : '') + svap.regulatoryTextCitation} ${svap.approvedStandardVersion}`} maxLength="100" wordBoundaries="true" />
                        { svap.replaced
                          && (
                          <ChplTooltip title="This version of the adopted standard or implementation specification is approved for use under previous SVAP flexibility, but please note a newer SVAP version is now available for use in the Program.">
                            <InfoOutlinedIcon className={classes.infoIcon} />
                          </ChplTooltip>
                          )}
                      </li>
                    ))}
                  </ul>
                </TableCell>
              </TableRow>
)}
testStandards
g1Success
g2Success
testFunctionality
testProcedures
testToolsUsed
testDataUsed
            { criteria.apiDocumentation !== null
              && (
              <TableRow key="apiDocumentation">
                <TableCell component="th" scope="row">
                  API Documentation
                  <ChplTooltip title="The publicly accessible hyperlink that has the documentation used to meet the applicable API certification criteria (&sect; 170.315(g)(7) or &sect; 170.315(g)(8) or &sect; 170.315(g)(9)).">
                    <InfoOutlinedIcon className={classes.infoIcon} />
                  </ChplTooltip>
                </TableCell>
                <TableCell align="right">
                  { criteria.apiDocumentation
                    && <ChplLink href={criteria.apiDocumentation} text={criteria.apiDocumentation} analytics={{ event: 'API Documentation', category: 'Download Details', label: criteria.apiDocumentation }} />}
                  { !criteria.apiDocumentation && 'None' }
                </TableCell>
              </TableRow>
              )}
            { criteria.exportDocumentation !== null
              && (
              <TableRow key="exportDocumentation">
                <TableCell component="th" scope="row">
                  Export Documentation
                  <ChplTooltip title="The publicly accessible hyperlink of the export’s format used to support the EHI export criterion (&sect; 170.315(b)(10))">
                    <InfoOutlinedIcon className={classes.infoIcon} />
                  </ChplTooltip>
                </TableCell>
                <TableCell align="right">
                  { criteria.exportDocumentation
                    && <ChplLink href={criteria.exportDocumentation} text={criteria.exportDocumentation} analytics={{ event: 'Export Documentation', category: 'Download Details', label: criteria.exportDocumentation }} />}
                  { !criteria.exportDocumentation && 'None' }
                </TableCell>
              </TableRow>
              )}
            { criteria.attestationAnswer !== null
              && (
              <TableRow key="attestationAnswer">
                <TableCell component="th" scope="row">
                  Attestation
                  <ChplTooltip title="Indicates whether certified health IT supports the applicable privacy and security transparency attestation criteria (&sect; 170.315(d)(12) or &sect; 170.315(d)(13))">
                    <InfoOutlinedIcon className={classes.infoIcon} />
                  </ChplTooltip>
                </TableCell>
                <TableCell align="right">{criteria.attestationAnswer ? 'Yes' : 'No'}</TableCell>
              </TableRow>
              )}
            { criteria.documentation !== null
              && (
              <TableRow key="documentation">
                <TableCell component="th" scope="row">
                  Documentation
                  <ChplTooltip title="Optional documentation for the Attestation to the applicable privacy and security transparency attestation criteria (&sect; 170.315(d)(12) or &sect; 170.315(d)(13))">
                    <InfoOutlinedIcon className={classes.infoIcon} />
                  </ChplTooltip>
                </TableCell>
                <TableCell align="right">
                  { criteria.documentation
                    && <ChplLink href={criteria.documentation} text={criteria.documentation} analytics={{ event: 'Documentation', category: 'Download Details', label: criteria.documentation }} />}
                  { !criteria.documentation && 'None' }
                </TableCell>
              </TableRow>
              )}
            { criteria.useCases !== null && criteria.attestationAnswer
              && (
              <TableRow key="useCases">
                <TableCell component="th" scope="row">
                  Use Case(s)
                  <ChplTooltip title="Use cases supported as applicable to meet the multi-factor authentication criterion (&sect; 170.315(d)(13))">
                    <InfoOutlinedIcon className={classes.infoIcon} />
                  </ChplTooltip>
                </TableCell>
                <TableCell align="right">
                  { criteria.useCases
                    && <ChplLink href={criteria.useCases} text={criteria.useCases} analytics={{ event: 'Use Cases', category: 'Download Details', label: criteria.useCases }} />}
                  { !criteria.useCases && 'None' }
                </TableCell>
              </TableRow>
              )}
            { criteria.privacySecurityFramework !== null
              && (
              <TableRow key="privacySecurityFramework">
                <TableCell component="th" scope="row">
                  Privacy &amp; Security Framework
                  <ChplTooltip title="The approach by which the criteria addressed the Privacy and Security requirements (Approach 1 – functional demonstration or Approach 2 – documentation of integration). ">
                    <InfoOutlinedIcon className={classes.infoIcon} />
                  </ChplTooltip>
                </TableCell>
                <TableCell align="right">{criteria.privacySecurityFramework}</TableCell>
              </TableRow>
              )}
sed
*/
