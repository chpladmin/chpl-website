import React, { useState } from 'react';
import { arrayOf, object } from 'prop-types';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';

import { getAngularService } from '.';
import { ChplEllipsis, ChplLink, ChplTooltip } from '../../../util';
import { ChplReliedUponSoftwareView } from './relied-upon-software';
import { accessibilityStandard, qmsStandard } from '../../../../shared/prop-types';

function ChplCriterionDetailsView(props) {
  const [criterion] = useState(props.criterion);
  const [qmsStandards] = useState(props.qmsStandards);
  const [accessibilityStandards] = useState(props.accessibilityStandards);
  const $analytics = getAngularService('$analytics');

  return (
    <Grid item xs={12}>
      <TableContainer component={Paper}>
        <Table aria-label="Criterion Details Table">
          <TableHead>
            <TableRow>
              <TableCell>Attribute</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { criterion.additionalSoftware?.length > 0
              && (
                <TableRow key="additionalSoftware">
                  <TableCell component="th" scope="row">
                    Relied Upon Software
                    <ChplTooltip title="Software relied upon by the product to demonstrate its compliance with a certification criterion or criterion.">
                      <InfoOutlinedIcon />
                    </ChplTooltip>
                  </TableCell>
                  <TableCell><ChplReliedUponSoftwareView sw={criterion.additionalSoftware} /></TableCell>
                </TableRow>
              )}
            { criterion.gap !== null
              && (
                <TableRow key="gap">
                  <TableCell component="th" scope="row">
                    Gap
                    <ChplTooltip title="The corresponding certification criterion are gap certified (True or False).">
                      <InfoOutlinedIcon />
                    </ChplTooltip>
                  </TableCell>
                  <TableCell>{criterion.gap ? 'True' : 'False'}</TableCell>
                </TableRow>
              )}
            { criterion.svaps?.length > 0
              && (
                <TableRow key="svap">
                  <TableCell component="th" scope="row">
                    Standards Version Advancement Process
                    <ChplTooltip title="Standards Version Advancement Process (SVAP) is a process to enable health IT developers’ ability to incorporate newer versions of Secretary-adopted standards and implementation specification">
                      <InfoOutlinedIcon />
                    </ChplTooltip>
                  </TableCell>
                  <TableCell>
                    <ul>
                      { criterion.svaps.map((svap) => (
                        <li key={svap.id || svap.key}>
                          <ChplEllipsis text={`${(svap.replaced ? 'Replaced | ' : '') + svap.regulatoryTextCitation} ${svap.approvedStandardVersion}`} maxLength={100} wordBoundaries />
                          { svap.replaced
                            && (
                              <ChplTooltip title="This version of the adopted standard or implementation specification is approved for use under previous SVAP flexibility, but please note a newer SVAP version is now available for use in the Program.">
                                <InfoOutlinedIcon />
                              </ChplTooltip>
                            )}
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                </TableRow>
              )}
            { criterion.testStandards
              && (
                <TableRow key="optionalStandards">
                  <TableCell component="th" scope="row">
                    Optional Standard
                    <ChplTooltip title="The standard(s) used to meet a certification criterion where additional, optional standards are permitted.">
                      <InfoOutlinedIcon />
                    </ChplTooltip>
                  </TableCell>
                  <TableCell>
                    { criterion.testStandards.length > 0
                      && (
                        <ul>
                          { criterion.testStandards.map((ts) => (
                            <li key={ts.id || ts.key}>
                              { ts.testStandardDescription
                                && <ChplEllipsis text={ts.testStandardDescription} maxLength={100} wordBoundaries />}
                              { !ts.testStandardDescription && ts.testStandardName }
                            </li>
                          ))}
                        </ul>
                      )}
                    { criterion.testStandards.length === 0 && 'None' }
                  </TableCell>
                </TableRow>
              )}
            { criterion.g1Success !== null
              && (
                <TableRow key="g1Success">
                  <TableCell component="th" scope="row">
                    Measure Successfully Tested for G1
                    <ChplTooltip title="The CMS measure and provider type tested for the automated numerator recording certification criterion (&sect; 170.314(g)(1)).">
                      <InfoOutlinedIcon />
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
                      <InfoOutlinedIcon />
                    </ChplTooltip>
                  </TableCell>
                  <TableCell>{criterion.g2Success ? 'True' : 'False'}</TableCell>
                </TableRow>
              )}
            { criterion.testFunctionality
              && (
                <TableRow key="testFunctionality">
                  <TableCell component="th" scope="row">
                    Functionality Tested
                    <ChplTooltip title="Any optional, alternative, ambulatory, or inpatient capabilities within a certification criterion to which the product was tested and certified. Applies to 2015 Edition certification only.">
                      <InfoOutlinedIcon />
                    </ChplTooltip>
                  </TableCell>
                  <TableCell>
                    { criterion.testFunctionality.length > 0
                      && (
                        <ul>
                          { criterion.testFunctionality.map((tf) => (
                            <li key={tf.id || tf.key}>
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
            { criterion.testProcedures
              && (
                <TableRow key="testProcedures">
                  <TableCell component="th" scope="row">
                    Test Procedure
                    <ChplTooltip title="The type of test procedure and the version used during testing of the certification criterion functionality.">
                      <InfoOutlinedIcon />
                    </ChplTooltip>
                  </TableCell>
                  <TableCell>
                    { criterion.testProcedures.length > 0
                      && (
                        <ul>
                          { criterion.testProcedures.map((tp) => (
                            <li key={tp.id || tp.key}>
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
            { (criterion.criterion.number === '170.315 (g)(4)' || criterion.criterion.number === '170.314 (g)(4)')
              && (
                <TableRow key="qms">
                  <TableCell component="th" scope="row">
                    Quality Management System
                    <ChplTooltip title="If the corresponding certified product has a Quality Management System (QMS): 1) the standard or mapping used to meet the quality management system certification criterion, and 2) if a QMS standard or mapping was modified, documentation on the changes made. Specific requirements for 2015 Edition are different than for 2014 Edition.">
                      <InfoOutlinedIcon />
                    </ChplTooltip>
                  </TableCell>
                  <TableCell>
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
            { criterion.criterion.number === '170.315 (g)(5)'
              && (
                <TableRow key="accessibility">
                  <TableCell component="th" scope="row">
                    Accessibility Standard
                    <ChplTooltip title="The standard(s) used to meet the accessibility-centered design certification criterion or developer attestation that no accessibility-centered design was employed. Applies to 2015 Edition certification only.">
                      <InfoOutlinedIcon />
                    </ChplTooltip>
                  </TableCell>
                  <TableCell>
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
            { criterion.testToolsUsed
              && (
                <TableRow key="testToolsUsed">
                  <TableCell component="th" scope="row">
                    Test Tool
                    <ChplTooltip title="The name and version of the test tool used during testing of the certification criterion functionality.">
                      <InfoOutlinedIcon />
                    </ChplTooltip>
                  </TableCell>
                  <TableCell>
                    { criterion.testToolsUsed.length > 0
                      && (
                        <ul>
                          { criterion.testToolsUsed.map((tt) => (
                            <li key={tt.id || tt.key}>
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
            { criterion.testDataUsed
              && (
                <TableRow key="testDataUsed">
                  <TableCell component="th" scope="row">
                    Test Data
                    <ChplTooltip title="The test data version and any alterations or modifications to the ONC-approved test data. It is an optional field except for the products testing for automated numerator recording (&sect;170.314(g)(1) or &sect;170.315(g)(1)) and automated measure calculation (&sect; 170.314(g)(2) or &sect;170.315(g)(2)). For those products, the field is required.">
                      <InfoOutlinedIcon />
                    </ChplTooltip>
                  </TableCell>
                  <TableCell>
                    { criterion.testDataUsed.length > 0
                      && (
                        <ul>
                          { criterion.testDataUsed.map((td) => (
                            <li key={td.id || td.key}>
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
            { criterion.apiDocumentation !== null
              && (
                <TableRow key="apiDocumentation">
                  <TableCell component="th" scope="row">
                    API Documentation
                    <ChplTooltip title="The publicly accessible hyperlink that has the documentation used to meet the applicable API certification criteria (&sect; 170.315(g)(7) or &sect; 170.315(g)(8) or &sect; 170.315(g)(9)).">
                      <InfoOutlinedIcon />
                    </ChplTooltip>
                  </TableCell>
                  <TableCell>
                    { criterion.apiDocumentation
                      && <ChplLink href={criterion.apiDocumentation} text={criterion.apiDocumentation} analytics={{ event: 'API Documentation', category: 'Download Details', label: criterion.apiDocumentation }} />}
                    { !criterion.apiDocumentation && 'None' }
                  </TableCell>
                </TableRow>
              )}
            { criterion.exportDocumentation !== null
              && (
                <TableRow key="exportDocumentation">
                  <TableCell component="th" scope="row">
                    Export Documentation
                    <ChplTooltip title="The publicly accessible hyperlink of the export’s format used to support the EHI export criterion (&sect; 170.315(b)(10))">
                      <InfoOutlinedIcon />
                    </ChplTooltip>
                  </TableCell>
                  <TableCell>
                    { criterion.exportDocumentation
                      && <ChplLink href={criterion.exportDocumentation} text={criterion.exportDocumentation} analytics={{ event: 'Export Documentation', category: 'Download Details', label: criterion.exportDocumentation }} />}
                    { !criterion.exportDocumentation && 'None' }
                  </TableCell>
                </TableRow>
              )}
            { criterion.attestationAnswer !== null
              && (
                <TableRow key="attestationAnswer">
                  <TableCell component="th" scope="row">
                    Attestation
                    <ChplTooltip title="Indicates whether certified health IT supports the applicable privacy and security transparency attestation criteria (&sect; 170.315(d)(12) or &sect; 170.315(d)(13))">
                      <InfoOutlinedIcon />
                    </ChplTooltip>
                  </TableCell>
                  <TableCell>{criterion.attestationAnswer ? 'Yes' : 'No'}</TableCell>
                </TableRow>
              )}
            { criterion.documentationUrl !== null
              && (
                <TableRow key="documentationUrl">
                  <TableCell component="th" scope="row">
                    Documentation
                    <ChplTooltip title="Optional documentation for the Attestation to the applicable privacy and security transparency attestation criteria (&sect; 170.315(d)(12) or &sect; 170.315(d)(13))">
                      <InfoOutlinedIcon />
                    </ChplTooltip>
                  </TableCell>
                  <TableCell>
                    { criterion.documentationUrl
                      && <ChplLink href={criterion.documentationUrl} text={criterion.documentationUrl} analytics={{ event: 'Documentation', category: 'Download Details', label: criterion.documentationUrl }} />}
                    { !criterion.documentationUrl && 'None' }
                  </TableCell>
                </TableRow>
              )}
            { criterion.useCases !== null && criterion.attestationAnswer
              && (
                <TableRow key="useCases">
                  <TableCell component="th" scope="row">
                    Use Case(s)
                    <ChplTooltip title="Use cases supported as applicable to meet the multi-factor authentication criterion (&sect; 170.315(d)(13))">
                      <InfoOutlinedIcon />
                    </ChplTooltip>
                  </TableCell>
                  <TableCell>
                    { criterion.useCases
                      && <ChplLink href={criterion.useCases} text={criterion.useCases} analytics={{ event: 'Use Cases', category: 'Download Details', label: criterion.useCases }} />}
                    { !criterion.useCases && 'None' }
                  </TableCell>
                </TableRow>
              )}
            { criterion.privacySecurityFramework !== null
              && (
                <TableRow key="privacySecurityFramework">
                  <TableCell component="th" scope="row">
                    Privacy &amp; Security Framework
                    <ChplTooltip title="The approach by which the criteria addressed the Privacy and Security requirements (Approach 1 – functional demonstration or Approach 2 – documentation of integration). ">
                      <InfoOutlinedIcon />
                    </ChplTooltip>
                  </TableCell>
                  <TableCell>{criterion.privacySecurityFramework}</TableCell>
                </TableRow>
              )}
            { criterion.sed !== null
              && (
                <TableRow key="sed">
                  <TableCell component="th" scope="row">
                    SED
                    <ChplTooltip title="The corresponding certification criteria met safety-enhanced design attestation during certification testing (True or False). Specific requirements for 2015 Edition are different than for 2014 Edition.">
                      <InfoOutlinedIcon />
                    </ChplTooltip>
                  </TableCell>
                  <TableCell>{criterion.sed ? 'True' : 'False'}</TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
}

export default ChplCriterionDetailsView;

ChplCriterionDetailsView.propTypes = {
  criterion: object.isRequired,
  accessibilityStandards: arrayOf(accessibilityStandard).isRequired,
  qmsStandards: arrayOf(qmsStandard).isRequired,
};
