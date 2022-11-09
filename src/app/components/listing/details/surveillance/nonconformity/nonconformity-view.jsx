import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  makeStyles,
} from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { ChplTooltip } from 'components/util';
import { getDisplayDateFormat } from 'services/date-util';
import {
  surveillance as surveillancePropType,
  surveillanceNonconformity as nonconformityPropType,
} from 'shared/prop-types';

const useStyles = makeStyles({
  nonconformityAccordionSummaryGrid: {
    display: 'grid',
    gridTemplateColumns: '3fr 1fr',
    gridRowGap: '8px',
    width: '100%',
  },
  nonconformityAccordion: {
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
  },
  nonconformityAccordionSummaryStatus: {
    textAlign: 'right',
  },
  iconSpacing: {
    marginLeft: '4px',
  },
});

function ChplNonconformityView(props) {
  const { surveillance, nonconformity } = props;
  const classes = useStyles();

  return (
    <Accordion className={classes.nonconformityAccordion}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon color="primary" fontSize="large" />}
      >
        <div className={classes.nonconformityAccordionSummaryGrid}>
          <div>
            { nonconformity.type.removed ? 'Removed | ' : ''}
            { nonconformity.type.number
              && (
                <>
                  { nonconformity.type.number}
                  {': '}
                </>
              )}
            { nonconformity.type.title }
          </div>
          <div className={classes.nonconformityAccordionSummaryStatus}>
            { nonconformity.nonconformityStatus }
          </div>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="Non-conformity Table">
            <TableHead>
              <TableRow>
                <TableCell style={{ width: '33%' }}>
                  Attribute
                </TableCell>
                <TableCell>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">
                  Date of Determination of Non-conformity
                  <ChplTooltip title="The date that the ONC-ACB determined that a non-conformity was present.">
                    <InfoOutlinedIcon
                      className={classes.iconSpacing}
                    />
                  </ChplTooltip>
                </TableCell>
                <TableCell>{ getDisplayDateFormat(nonconformity.dateOfDeterminationDay) }</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Corrective Action Plan Approval Date
                  <ChplTooltip title="The date that the ONC-ACB approved the corrective action plan proposed by the developer.">
                    <InfoOutlinedIcon
                      className={classes.iconSpacing}
                    />
                  </ChplTooltip>
                </TableCell>
                <TableCell>{ getDisplayDateFormat(nonconformity.capApprovalDay) }</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Date Corrective Action Began
                  <ChplTooltip title="The date that the corrective action was started.">
                    <InfoOutlinedIcon
                      className={classes.iconSpacing}
                    />
                  </ChplTooltip>
                </TableCell>
                <TableCell>{ getDisplayDateFormat(nonconformity.capStartDay) }</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Date Corrective Action Must Be Completed
                  <ChplTooltip title="The date that the corrective action must be completed in order to avoid termination of the certified product’s certification status.">
                    <InfoOutlinedIcon
                      className={classes.iconSpacing}
                    />
                  </ChplTooltip>
                </TableCell>
                <TableCell>{ getDisplayDateFormat(nonconformity.capMustCompleteDay) }</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Date Corrective Action Was Completed
                  <ChplTooltip title="The date that the corrective action was completed.">
                    <InfoOutlinedIcon
                      className={classes.iconSpacing}
                    />
                  </ChplTooltip>
                </TableCell>
                <TableCell>{ getDisplayDateFormat(nonconformity.capEndDay) }</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Non-Conformity Type
                  <ChplTooltip title="For non-conformities related to specific regulatory references (e.g. certified capabilities, disclosure requirements, or use of the Certification Mark), the regulation reference is used (e.g. 170.315(a)(2) or 170.523(l)). If the non-conformity type is designated as ‘Other Non-Conformity’, then the associated non-conformity does not have a relevant regulatory reference.">
                    <InfoOutlinedIcon
                      className={classes.iconSpacing}
                    />
                  </ChplTooltip>
                </TableCell>
                <TableCell>
                  <span className={nonconformity.type.removed ? 'removed' : ''}>
                    { nonconformity.type.removed ? 'Removed | ' : ''}
                    { nonconformity.type.number
                      && (
                        <>
                          { nonconformity.type.number}
                          {': '}
                        </>
                      )}
                    { nonconformity.type.title }
                  </span>
                </TableCell>
              </TableRow>
              { surveillance.type?.name === 'Randomized'
                && (
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Pass Rate
                      <ChplTooltip title="Pass rates only apply to non-conformities found as a result of random surveillance. The numerator for the pass rate is the number of sites for each criterion that passed randomized surveillance for the Health IT module being evaluated. The denominator is the total number of sites for which randomized surveillance was conducted on the Health IT module.">
                        <InfoOutlinedIcon
                          className={classes.iconSpacing}
                        />
                      </ChplTooltip>
                    </TableCell>
                    <TableCell>
                      { `${nonconformity.sitesPassed} / ${nonconformity.totalSites}` }
                    </TableCell>
                  </TableRow>
                )}
              <TableRow>
                <TableCell component="th" scope="row">
                  Non-Conformity Status
                  <ChplTooltip title="Whether the non-conformity is open or closed (has been resolved).">
                    <InfoOutlinedIcon
                      className={classes.iconSpacing}
                    />
                  </ChplTooltip>
                </TableCell>
                <TableCell>{ nonconformity.nonconformityStatus }</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Non-Conformity Summary
                  <ChplTooltip title="A brief summary describing why the certified product was found to be non-conformant.">
                    <InfoOutlinedIcon
                      className={classes.iconSpacing}
                    />
                  </ChplTooltip>
                </TableCell>
                <TableCell>{ nonconformity.summary }</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Findings
                  <ChplTooltip title="A detailed description of the ONC-ACB’s findings related to the nonconformity. This provides a full picture of the potential nonconformities or other deficiencies the ONC-ACB identified, how they were evaluated, and how the ONC-ACB reached its non-conformity determination.">
                    <InfoOutlinedIcon
                      className={classes.iconSpacing}
                    />
                  </ChplTooltip>
                </TableCell>
                <TableCell>{ nonconformity.findings }</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Developer Explanation
                  <ChplTooltip title="If available, the developer’s explanation of why it agrees or disagrees with the ONC-ACB’s assessment of the non-conformity and an explanation of why the non-conformity occurred.">
                    <InfoOutlinedIcon
                      className={classes.iconSpacing}
                    />
                  </ChplTooltip>
                </TableCell>
                <TableCell>{ nonconformity.developerExplanation }</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Resolution
                  <ChplTooltip title="A detailed description of how the non-conformity was resolved.">
                    <InfoOutlinedIcon
                      className={classes.iconSpacing}
                    />
                  </ChplTooltip>
                </TableCell>
                <TableCell>{ nonconformity.resolution }</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </AccordionDetails>
    </Accordion>
  );
}

export default ChplNonconformityView;

ChplNonconformityView.propTypes = {
  surveillance: surveillancePropType.isRequired,
  nonconformity: nonconformityPropType.isRequired,
};
