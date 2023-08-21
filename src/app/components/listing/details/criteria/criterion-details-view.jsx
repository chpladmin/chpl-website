import React from 'react';
import {
  Card,
  IconButton,
  List,
  ListItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  makeStyles,
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import { arrayOf } from 'prop-types';

import ChplReliedUponSoftwareView from './relied-upon-software/relied-upon-software-view';

import { ChplEllipsis, ChplLink, ChplTooltip } from 'components/util';
import {
  accessibilityStandard,
  certificationResult,
  qmsStandard,
} from 'shared/prop-types';

const useStyles = makeStyles({
  infoIcon: {
    float: 'right',
  },
  infoIconColor: {
    color: '#156dac',
  },
});

function ChplCriterionDetailsView(props) {
  const { criterion, qmsStandards, accessibilityStandards } = props;
  const classes = useStyles();

  if (criterion.criterion.certificationEdition === '2011') {
    return null;
  }

  const showOptionalStandardsSection = () => criterion.success
        && ((criterion.optionalStandards?.length > 0)
            || (criterion.testStandards?.length > 0 && criterion.optionalStandards));

  return (
    <Card>
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
                  <ChplTooltip title="Software relied upon by the product to demonstrate its compliance with a certification criterion or criteria.">
                    <IconButton className={classes.infoIcon}>
                      <InfoIcon
                        className={classes.infoIconColor}
                      />
                    </IconButton>
                  </ChplTooltip>
                  Relied Upon Software
                </TableCell>
                <TableCell><ChplReliedUponSoftwareView sw={criterion.additionalSoftware} /></TableCell>
              </TableRow>
            )}
            { criterion.success && criterion.gap !== null
            && (
              <TableRow key="gap">
                <TableCell component="th" scope="row">
                  <ChplTooltip title="The corresponding certification criterion are gap certified (True or False).">
                    <IconButton className={classes.infoIcon}>
                      <InfoIcon
                        className={classes.infoIconColor}
                      />
                    </IconButton>
                  </ChplTooltip>
                  Gap
                </TableCell>
                <TableCell>{criterion.gap ? 'True' : 'False'}</TableCell>
              </TableRow>
            )}
            { criterion.success && criterion.svaps?.length > 0
            && (
              <TableRow key="svap">
                <TableCell component="th" scope="row">
                  <ChplTooltip title="Standards Version Advancement Process (SVAP) is a process to enable health IT developers’ ability to incorporate newer versions of Secretary-adopted standards and implementation specification">
                    <IconButton className={classes.infoIcon}>
                      <InfoIcon
                        className={classes.infoIconColor}
                      />
                    </IconButton>
                  </ChplTooltip>
                  Standards Version Advancement Process
                </TableCell>
                <TableCell>
                  <List>
                    { criterion.svaps.map((svap, index) => (
                      <ListItem key={svap.id || svap.key || index}>
                        { svap.replaced
                          && (
                            <ChplTooltip title="This version of the adopted standard or implementation specification is approved for use under previous SVAP flexibility, but please note a newer SVAP version is now available for use in the Program.">
                              <IconButton className={classes.infoIcon}>
                                <InfoIcon
                                  className={classes.infoIconColor}
                                />
                              </IconButton>
                            </ChplTooltip>
                          )}
                        <ChplEllipsis text={`${(svap.replaced ? 'Replaced | ' : '') + svap.regulatoryTextCitation} ${svap.approvedStandardVersion}`} maxLength={100} wordBoundaries />
                      </ListItem>
                    ))}
                  </List>
                </TableCell>
              </TableRow>
            )}
            { showOptionalStandardsSection()
            && (
              <TableRow key="optionalStandards">
                <TableCell component="th" scope="row">
                  <ChplTooltip title="The standard(s) used to meet a certification criterion where additional, optional standards are permitted.">
                    <IconButton className={classes.infoIcon}>
                      <InfoIcon
                        className={classes.infoIconColor}
                      />
                    </IconButton>
                  </ChplTooltip>
                  Optional Standard
                </TableCell>
                <TableCell>
                  { criterion.optionalStandards?.length > 0
                    && (
                      <List>
                        { criterion.optionalStandards.map((os, index) => (
                          <ListItem key={os.id || os.key || index}>
                            <ChplEllipsis text={os.description || os.citation} maxLength={100} wordBoundaries />
                          </ListItem>
                        ))}
                      </List>
                    )}
                  { criterion.testStandards?.length > 0
                    && (
                      <List>
                        { criterion.testStandards.map((ts, index) => (
                          <ListItem key={ts.id || ts.key || index}>
                            { ts.testStandardDescription
                              && <ChplEllipsis text={ts.testStandardDescription} maxLength={100} wordBoundaries />}
                            { !ts.testStandardDescription && ts.testStandardName }
                          </ListItem>
                        ))}
                      </List>
                    )}
                </TableCell>
              </TableRow>
            )}
            { criterion.g1Success !== null
            && (
              <TableRow key="g1Success">
                <TableCell component="th" scope="row">
                  <ChplTooltip title="The CMS measure and provider type tested for the automated numerator recording certification criterion (&sect; 170.314(g)(1)).">
                    <IconButton className={classes.infoIcon}>
                      <InfoIcon
                        className={classes.infoIconColor}
                      />
                    </IconButton>
                  </ChplTooltip>
                  Measure Successfully Tested for G1
                </TableCell>
                <TableCell>{criterion.g1Success ? 'True' : 'False'}</TableCell>
              </TableRow>
            )}
            { criterion.g2Success !== null
            && (
              <TableRow key="g2Success">
                <TableCell component="th" scope="row">
                  <ChplTooltip title="The CMS measure and provider type tested for the automated numerator recording certification criterion (&sect; 170.314(g)(2)).">
                    <IconButton className={classes.infoIcon}>
                      <InfoIcon
                        className={classes.infoIconColor}
                      />
                    </IconButton>
                  </ChplTooltip>
                  Measure Successfully Tested for G2
                </TableCell>
                <TableCell>{criterion.g2Success ? 'True' : 'False'}</TableCell>
              </TableRow>
            )}
            { criterion.success && criterion.functionalitiesTested
            && (
              <TableRow key="functionalitiesTested">
                <TableCell component="th" scope="row">
                  <ChplTooltip title="Any optional, alternative, ambulatory, or inpatient capabilities within a certification criterion to which the product was tested and certified. Applies to 2015 Edition certification only.">
                    <IconButton className={classes.infoIcon}>
                      <InfoIcon
                        className={classes.infoIconColor}
                      />
                    </IconButton>
                  </ChplTooltip>
                  Functionality Tested
                </TableCell>
                <TableCell>
                  { criterion.functionalitiesTested.length > 0
                    && (
                      <List>
                        { criterion.functionalitiesTested.map((ft, index) => (
                          <ListItem key={ft.id || ft.key || index}>
                            { ft.functionalityTested.value
                              && <ChplEllipsis text={ft.functionalityTested.value} maxLength={100} wordBoundaries />}
                            { !ft.functionalityTested.value && ft.functionalityTested.regulatoryTextCitation }
                          </ListItem>
                        ))}
                      </List>
                    )}
                  { criterion.functionalitiesTested.length === 0 && 'None' }
                </TableCell>
              </TableRow>
            )}
            { criterion.success && criterion.conformanceMethods
            && (
              <TableRow key="conformanceMethods">
                <TableCell component="th" scope="row">
                  <ChplTooltip title="The method used to evaluate compliance with the certification criterion. For the Test Procedure method, this also includes the version used during testing of the certification criterion functionality.">
                    <IconButton className={classes.infoIcon}>
                      <InfoIcon
                        className={classes.infoIconColor}
                      />
                    </IconButton>
                  </ChplTooltip>
                  Conformance Method
                </TableCell>
                <TableCell>
                  { criterion.conformanceMethods.length > 0
                    && (
                      <List>
                        { criterion.conformanceMethods.map((cm, index) => (
                          <ListItem key={cm.id || cm.key || index} className={cm.conformanceMethod.removed ? 'removed' : ''}>
                            Name:
                            {' '}
                            {`${cm.conformanceMethod.removed ? 'Removed | ' : ''} ${cm.conformanceMethod.name}`}
                            { cm.conformanceMethod.name !== 'Attestation'
                              && (
                                <>
                                  ; Version:
                                  {' '}
                                  { cm.conformanceMethodVersion }
                                </>
                              )}
                          </ListItem>
                        ))}
                      </List>
                    )}
                  { criterion.conformanceMethods.length === 0 && 'None' }
                </TableCell>
              </TableRow>
            )}
            { criterion.success && !criterion.conformanceMethods
            && (
              <TableRow key="testProcedures">
                <TableCell component="th" scope="row">
                  <ChplTooltip title="The type of test procedure and the version used during testing of the certification criterion functionality.">
                    <IconButton className={classes.infoIcon}>
                      <InfoIcon
                        className={classes.infoIconColor}
                      />
                    </IconButton>
                  </ChplTooltip>
                  Test Procedure
                </TableCell>
                <TableCell>
                  { criterion.testProcedures.length > 0
                    && (
                      <List>
                        { criterion.testProcedures.map((tp, index) => (
                          <ListItem key={tp.id || tp.key || index}>
                            Name:
                            {' '}
                            { tp.testProcedure.name }
                            ; Version:
                            {' '}
                            { tp.testProcedureVersion }
                          </ListItem>
                        ))}
                      </List>
                    )}
                  { criterion.testProcedures.length === 0 && 'None' }
                </TableCell>
              </TableRow>
            )}
            { criterion.success && (criterion.criterion.number === '170.315 (g)(4)' || criterion.criterion.number === '170.314 (g)(4)')
            && (
              <TableRow key="qms">
                <TableCell component="th" scope="row">
                  <ChplTooltip title="If the corresponding certified product has a Quality Management System (QMS): 1) the standard or mapping used to meet the quality management system certification criterion, and 2) if a QMS standard or mapping was modified, documentation on the changes made. Specific requirements for 2015 Edition are different than for 2014 Edition.">
                    <IconButton className={classes.infoIcon}>
                      <InfoIcon
                        className={classes.infoIconColor}
                      />
                    </IconButton>
                  </ChplTooltip>
                  Quality Management System
                </TableCell>
                <TableCell>
                  { qmsStandards?.length > 0
                    && (
                      <List>
                        { qmsStandards.map((qms, index) => (
                          <ListItem key={qms.id || index}>
                            <div>
                              <strong>Standard:</strong>
                              {' '}
                              { qms.qmsStandardName }
                              <br />
                              <strong>Description:</strong>
                              {' '}
                              { qms.qmsModification
                                && <ChplEllipsis text={qms.qmsModification} maxLength={32} wordBoundaries />}
                              { !qms.qmsModification
                                && <>N/A</>}
                              <br />
                              <strong>Applicable Criteria:</strong>
                              {' '}
                              { qms.applicableCriteria || 'N/A' }
                            </div>
                          </ListItem>
                        ))}
                      </List>
                    )}
                  { (!qmsStandards || qmsStandards.length === 0) && 'N/A' }
                </TableCell>
              </TableRow>
            )}
            { criterion.success && criterion.criterion.number === '170.315 (g)(5)'
            && (
              <TableRow key="accessibility">
                <TableCell component="th" scope="row">
                  <ChplTooltip title="The standard(s) used to meet the accessibility-centered design certification criterion or developer attestation that no accessibility-centered design was employed. Applies to 2015 Edition certification only.">
                    <IconButton className={classes.infoIcon}>
                      <InfoIcon
                        className={classes.infoIconColor}
                      />
                    </IconButton>
                  </ChplTooltip>
                  Accessibility Standard
                </TableCell>
                <TableCell>
                  { accessibilityStandards?.length > 0
                    && (
                      <List>
                        { accessibilityStandards.map((std, index) => (
                          <ListItem key={std.id || index}>
                            { std.accessibilityStandardName }
                          </ListItem>
                        ))}
                      </List>
                    )}
                  { (!accessibilityStandards || accessibilityStandards.length === 0) && 'N/A' }
                </TableCell>
              </TableRow>
            )}
            { criterion.success && criterion.testToolsUsed
            && (
              <TableRow key="testToolsUsed">
                <TableCell component="th" scope="row">
                  <ChplTooltip title="The name and version of the test tool used during testing of the certification criterion functionality.">
                    <IconButton className={classes.infoIcon}>
                      <InfoIcon
                        className={classes.infoIconColor}
                      />
                    </IconButton>
                  </ChplTooltip>
                  Test Tool
                </TableCell>
                <TableCell>
                  { criterion.testToolsUsed.length > 0
                    && (
                      <List>
                        { criterion.testToolsUsed.map((tt, index) => (
                          <ListItem key={tt.id || tt.key || index}>
                            Tool:
                            {' '}
                            {tt.testTool.value}
                            ; Version:
                            {' '}
                            { tt.version || 'N/A' }
                          </ListItem>
                        ))}
                      </List>
                    )}
                  { criterion.testToolsUsed.length === 0 && 'None' }
                </TableCell>
              </TableRow>
            )}
            { criterion.success && criterion.testDataUsed
            && (
              <TableRow key="testDataUsed">
                <TableCell component="th" scope="row">
                  <ChplTooltip title="The test data version and any alterations or modifications to the ONC-approved test data. It is an optional field except for the products testing for automated numerator recording (&sect;170.314(g)(1) or &sect;170.315(g)(1)) and automated measure calculation (&sect; 170.314(g)(2) or &sect;170.315(g)(2)). For those products, the field is required.">
                    <IconButton className={classes.infoIcon}>
                      <InfoIcon
                        className={classes.infoIconColor}
                      />
                    </IconButton>
                  </ChplTooltip>
                  Test Data Used
                </TableCell>
                <TableCell>
                  { criterion.testDataUsed.length > 0
                    && (
                      <List>
                        { criterion.testDataUsed.map((td, index) => (
                          <ListItem key={td.id || td.key || index}>
                            Data:
                            {' '}
                            { td.testData.name || 'N/A' }
                            ; Version:
                            {' '}
                            { td.version }
                            ; Alteration:
                            {' '}
                            { td.alteration || 'N/A' }
                          </ListItem>
                        ))}
                      </List>
                    )}
                  { criterion.testDataUsed.length === 0 && 'None' }
                </TableCell>
              </TableRow>
            )}
            { criterion.success && criterion.apiDocumentation !== null
            && (
              <TableRow key="apiDocumentation">
                <TableCell component="th" scope="row">
                  <ChplTooltip title="The publicly accessible hyperlink to the required documentation used to meet the applicable API certification criteria (&sect;170.315(g)(7) through 170.315(g)(10)).">
                    <IconButton className={classes.infoIcon}>
                      <InfoIcon
                        className={classes.infoIconColor}
                      />
                    </IconButton>
                  </ChplTooltip>
                  API Documentation
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
                  <ChplTooltip title="The publicly accessible hyperlink of the export’s format used to support the EHI export criterion (&sect; 170.315(b)(10))">
                    <IconButton className={classes.infoIcon}>
                      <InfoIcon
                        className={classes.infoIconColor}
                      />
                    </IconButton>
                  </ChplTooltip>
                  Export Documentation
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
                  <ChplTooltip title="Indicates whether certified health IT supports the applicable privacy and security transparency attestation criteria (&sect; 170.315(d)(12) or &sect; 170.315(d)(13))">
                    <IconButton className={classes.infoIcon}>
                      <InfoIcon
                        className={classes.infoIconColor}
                      />
                    </IconButton>
                  </ChplTooltip>
                  Attestation
                </TableCell>
                <TableCell>{criterion.attestationAnswer ? 'Yes' : 'No'}</TableCell>
              </TableRow>
            )}
            { criterion.success && criterion.documentationUrl !== null
            && (
              <TableRow key="documentationUrl">
                <TableCell component="th" scope="row">
                  <ChplTooltip title="Optional documentation for the Attestation to the applicable privacy and security transparency attestation criteria (&sect; 170.315(d)(12) or &sect; 170.315(d)(13))">
                    <IconButton className={classes.infoIcon}>
                      <InfoIcon
                        className={classes.infoIconColor}
                      />
                    </IconButton>
                  </ChplTooltip>
                  Documentation
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
                  <ChplTooltip title="Use cases supported as applicable to meet the multi-factor authentication criterion (&sect; 170.315(d)(13))">
                    <IconButton className={classes.infoIcon}>
                      <InfoIcon
                        className={classes.infoIconColor}
                      />
                    </IconButton>
                  </ChplTooltip>
                  Use Case(s)
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
                  <ChplTooltip title="The publicly accessible hyperlink to the list of service base URLs for a Health IT Module certified to &sect; 170.315(g)(10) that can be used by patients to access their electronic health information.">
                    <IconButton className={classes.infoIcon}>
                      <InfoIcon
                        className={classes.infoIconColor}
                      />
                    </IconButton>
                  </ChplTooltip>
                  Service Base URL List
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
                  <ChplTooltip title="The approach by which the criteria addressed the Privacy and Security requirements (Approach 1 – functional demonstration or Approach 2 – documentation of integration). ">
                    <IconButton className={classes.infoIcon}>
                      <InfoIcon
                        className={classes.infoIconColor}
                      />
                    </IconButton>
                  </ChplTooltip>
                  Privacy &amp; Security Framework
                </TableCell>
                <TableCell>{criterion.privacySecurityFramework}</TableCell>
              </TableRow>
            )}
            { criterion.success && criterion.sed !== null
            && (
              <TableRow key="sed">
                <TableCell component="th" scope="row">
                  <ChplTooltip title="The corresponding certification criteria met safety-enhanced design attestation during certification testing (True or False). Specific requirements for 2015 Edition are different than for 2014 Edition.">
                    <IconButton className={classes.infoIcon}>
                      <InfoIcon
                        className={classes.infoIconColor}
                      />
                    </IconButton>
                  </ChplTooltip>
                  SED
                </TableCell>
                <TableCell>{criterion.sed ? 'True' : 'False'}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}

export default ChplCriterionDetailsView;

ChplCriterionDetailsView.propTypes = {
  criterion: certificationResult.isRequired,
  accessibilityStandards: arrayOf(accessibilityStandard).isRequired,
  qmsStandards: arrayOf(qmsStandard).isRequired,
};
