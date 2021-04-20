import React, { useState } from 'react';
import { arrayOf, object } from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  makeStyles,
  withStyles,
} from '@material-ui/core';

import theme from '../../../../themes/theme';
import { getAngularService } from './';
import { ChplEllipsis } from '../../../util/';

const ChplTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#000000',
    color: '#ffffff',
    boxShadow: theme.shadows[1],
    fontSize: '.8rem',
  },
}))(Tooltip);

const useStyles = makeStyles(() => ({
  NestedAccordionLevelOne: {
    borderRadius: '8px',
    display: 'grid',
  },
  infoIcon: {
    fontSize: '1rem',
  },
  NestedAccordionLevelOneSummary: {
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
  },
  NestedAccordionedEditModeLevelOneSummary: {
    backgroundColor: '#E0ECF9',
    borderRadius: '8px',
  },
  NestedAccordionLabel: {
    justifyContent: 'flex',
  },
  NestedAccordionLevelOneExpandedSummary: {
    backgroundColor: '#dddddd',
    borderRadius: '8px',
  },
  tableAcoordion: {
    overflowX: 'scroll',
  },
  iconSpacing: {
    marginLeft: '4px',
  },
}));

function ChplCriteriaView (props) {
  const [criteria] = useState(props.certificationResult);
  const [qmsStandards] = useState(props.qmsStandards);
  const [accessibilityStandards] = useState(props.accessibilityStandards);
  const $analytics = getAngularService('$analytics');
  const classes = useStyles();

  return (
    <ThemeProvider theme={ theme }>
      <Accordion disabled={!criteria.success} className={classes.NestedAccordionLevelOne}>
        <AccordionSummary
          className={classes.NestedAccordionLevelOneSummary}
          expandIcon={<ExpandMoreIcon />}
          id={criteria.id + '-header'}>
          <Grid container spacing={4}>
            <Grid item xs={1}>
              { criteria.success &&
                <Typography variant="subtitle1">
                  <DoneAllIcon size="small" />
                </Typography>
              }
            </Grid>
            <Grid item xs={3}>
              <Typography variant="subtitle1">
                { criteria.criterion.removed &&
                  <>
                    Removed |
                  </>
                }
                {criteria.criterion.number}
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography>
                {criteria.criterion.title}
              </Typography>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer component={Paper}>
            <Table aria-label="Criteria Details Table">
              <TableHead>
                <TableRow>
                  <TableCell>Attribute</TableCell>
                  <TableCell align="right">Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { criteria.gap !== null &&
                  <TableRow key="gap">
                    <TableCell component="th" scope="row">
                      Gap
                      <ChplTooltip title="The corresponding certification criteria are gap certified (True or False).">
                        <InfoOutlinedIcon className={classes.infoIcon} />
                      </ChplTooltip>
                    </TableCell>
                    <TableCell align="right">{criteria.gap ? 'True' : 'False'}</TableCell>
                  </TableRow>
                }
                { criteria.svaps?.length > 0 &&
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
                            <ChplEllipsis text={(svap.replaced ? 'Replaced | ' : '') + svap.regulatoryTextCitation + ' ' + svap.approvedStandardVersion} maxLength="100" wordBoundaries="true"/>
                            { svap.replaced &&
                              <ChplTooltip title="This version of the adopted standard or implementation specification is approved for use under previous SVAP flexibility, but please note a newer SVAP version is now available for use in the Program.">
                                <InfoOutlinedIcon className={classes.infoIcon} />
                              </ChplTooltip>
                            }
                          </li>
                        ))}
                      </ul>
                    </TableCell>
                  </TableRow>
                }
                { criteria.testStandards &&
                  <TableRow key="optionalStandards">
                    <TableCell component="th" scope="row">
                      Optional Standard
                      <ChplTooltip title="The standard(s) used to meet a certification criterion where additional, optional standards are permitted.">
                        <InfoOutlinedIcon className={classes.infoIcon} />
                      </ChplTooltip>
                    </TableCell>
                    <TableCell align="right">
                      { criteria.testStandards.length > 0 &&
                        <ul>
                          { criteria.testStandards.map((ts) => (
                            <li key={ts.id}>
                              { ts.testStandardDescription &&
                                <ChplEllipsis text={ts.testStandardDescription} maxLength={100} wordBoundaries={true}/>
                              }
                              { !ts.testStandardDescription && ts.testStandardName }
                            </li>
                          ))}
                        </ul>
                      }
                      { criteria.testStandards.length === 0 && 'None' }
                    </TableCell>
                  </TableRow>
                }
                { criteria.g1Success !== null &&
                  <TableRow key="g1Success">
                    <TableCell component="th" scope="row">
                      Measure Successfully Tested for G1
                      <ChplTooltip title="The CMS measure and provider type tested for the automated numerator recording certification criterion (&sect; 170.314(g)(1)).">
                        <InfoOutlinedIcon className={classes.infoIcon} />
                      </ChplTooltip>
                    </TableCell>
                    <TableCell align="right">{criteria.g1Success ? 'True' : 'False'}</TableCell>
                  </TableRow>
                }
                { criteria.g2Success !== null &&
                  <TableRow key="g2Success">
                    <TableCell component="th" scope="row">
                      Measure Successfully Tested for G2
                      <ChplTooltip title="The CMS measure and provider type tested for the automated numerator recording certification criterion (&sect; 170.314(g)(2)).">
                        <InfoOutlinedIcon className={classes.infoIcon} />
                      </ChplTooltip>
                    </TableCell>
                    <TableCell align="right">{criteria.g2Success ? 'True' : 'False'}</TableCell>
                  </TableRow>
                }
                { criteria.testFunctionality &&
                  <TableRow key="testFunctionality">
                    <TableCell component="th" scope="row">
                      Functionality Tested
                      <ChplTooltip title="Any optional, alternative, ambulatory, or inpatient capabilities within a certification criterion to which the product was tested and certified. Applies to 2015 Edition certification only.">
                        <InfoOutlinedIcon className={classes.infoIcon} />
                      </ChplTooltip>
                    </TableCell>
                    <TableCell align="right">
                      { criteria.testFunctionality.length > 0 &&
                        <ul>
                          { criteria.testFunctionality.map((tf) => (
                            <li key={tf.id}>
                              { tf.description &&
                                <ChplEllipsis text={tf.description} maxLength={100} wordBoundaries={true}/>
                              }
                              { !tf.description && tf.name }
                            </li>
                          ))}
                        </ul>
                      }
                      { criteria.testFunctionality.length === 0 && 'None' }
                    </TableCell>
                  </TableRow>
                }
                { criteria.testProcedures &&
                  <TableRow key="testProcedures">
                    <TableCell component="th" scope="row">
                      Test Procedure
                      <ChplTooltip title="The type of test procedure and the version used during testing of the certification criterion functionality.">
                        <InfoOutlinedIcon className={classes.infoIcon} />
                      </ChplTooltip>
                    </TableCell>
                    <TableCell align="right">
                      { criteria.testProcedures.length > 0 &&
                        <ul>
                          { criteria.testProcedures.map((tp) => (
                            <li key={tp.id}>
                              Name: { tp.testProcedure.name }; Version: { tp.testProcedureVersion }
                            </li>
                          ))}
                        </ul>
                      }
                      { criteria.testProcedures.length === 0 && 'None' }
                    </TableCell>
                  </TableRow>
                }
                { (criteria.criterion.number === '170.315 (g)(4)' || criteria.criterion.number === '170.314 (g)(4)') &&
                  <TableRow key="qms">
                    <TableCell component="th" scope="row">
                      Quality Management System
                      <ChplTooltip title="If the corresponding certified product has a Quality Management System (QMS): 1) the standard or mapping used to meet the quality management system certification criterion, and 2) if a QMS standard or mapping was modified, documentation on the changes made. Specific requirements for 2015 Edition are different than for 2014 Edition.">
                        <InfoOutlinedIcon className={classes.infoIcon} />
                      </ChplTooltip>
                    </TableCell>
                    <TableCell align="right">
                      { qmsStandards?.length > 0 &&
                        <ul>
                          { qmsStandards.map((qms) => (
                            <li key={ qms.id }>
                              <strong>Standard: </strong>{ qms.qmsStandardName }<br />
                              <strong>Description: </strong>
                              {
                                qms.qmsModification &&
                                <ChplEllipsis text={qms.qmsModification} maxLength={32} wordBoundaries={true} />
                              }
                              { !qms.modification &&
                                <>N/A</>
                              }
                              <br />
                              <strong>Applicable Criteria: </strong>{ qms.applicableCriteria || 'N/A' }<br />
                            </li>
                          ))}
                        </ul>
                      }
                      { (!qmsStandards || qmsStandards.length === 0) && 'N/A' }
                    </TableCell>
                  </TableRow>
                }
                { criteria.criterion.number === '170.315 (g)(5)' &&
                  <TableRow key="accessibility">
                    <TableCell component="th" scope="row">
                      Accessibility Standard
                      <ChplTooltip title="The standard(s) used to meet the accessibility-centered design certification criterion or developer attestation that no accessibility-centered design was employed. Applies to 2015 Edition certification only.">
                        <InfoOutlinedIcon className={classes.infoIcon} />
                      </ChplTooltip>
                    </TableCell>
                    <TableCell align="right">
                      { accessibilityStandards?.length > 0 &&
                        <ul>
                          { accessibilityStandards.map((std) => (
                            <li key={ std.id }>
                              { std.accessibilityStandardName }
                            </li>
                          ))}
                        </ul>
                      }
                      { (!accessibilityStandards || accessibilityStandards.length === 0) && 'N/A' }
                    </TableCell>
                  </TableRow>
                }
                { criteria.testToolsUsed &&
                  <TableRow key="testToolsUsed">
                    <TableCell component="th" scope="row">
                      Test Tool
                      <ChplTooltip title="The name and version of the test tool used during testing of the certification criterion functionality.">
                        <InfoOutlinedIcon className={classes.infoIcon} />
                      </ChplTooltip>
                    </TableCell>
                    <TableCell align="right">
                      { criteria.testToolsUsed.length > 0 &&
                        <ul>
                          { criteria.testToolsUsed.map((tt) => (
                            <li key={ tt.id }>
                              Tool: { tt.testToolName }; Version: { tt.testToolVersion || 'N/A' }
                            </li>
                          ))}
                        </ul>
                      }
                      { criteria.testToolsUsed.length === 0 && 'None' }
                    </TableCell>
                  </TableRow>
                }
                { criteria.testDataUsed &&
                  <TableRow key="testDataUsed">
                    <TableCell component="th" scope="row">
                      Test Data
                      <ChplTooltip title="The test data version and any alterations or modifications to the ONC-approved test data. It is an optional field except for the products testing for automated numerator recording (&sect;170.314(g)(1) or &sect;170.315(g)(1)) and automated measure calculation (&sect; 170.314(g)(2) or &sect;170.315(g)(2)). For those products, the field is required.">
                        <InfoOutlinedIcon className={classes.infoIcon} />
                      </ChplTooltip>
                    </TableCell>
                    <TableCell align="right">
                      { criteria.testDataUsed.length > 0 &&
                        <ul>
                          { criteria.testDataUsed.map((td) => (
                            <li key={ td.id }>
                              Data: { td.testData.name || 'N/A' }; Version: { td.version }; Alteration: { td.alteration || 'N/A' }
                            </li>
                          ))}
                        </ul>
                      }
                      { criteria.testDataUsed.length === 0 && 'None' }
                    </TableCell>
                  </TableRow>
                }
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
    </ThemeProvider>
  );
}

export { ChplCriteriaView };

ChplCriteriaView.propTypes = {
  certificationResult: object,
  qmsStandards: arrayOf(object),
  accessibilityStandards: arrayOf(object),
};
