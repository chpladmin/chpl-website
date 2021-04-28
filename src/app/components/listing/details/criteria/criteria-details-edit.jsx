import React, { useState } from 'react';
import { arrayOf, func, object } from 'prop-types';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  Divider,
  FormControlLabel,
  Grid,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { getAngularService } from '.';
import { ChplEllipsis, ChplLink, ChplTooltip } from '../../../util';
import { ChplOptionalStandardsEdit } from './optional-standards';
import { ChplReliedUponSoftwareEdit } from './relied-upon-software';

const validationSchema = yup.object({
});

const useStyles = makeStyles(() => ({
  infoIcon: {
    fontSize: '1rem',
  },
}));

function ChplCriteriaDetailsEdit(props) {
  const [criteria, setCriteria] = useState(props.criteria);
  const [checked, setChecked] = useState(props.criteria.success);
  const [resources] = useState(props.resources);
  const $analytics = getAngularService('$analytics');
  const classes = useStyles();

  const formik = useFormik({
    initialValues: {
      success: props.criteria.success || false,
      gap: props.criteria.gap,
      g1Success: props.criteria.g1Success,
      g1Success: props.criteria.g1Success,
      sed: props.criteria.sed,
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
      sed: formik.values.sed,
      gap: formik.values.gap,
      g1Success: formik.values.g1Success,
      g1Success: formik.values.g1Success,
      sed: formik.values.sed,
    };
    props.onSave(toSave);
  };

  const handleReliedUponSoftwareChange = (change) => {
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
                  onChange={handleReliedUponSoftwareChange}
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
                        onChange={handleReliedUponSoftwareChange}
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
  onCancel: func,
  onChange: func,
  onSave: func,
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
            { criteria.testStandards
              && (
              <TableRow key="optionalStandards">
                <TableCell component="th" scope="row">
                  Optional Standard
                  <ChplTooltip title="The standard(s) used to meet a certification criterion where additional, optional standards are permitted.">
                    <InfoOutlinedIcon className={classes.infoIcon} />
                  </ChplTooltip>
                </TableCell>
                <TableCell align="right">
                  { criteria.testStandards.length > 0
                    && (
                    <ul>
                      { criteria.testStandards.map((ts) => (
                        <li key={ts.id}>
                          { ts.testStandardDescription
                            && <ChplEllipsis text={ts.testStandardDescription} maxLength={100} wordBoundaries />}
                          { !ts.testStandardDescription && ts.testStandardName }
                        </li>
                      ))}
                    </ul>
                    )}
                  { criteria.testStandards.length === 0 && 'None' }
                </TableCell>
              </TableRow>
              )}
            { criteria.g1Success !== null
              && (
              <TableRow key="g1Success">
                <TableCell component="th" scope="row">
                  Measure Successfully Tested for G1
                  <ChplTooltip title="The CMS measure and provider type tested for the automated numerator recording certification criterion (&sect; 170.314(g)(1)).">
                    <InfoOutlinedIcon className={classes.infoIcon} />
                  </ChplTooltip>
                </TableCell>
                <TableCell align="right">{criteria.g1Success ? 'True' : 'False'}</TableCell>
              </TableRow>
              )}
            { criteria.g2Success !== null
              && (
              <TableRow key="g2Success">
                <TableCell component="th" scope="row">
                  Measure Successfully Tested for G2
                  <ChplTooltip title="The CMS measure and provider type tested for the automated numerator recording certification criterion (&sect; 170.314(g)(2)).">
                    <InfoOutlinedIcon className={classes.infoIcon} />
                  </ChplTooltip>
                </TableCell>
                <TableCell align="right">{criteria.g2Success ? 'True' : 'False'}</TableCell>
              </TableRow>
              )}
            { criteria.testFunctionality
              && (
              <TableRow key="testFunctionality">
                <TableCell component="th" scope="row">
                  Functionality Tested
                  <ChplTooltip title="Any optional, alternative, ambulatory, or inpatient capabilities within a certification criterion to which the product was tested and certified. Applies to 2015 Edition certification only.">
                    <InfoOutlinedIcon className={classes.infoIcon} />
                  </ChplTooltip>
                </TableCell>
                <TableCell align="right">
                  { criteria.testFunctionality.length > 0
                    && (
                    <ul>
                      { criteria.testFunctionality.map((tf) => (
                        <li key={tf.id}>
                          { tf.description
                            && <ChplEllipsis text={tf.description} maxLength={100} wordBoundaries />}
                          { !tf.description && tf.name }
                        </li>
                      ))}
                    </ul>
                    )}
                  { criteria.testFunctionality.length === 0 && 'None' }
                </TableCell>
              </TableRow>
              )}
            { criteria.testProcedures
              && (
              <TableRow key="testProcedures">
                <TableCell component="th" scope="row">
                  Test Procedure
                  <ChplTooltip title="The type of test procedure and the version used during testing of the certification criterion functionality.">
                    <InfoOutlinedIcon className={classes.infoIcon} />
                  </ChplTooltip>
                </TableCell>
                <TableCell align="right">
                  { criteria.testProcedures.length > 0
                    && (
                    <ul>
                      { criteria.testProcedures.map((tp) => (
                        <li key={tp.id}>
                          Name:
                          {' '}
                          { tp.testProcedure.name }
                          ; Version:
                          {' '}
                          { tp.testProcedureVersion }
                        </li>
                      ))}
                    </ul>
                    )}
                  { criteria.testProcedures.length === 0 && 'None' }
                </TableCell>
              </TableRow>
              )}
            { (criteria.criterion.number === '170.315 (g)(4)' || criteria.criterion.number === '170.314 (g)(4)')
              && (
              <TableRow key="qms">
                <TableCell component="th" scope="row">
                  Quality Management System
                  <ChplTooltip title="If the corresponding certified product has a Quality Management System (QMS): 1) the standard or mapping used to meet the quality management system certification criterion, and 2) if a QMS standard or mapping was modified, documentation on the changes made. Specific requirements for 2015 Edition are different than for 2014 Edition.">
                    <InfoOutlinedIcon className={classes.infoIcon} />
                  </ChplTooltip>
                </TableCell>
                <TableCell align="right">
                  { qmsStandards?.length > 0
                    && (
                    <ul>
                      { qmsStandards.map((qms) => (
                        <li key={qms.id}>
                          <strong>Standard: </strong>
                          { qms.qmsStandardName }
                          <br />
                          <strong>Description: </strong>
                          {
                            qms.qmsModification
                              && <ChplEllipsis text={qms.qmsModification} maxLength={32} wordBoundaries />
                          }
                          { !qms.modification
                            && <>N/A</>}
                          <br />
                          <strong>Applicable Criteria: </strong>
                          { qms.applicableCriteria || 'N/A' }
                          <br />
                        </li>
                      ))}
                    </ul>
)}
                  { (!qmsStandards || qmsStandards.length === 0) && 'N/A' }
                </TableCell>
              </TableRow>
              )}
            { criteria.criterion.number === '170.315 (g)(5)'
              && (
              <TableRow key="accessibility">
                <TableCell component="th" scope="row">
                  Accessibility Standard
                  <ChplTooltip title="The standard(s) used to meet the accessibility-centered design certification criterion or developer attestation that no accessibility-centered design was employed. Applies to 2015 Edition certification only.">
                    <InfoOutlinedIcon className={classes.infoIcon} />
                  </ChplTooltip>
                </TableCell>
                <TableCell align="right">
                  { accessibilityStandards?.length > 0
                    && (
                    <ul>
                      { accessibilityStandards.map((std) => (
                        <li key={std.id}>
                          { std.accessibilityStandardName }
                        </li>
                      ))}
                    </ul>
)}
                  { (!accessibilityStandards || accessibilityStandards.length === 0) && 'N/A' }
                </TableCell>
              </TableRow>
              )}
            { criteria.testToolsUsed
              && (
              <TableRow key="testToolsUsed">
                <TableCell component="th" scope="row">
                  Test Tool
                  <ChplTooltip title="The name and version of the test tool used during testing of the certification criterion functionality.">
                    <InfoOutlinedIcon className={classes.infoIcon} />
                  </ChplTooltip>
                </TableCell>
                <TableCell align="right">
                  { criteria.testToolsUsed.length > 0
                    && (
                    <ul>
                      { criteria.testToolsUsed.map((tt) => (
                        <li key={tt.id}>
                          Tool:
                          {' '}
                          { tt.testToolName }
                          ; Version:
                          {' '}
                          { tt.testToolVersion || 'N/A' }
                        </li>
                      ))}
                    </ul>
                    )}
                  { criteria.testToolsUsed.length === 0 && 'None' }
                </TableCell>
              </TableRow>
              )}
            { criteria.testDataUsed
              && (
              <TableRow key="testDataUsed">
                <TableCell component="th" scope="row">
                  Test Data
                  <ChplTooltip title="The test data version and any alterations or modifications to the ONC-approved test data. It is an optional field except for the products testing for automated numerator recording (&sect;170.314(g)(1) or &sect;170.315(g)(1)) and automated measure calculation (&sect; 170.314(g)(2) or &sect;170.315(g)(2)). For those products, the field is required.">
                    <InfoOutlinedIcon className={classes.infoIcon} />
                  </ChplTooltip>
                </TableCell>
                <TableCell align="right">
                  { criteria.testDataUsed.length > 0
                    && (
                    <ul>
                      { criteria.testDataUsed.map((td) => (
                        <li key={td.id}>
                          Data:
                          {' '}
                          { td.testData.name || 'N/A' }
                          ; Version:
                          {' '}
                          { td.version }
                          ; Alteration:
                          {' '}
                          { td.alteration || 'N/A' }
                        </li>
                      ))}
                    </ul>
                    )}
                  { criteria.testDataUsed.length === 0 && 'None' }
                </TableCell>
              </TableRow>
              )}
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
            { criteria.sed !== null
              && (
              <TableRow key="sed">
                <TableCell component="th" scope="row">
                  SED
                  <ChplTooltip title="The corresponding certification criteria met safety-enhanced design attestation during certification testing (True or False). Specific requirements for 2015 Edition are different than for 2014 Edition.">
                    <InfoOutlinedIcon className={classes.infoIcon} />
                  </ChplTooltip>
                </TableCell>
                <TableCell align="right">{criteria.sed ? 'True' : 'False'}</TableCell>
              </TableRow>
              )}
          </TableBody>
        </Table>
      </TableContainer>
*/
