import React from 'react';
import {
  Accordion,
  AccordionSummary,
  Box,
  CardContent,
  List,
  ListItem,
  Typography,
  makeStyles,
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { arrayOf } from 'prop-types';

import { ChplTooltip } from 'components/util';
import { getDisplayDateFormat } from 'services/date-util';
import { surveillance as surveillancePropType } from 'shared/prop-types';
import { getRequirementDisplay, sortRequirements } from 'services/surveillance.service';
import { palette, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  infoIcon: {
    color: `${palette.primary}`,
  },
  root: {
    width: '100%',
    padding: '0 8px !important',
  },
  subCard: {
    backgroundColor: `${palette.white}`,
    borderBottom: `.5px solid ${palette.divider}`,
  },
  surveillance: {
    borderRadius: '4px',
    display: 'grid',
    borderColor: `${palette.divider}`,
    borderWidth: '.5px',
    borderStyle: 'solid',
    padding: '0px',
    backgroundColor: `${palette.white}`,
  },
  surveillanceSummary: {
    backgroundColor: `${palette.secondary}!important`,
    borderRadius: '4px',
    borderBottom: `.5px solid ${palette.divider}`,
    width: '100%',
    padding: '0 8px !important',
  },
  surveillanceDetailsSummary: {
    backgroundColor: `${palette.white}!important`,
    borderRadius: '4px',
    borderBottom: `.5px solid ${palette.divider}`,
    width: '100%',
    padding: '0 8px !important',
  },
  '& span.MuiTypography-root.MuiCardHeader-title.MuiTypography-h6.MuiTypography-displayBlock': {
    fontWeight: '300',
  },
});

const getDataDisplay = (title, value, tooltip, fullWidth = false) => (
  <Box width={fullWidth ? '100%' : '48%'} gridGap="8px" alignItems="center" display="flex" justifyContent="space-between">
    <Box display="flex" flexDirection="column">
      <Typography variant="subtitle2">
        { title }
      </Typography>
      { value }
    </Box>
    <Box>
      <ChplTooltip
        title={tooltip}
      >
        <InfoIcon color="primary" />
      </ChplTooltip>
    </Box>
  </Box>
);

const getItemsSurveilled = (surveillance) => {
  if (surveillance.requirements?.length === 0) { return 'None'; }
  return (
    <List>
      { surveillance.requirements
        .sort(sortRequirements)
        .map((req) => (
          <ListItem key={req.id}>
            <span className={(req.requirementType?.removed ? 'removed' : '')}>
              { getRequirementDisplay(req) }
            </span>
          </ListItem>
        ))}
    </List>
  );
};

const getSurveillanceResultsSummary = (surv) => surv.requirements
  .flatMap((req) => req.nonconformities
    .map((nc) => ({
      ...req,
      id: `${req.id}-${nc.id}`,
      statusName: nc.nonconformityStatus,
      display: getRequirementDisplay(req),
      removed: req.requirementType?.removed,
    })));

const getSurveillanceResult = (surveillance) => {
  if (getSurveillanceResultsSummary(surveillance).length === 0) { return 'No Non-Conformities Found'; }
  return (
    <List>
      { getSurveillanceResultsSummary(surveillance).map((result) => (
        <ListItem key={result.id}>
          { `${result.statusName} Non-Conformity Found for` }
          {' '}
          <span className={result.removed ? 'removed' : ''}>
            { result.display }
          </span>
        </ListItem>
      ))}
    </List>
  );
};

function ChplSurveillance(props) {
  const { surveillance } = props;
  const classes = useStyles();

  return (
    <Accordion className={classes.surveillance}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        className={classes.surveillanceSummary}
        color="secondary"
      >
        <Box display="flex" flexDirection="row" justifyContent="space-between" width="100%">
          <Typography>
            Surveillance Activites
          </Typography>
          <Typography variant="body2">
            3 found
          </Typography>
        </Box>
      </AccordionSummary>
      <CardContent>
        <Typography gutterBottom>
          Surveillance information is displayed here if a surveillance activity has been opened by an ONC-ACB that affects this listing
        </Typography>
        { surveillance.map((surv) => (
          <Accordion className={classes.surveillance} key={surv.id}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              className={classes.surveillanceDetailsSummary}
              color="secondary"
            >
              <Typography>
                Closed Surveillance, Ended Feb 1, 2023: Closed Non-Conformity was found
              </Typography>
            </AccordionSummary>
            <CardContent>
              <Box display="flex" gridGap="8px" flexWrap="wrap" flexDirection="row" justifyContent="space-between">
                { getDataDisplay('Date Surveillance Began', <Typography>{ getDisplayDateFormat(surv.startDay) }</Typography>, 'The date surveillance was initiated') }
                { getDataDisplay('Date Surveillance Ended', <Typography>{ getDisplayDateFormat(surv.endDay) }</Typography>, 'The date surveillance was completed') }
                { getDataDisplay('Surveillance Type', <Typography>{surv.type.name}{surv.type.name === 'Randomized' ? ` (${surv.randomizedSitesUsed} sites used in surveillance)` : ''}</Typography>, 'The type of surveillance conducted (either randomized or reactive).') }
                { getDataDisplay('Certification Criteria and Program Requirements Surveilled', getItemsSurveilled(surv), 'The ONC Health IT Certification Program requirement that was surveilled. For example, this may be a specific certification criteria (e.g. 170.315(a)(1)), disclosure requirement (e.g. 170.523(k)(1)), another requirement with a regulatory reference (e.g. 170.523(l)), or a brief description of the surveilled requirement.') }
                { getDataDisplay('Surveillance Result', getSurveillanceResult(surv), 'Whether or not a non-conformity was found for the conducted surveillance.', true) }
              </Box>
              { surv.requirements.map((req) => req.nonconformities.map((nc) => (
                <Accordion className={classes.surveillance}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    className={classes.surveillanceDetailsSummary}
                    color="secondary"
                  >
                    <Typography>
                      Details for Non-conformity related to 1789,287(c)(3): Clinical quality measures - Report (Cures Update)
                    </Typography>
                  </AccordionSummary>
                  <CardContent>
                    <Box display="flex" gridGap="8px" flexWrap="wrap" flexDirection="row" justifyContent="space-between">
                      { getDataDisplay('Date of Determination of Non-Conformity', <Typography>{ getDisplayDateFormat(nc.dateOfDeterminationDay) }</Typography>, 'The date that the ONC-ACB determined that a non-conformity was present.') }
                      { getDataDisplay('Corrective Action Plan Approval Date', <Typography>{ getDisplayDateFormat(nc.capApprovalDay) }</Typography>, 'The date that the ONC-ACB approved the corrective action plan proposed by the developer.') }
                      { getDataDisplay('Date Corrective Action Began', <Typography>{ getDisplayDateFormat(nc.capStartDay) }</Typography>, 'The date that the corrective action was started.') }
                      { getDataDisplay('Date Corrective Action Must Be Completed', <Typography>{ getDisplayDateFormat(nc.capMustCompleteDay) }</Typography>, 'The date that the corrective action must be completed in order to avoid termination of the certified product’s certification status.') }
                      { getDataDisplay('Date Corrective Action Was Completed', <Typography>{ getDisplayDateFormat(nc.capEndDay) }</Typography>, 'The date that the corrective action was completed.') }
                      { getDataDisplay('Non-Conformity Type', <Typography className={nc.type.removed ? 'removed' : ''}>{nc.type.removed ? 'Removed | ' : ''} {nc.type.number ? (nc.type.number + ': ') : ''} {nc.type.title}</Typography>, 'For non-conformities related to specific regulatory references (e.g. certified capabilities, disclosure requirements, or use of the Certification Mark), the regulation reference is used (e.g. 170.315(a)(2) or 170.523(l)). If the non-conformity type is designated as "Other Non-Conformity", then the associated non-conformity does not have a relevant regulatory reference.') }
                      { getDataDisplay('Non-Conformity Status', <Typography>{ nc.nonconformityStatus }</Typography>, 'Whether the non-conformity is open or closed (has been resolved).') }
                      { surv.type.name === 'Randomized' && getDataDisplay('Pass Rate', <Typography>{ nc.sitesPassed } / { nc.totalSites }</Typography>, 'Pass rates only apply to non-conformities found as a result of random surveillance. The numerator for the pass rate is the number of sites for each criterion that passed randomized surveillance for the Health IT module being evaluated. The denominator is the total number of sites for which randomized surveillance was conducted on the Health IT module.') }
                      { getDataDisplay('Non-Conformity Summary', <Typography>{ nc.summary }</Typography>, 'A brief summary describing why the certified product was found to be non-conformant.') }
                      { getDataDisplay('Findings', <Typography>{ nc.findings }</Typography>, 'A detailed description of the ONC-ACB’s findings related to the non-conformity. This provides a full picture of the potential non-conformities or other deficiencies the ONC-ACB identified, how they were evaluated, and how the ONC-ACB reached its non-conformity determination.', true) }
                      { getDataDisplay('Developer Explanation', <Typography>{ nc.developerExplanation }</Typography>, 'If available, the developer’s explanation of why it agrees or disagrees with the ONC-ACB’s assessment of the non-conformity and an explanation of why the non-conformity occurred.', true) }
                      { getDataDisplay('Resolution', <Typography>{ nc.resolution }</Typography>, 'A detailed description of how the non-conformity was resolved.', true) }
                    </Box>
                  </CardContent>
                </Accordion>
              )))}
            </CardContent>
          </Accordion>
        ))}
      </CardContent>
    </Accordion>
  );
}

export default ChplSurveillance;

ChplSurveillance.propTypes = {
  surveillance: arrayOf(surveillancePropType).isRequired,
};
