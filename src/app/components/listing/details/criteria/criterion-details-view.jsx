import React, { useContext, useState } from 'react';
import { arrayOf } from 'prop-types';
import InfoIcon from '@material-ui/icons/Info';
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  makeStyles,
} from '@material-ui/core';

import { ChplEllipsis, ChplLink, ChplTooltip } from '../../../util';
import { ChplReliedUponSoftwareView } from './relied-upon-software';
import {
  accessibilityStandard,
  certificationResult,
  qmsStandard,
} from '../../../../shared/prop-types';
import { FlagContext } from '../../../../shared/contexts';

const useStyles = makeStyles(() => ({
  iconSpacing: {
    marginLeft: '4px',
  },
  unindentedData: {
    marginLeft: '-25px',
  },
}));

function ChplCriterionDetailsView(props) {
  /* eslint-disable react/destructuring-assignment */
  const [criterion] = useState(props.criterion);
  const [qmsStandards] = useState(props.qmsStandards);
  const [accessibilityStandards] = useState(props.accessibilityStandards);
  const classes = useStyles();
  const { optionalStandardsIsOn } = useContext(FlagContext);
  /* eslint-enable react/destructuring-assignment */

  if (criterion.criterion.certificationEdition === '2011') {
    return null;
  }

  const showOptionalStandardsSection = () => criterion.success
        && ((criterion.optionalStandards?.length > 0)
            || (criterion.testStandards?.length > 0 && (!optionalStandardsIsOn || criterion.optionalStandards)));

  return (
    <TableContainer component={Paper}>
      <Table aria-label="Criterion Details Table">
        { (criterion.success || criterion.g1Success !== null || criterion.g2Success !== null)
          && (
            <TableHead>
              <TableRow>
                <TableCell
                  style={{ width: '30%' }}
                >
                  Attribute
                </TableCell>
                <TableCell>Value</TableCell>
              </TableRow>
            </TableHead>
          )}
        <TableBody>
          { criterion.success && criterion.additionalSoftware?.length > 0
            && (
              <TableRow key="additionalSoftware">
                <TableCell component="th" scope="row">
                  Relied Upon Software
                  <ChplTooltip title="Software relied upon by the product to demonstrate its compliance with a certification criterion or criterion.">
                    <IconButton >
                      <InfoIcon
                        color="primary" className={classes.iconSpacing}
                        color="primary"
                      />
                    </IconButton>
                  </ChplTooltip>
                </TableCell>
                <TableCell><ChplReliedUponSoftwareView sw={criterion.additionalSoftware} /></TableCell>
              </TableRow>
            )}
          { criterion.success && criterion.gap !== null
            && (
              <TableRow key="gap">
                <TableCell component="th" scope="row">
                  Gap
                  <ChplTooltip title="The corresponding certification criterion are gap certified (True or False).">
                    <IconButton>
                      <InfoIcon
                        className={classes.iconSpacing}
                        color="primary"
                      />
                    </IconButton>
                  </ChplTooltip>
                </TableCell>
                <TableCell>{criterion.gap ? 'True' : 'False'}</TableCell>
              </TableRow>
            )}
          { criterion.success && criterion.svaps?.length > 0
            && (
              <TableRow key="svap">
                <TableCell component="th" scope="row">
                  Standards Version Advancement Process
                  <ChplTooltip title="Standards Version Advancement Process (SVAP) is a process to enable health IT developers’ ability to incorporate newer versions of Secretary-adopted standards and implementation specification">
                    <IconButton>
                      <InfoIcon
                        className={classes.iconSpacing}
                        color="primary"
                      />
                    </IconButton>
                  </ChplTooltip>
                </TableCell>
                <TableCell>
                  <ul className={classes.unindentedData}>
                    { criterion.svaps.map((svap, index) => (
                      <li key={svap.id || svap.key || index}>
                        <ChplEllipsis text={`${(svap.replaced ? 'Replaced | ' : '') + svap.regulatoryTextCitation} ${svap.approvedStandardVersion}`} maxLength={100} wordBoundaries />
                        { svap.replaced
                          && (
                            <ChplTooltip title="This version of the adopted standard or implementation specification is approved for use under previous SVAP flexibility, but please note a newer SVAP version is now available for use in the Program.">
                              <IconButton>
                                <InfoIcon
                                  className={classes.iconSpacing}
                                  color="primary"
                                />
                              </IconButton>
                            </ChplTooltip>
                          )}
                      </li>
                    ))}
                  </ul>
                </TableCell>
              </TableRow>
            )}
          { showOptionalStandardsSection()
            && (
              <TableRow key="optionalStandards">
                <TableCell component="th" scope="row">
                  Optional Standard
                  <ChplTooltip title="The standard(s) used to meet a certification criterion where additional, optional standards are permitted.">
                    <IconButton>
                      <InfoIcon
                        className={classes.iconSpacing}
                        color="primary"
                      />
                    </IconButton>
                  </ChplTooltip>
                </TableCell>
                <TableCell>
                  { criterion.optionalStandards?.length > 0
                    && (
                      <ul className={classes.unindentedData}>
                        { criterion.optionalStandards.map((os, index) => (
                          <li key={os.id || os.key || index}>
                            <ChplEllipsis text={os.description || os.citation} maxLength={100} wordBoundaries />
                          </li>
                        ))}
                      </ul>
                    )}
                  { criterion.testStandards?.length > 0
                    && (
                      <ul className={classes.unindentedData}>
                        { criterion.testStandards.map((ts, index) => (
                          <li key={ts.id || ts.key || index}>
                            { ts.testStandardDescription
                              && <ChplEllipsis text={ts.testStandardDescription} maxLength={100} wordBoundaries />}
                            { !ts.testStandardDescription && ts.testStandardName }
                          </li>
                        ))}
                      </ul>
                    )}
                </TableCell>
              </TableRow>
            )}
          { criterion.g1Success !== null
            && (
              <TableRow key="g1Success">
                <TableCell component="th" scope="row">
                  Measure Successfully Tested for G1
                  <ChplTooltip title="The CMS measure and provider type tested for the automated numerator recording certification criterion (&sect; 170.314(g)(1)).">
                    <IconButton>
                      <InfoIcon
                        className={classes.iconSpacing}
                        color="primary"
                      />
                    </IconButton>
                  </ChplTooltip>
                </TableCell>
                <TableCell>{criterion.g1Success ? 'True' : 'False'}</TableCell>
              </TableRow>
            )}
          { criterion.g2Success !== null
            && (
              <TableRow key="g2Success">
                <TableCell component="th" scope="row">
                  Measure Successfully Tested for G2
                  <ChplTooltip title="The CMS measure and provider type tested for the automated numerator recording certification criterion (&sect; 170.314(g)(2)).">
                    <IconButton>
                      <InfoIcon
                        className={classes.iconSpacing}
                        color="primary"
                      />
                    </IconButton>
                  </ChplTooltip>
                </TableCell>
                <TableCell>{criterion.g2Success ? 'True' : 'False'}</TableCell>
              </TableRow>
            )}
          { criterion.success && criterion.testFunctionality
            && (
              <TableRow key="testFunctionality">
                <TableCell component="th" scope="row">
                  Functionality Tested
                  <ChplTooltip title="Any optional, alternative, ambulatory, or inpatient capabilities within a certification criterion to which the product was tested and certified. Applies to 2015 Edition certification only.">
                    <IconButton>
                      <InfoIcon
                        className={classes.iconSpacing}
                        color="primary"
                      />
                    </IconButton>
                  </ChplTooltip>
                </TableCell>
                <TableCell>
                  { criterion.testFunctionality.length > 0
                    && (
                      <ul className={classes.unindentedData}>
                        { criterion.testFunctionality.map((tf, index) => (
                          <li key={tf.id || tf.key || index}>
                            { tf.description
                              && <ChplEllipsis text={tf.description} maxLength={100} wordBoundaries />}
                            { !tf.description && tf.name }
                          </li>
                        ))}
                      </ul>
                    )}
                  { criterion.testFunctionality.length === 0 && 'None' }
                </TableCell>
              </TableRow>
            )}
          { criterion.success && criterion.testProcedures
            && (
              <TableRow key="testProcedures">
                <TableCell component="th" scope="row">
                  Test Procedure
                  <ChplTooltip title="The type of test procedure and the version used during testing of the certification criterion functionality.">
                    <IconButton color="primary">
                      <InfoIcon
                        className={classes.iconSpacing}
                        color="primary"
                      />
                    </IconButton>
                  </ChplTooltip>
                </TableCell>
                <TableCell>
                  { criterion.testProcedures.length > 0
                    && (
                      <ul className={classes.unindentedData}>
                        { criterion.testProcedures.map((tp, index) => (
                          <li key={tp.id || tp.key || index}>
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
                  { criterion.testProcedures.length === 0 && 'None' }
                </TableCell>
              </TableRow>
            )}
          { criterion.success && (criterion.criterion.number === '170.315 (g)(4)' || criterion.criterion.number === '170.314 (g)(4)')
            && (
              <TableRow key="qms">
                <TableCell component="th" scope="row">
                  Quality Management System
                  <ChplTooltip title="If the corresponding certified product has a Quality Management System (QMS): 1) the standard or mapping used to meet the quality management system certification criterion, and 2) if a QMS standard or mapping was modified, documentation on the changes made. Specific requirements for 2015 Edition are different than for 2014 Edition.">
                    <IconButton>
                      <InfoIcon
                        className={classes.iconSpacing}
                        color="primary"
                      />
                    </IconButton>
                  </ChplTooltip>
                </TableCell>
                <TableCell>
                  { qmsStandards?.length > 0
                    && (
                      <ul className={classes.unindentedData}>
                        { qmsStandards.map((qms, index) => (
                          <li key={qms.id || index}>
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
          { criterion.success && criterion.criterion.number === '170.315 (g)(5)'
            && (
              <TableRow key="accessibility">
                <TableCell component="th" scope="row">
                  Accessibility Standard
                  <ChplTooltip title="The standard(s) used to meet the accessibility-centered design certification criterion or developer attestation that no accessibility-centered design was employed. Applies to 2015 Edition certification only.">
                    <IconButton>
                      <InfoIcon
                        className={classes.iconSpacing}
                        color="primary"
                      />
                    </IconButton>
                  </ChplTooltip>
                </TableCell>
                <TableCell>
                  { accessibilityStandards?.length > 0
                    && (
                      <ul className={classes.unindentedData}>
                        { accessibilityStandards.map((std, index) => (
                          <li key={std.id || index}>
                            { std.accessibilityStandardName }
                          </li>
                        ))}
                      </ul>
                    )}
                  { (!accessibilityStandards || accessibilityStandards.length === 0) && 'N/A' }
                </TableCell>
              </TableRow>
            )}
          { criterion.success && criterion.testToolsUsed
            && (
              <TableRow key="testToolsUsed">
                <TableCell component="th" scope="row">
                  Test Tool
                  <ChplTooltip title="The name and version of the test tool used during testing of the certification criterion functionality.">
                    <IconButton>
                      <InfoIcon
                        className={classes.iconSpacing}
                        color="primary"
                      />
                    </IconButton>
                  </ChplTooltip>
                </TableCell>
                <TableCell>
                  { criterion.testToolsUsed.length > 0
                    && (
                      <ul className={classes.unindentedData}>
                        { criterion.testToolsUsed.map((tt, index) => (
                          <li key={tt.id || tt.key || index}>
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
                  { criterion.testToolsUsed.length === 0 && 'None' }
                </TableCell>
              </TableRow>
            )}
          { criterion.success && criterion.testDataUsed
            && (
              <TableRow key="testDataUsed">
                <TableCell component="th" scope="row">
                  Test Data
                  <ChplTooltip title="The test data version and any alterations or modifications to the ONC-approved test data. It is an optional field except for the products testing for automated numerator recording (&sect;170.314(g)(1) or &sect;170.315(g)(1)) and automated measure calculation (&sect; 170.314(g)(2) or &sect;170.315(g)(2)). For those products, the field is required.">
                    <IconButton>
                      <InfoIcon
                        className={classes.iconSpacing}
                        color="primary"
                      />
                    </IconButton>
                  </ChplTooltip>
                </TableCell>
                <TableCell>
                  { criterion.testDataUsed.length > 0
                    && (
                      <ul className={classes.unindentedData}>
                        { criterion.testDataUsed.map((td, index) => (
                          <li key={td.id || td.key || index}>
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
                  { criterion.testDataUsed.length === 0 && 'None' }
                </TableCell>
              </TableRow>
            )}
          { criterion.success && criterion.apiDocumentation !== null
            && (
              <TableRow key="apiDocumentation">
                <TableCell component="th" scope="row">
                  API Documentation
                  <ChplTooltip title="The publicly accessible hyperlink that has the documentation used to meet the applicable API certification criteria (&sect; 170.315(g)(7) or &sect; 170.315(g)(8) or &sect; 170.315(g)(9)).">
                    <IconButton>
                      <InfoIcon
                        className={classes.iconSpacing}
                        color="primary"
                      />
                    </IconButton>
                  </ChplTooltip>
                </TableCell>
                <TableCell>
                  { criterion.apiDocumentation
                    && <ChplLink href={criterion.apiDocumentation} analytics={{ event: 'API Documentation', category: 'Download Details', label: criterion.apiDocumentation }} />}
                  { !criterion.apiDocumentation && 'None' }
                </TableCell>
              </TableRow>
            )}
          { criterion.success && criterion.exportDocumentation !== null
            && (
              <TableRow key="exportDocumentation">
                <TableCell component="th" scope="row">
                  Export Documentation
                  <ChplTooltip title="The publicly accessible hyperlink of the export’s format used to support the EHI export criterion (&sect; 170.315(b)(10))">
                    <IconButton>
                      <InfoIcon
                        className={classes.iconSpacing}
                        color="primary"
                      />
                    </IconButton>
                  </ChplTooltip>
                </TableCell>
                <TableCell>
                  { criterion.exportDocumentation
                    && <ChplLink href={criterion.exportDocumentation} analytics={{ event: 'Export Documentation', category: 'Download Details', label: criterion.exportDocumentation }} />}
                  { !criterion.exportDocumentation && 'None' }
                </TableCell>
              </TableRow>
            )}
          { criterion.success && criterion.attestationAnswer !== null
            && (
              <TableRow key="attestationAnswer">
                <TableCell component="th" scope="row">
                  Attestation
                  <ChplTooltip title="Indicates whether certified health IT supports the applicable privacy and security transparency attestation criteria (&sect; 170.315(d)(12) or &sect; 170.315(d)(13))">
                    <IconButton>
                      <InfoIcon
                        className={classes.iconSpacing}
                        color="primary"
                      />
                    </IconButton>
                  </ChplTooltip>
                </TableCell>
                <TableCell>{criterion.attestationAnswer ? 'Yes' : 'No'}</TableCell>
              </TableRow>
            )}
          { criterion.success && criterion.documentationUrl !== null
            && (
              <TableRow key="documentationUrl">
                <TableCell component="th" scope="row">
                  Documentation
                  <ChplTooltip title="Optional documentation for the Attestation to the applicable privacy and security transparency attestation criteria (&sect; 170.315(d)(12) or &sect; 170.315(d)(13))">
                    <IconButton>
                      <InfoIcon
                        className={classes.iconSpacing}
                        color="primary"
                      />
                    </IconButton>
                  </ChplTooltip>
                </TableCell>
                <TableCell>
                  { criterion.documentationUrl
                    && <ChplLink href={criterion.documentationUrl} analytics={{ event: 'Documentation', category: 'Download Details', label: criterion.documentationUrl }} />}
                  { !criterion.documentationUrl && 'None' }
                </TableCell>
              </TableRow>
            )}
          { criterion.success && criterion.useCases !== null && criterion.attestationAnswer
            && (
              <TableRow key="useCases">
                <TableCell component="th" scope="row">
                  Use Case(s)
                  <ChplTooltip title="Use cases supported as applicable to meet the multi-factor authentication criterion (&sect; 170.315(d)(13))">
                    <IconButton>
                      <InfoIcon
                        className={classes.iconSpacing}
                        color="primary"
                      />
                    </IconButton>
                  </ChplTooltip>
                </TableCell>
                <TableCell>
                  { criterion.useCases
                    && <ChplLink href={criterion.useCases} analytics={{ event: 'Use Cases', category: 'Download Details', label: criterion.useCases }} />}
                  { !criterion.useCases && 'None' }
                </TableCell>
              </TableRow>
            )}
          { criterion.success && criterion.serviceBaseUrlList !== null
            && (
              <TableRow key="serviceBaseUrlList">
                <TableCell component="th" scope="row">
                  Service Base URL List
                  <ChplTooltip title="The publicly accessible hyperlink to the list of service base URLs for a Health IT Module certified to &sect; 170.315(g)(10) that can be used by patients to access their electronic health information.">
                    <IconButton>
                      <InfoIcon
                        className={classes.iconSpacing}
                        color="primary"
                      />
                    </IconButton>
                  </ChplTooltip>
                </TableCell>
                <TableCell>
                  { criterion.serviceBaseUrlList
                    && <ChplLink href={criterion.serviceBaseUrlList} analytics={{ event: 'Service Base URL List', category: 'Download Details', label: criterion.serviceBaseUrlList }} />}
                  { !criterion.serviceBaseUrlList && 'None' }
                </TableCell>
              </TableRow>
            )}
          { criterion.success && criterion.privacySecurityFramework !== null
            && (
              <TableRow key="privacySecurityFramework">
                <TableCell component="th" scope="row">
                  Privacy &amp; Security Framework
                  <ChplTooltip title="The approach by which the criteria addressed the Privacy and Security requirements (Approach 1 – functional demonstration or Approach 2 – documentation of integration). ">
                    <IconButton>
                      <InfoIcon
                        className={classes.iconSpacing}
                        color="primary"
                      />
                    </IconButton>
                  </ChplTooltip>
                </TableCell>
                <TableCell>{criterion.privacySecurityFramework}</TableCell>
              </TableRow>
            )}
          { criterion.success && criterion.sed !== null
            && (
              <TableRow key="sed">
                <TableCell component="th" scope="row">
                  SED
                  <ChplTooltip title="The corresponding certification criteria met safety-enhanced design attestation during certification testing (True or False). Specific requirements for 2015 Edition are different than for 2014 Edition.">
                    <IconButton>
                      <InfoIcon
                        className={classes.iconSpacing}
                        color="primary"
                      />
                    </IconButton>
                  </ChplTooltip>
                </TableCell>
                <TableCell>{criterion.sed ? 'True' : 'False'}</TableCell>
              </TableRow>
            )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ChplCriterionDetailsView;

ChplCriterionDetailsView.propTypes = {
  criterion: certificationResult.isRequired,
  accessibilityStandards: arrayOf(accessibilityStandard).isRequired,
  qmsStandards: arrayOf(qmsStandard).isRequired,
};
