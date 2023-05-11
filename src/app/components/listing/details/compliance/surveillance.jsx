import React from 'react';
import {
  Accordion,
  AccordionSummary,
  Box,
  CardContent,
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

const getDataDisplay = (title, value, tooltip) => (
  <Box width="48%" gridGap="8px" alignItems="center" display="flex" justifyContent="space-between">
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
    <ul>
      { surveillance.requirements
        .sort(sortRequirements)
        .map((req) => (
          <li key={req.id}>
            { `${req.requirementType?.requirementGroupType.name}` }
            {': '}
            <span className={(req.requirementType?.removed ? 'removed' : '')}>
              { getRequirementDisplay(req) }
            </span>
          </li>
        ))}
    </ul>
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
    <ul>
      { getSurveillanceResultsSummary(surveillance).map((result) => (
        <li key={result.id}>
          { `${result.statusName} Non-Conformity Found for` }
          <span className={result.removed ? 'removed' : ''}>
            { result.display }
          </span>
        </li>
      ))}
    </ul>
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
                { getDataDisplay('Surveillance Type', <Typography>{surv.type.name}</Typography>, 'The type of surveillance conducted (either randomized or reactive).') }
                { getDataDisplay('Certification Criteria and Program Requirements Surveilled', getItemsSurveilled(surv), 'The ONC Health IT Certification Program requirement that was surveilled. For example, this may be a specific certification criteria (e.g. 170.315(a)(1)), disclosure requirement (e.g. 170.523(k)(1)), another requirement with a regulatory reference (e.g. 170.523(l)), or a brief description of the surveilled requirement.') }
                { getDataDisplay('Surveillance Result', getSurveillanceResult(surv), 'Whether or not a non-conformity was found for the conducted surveillance.') }
              </Box>
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
                    <Box width="48%" gridGap="8px" alignItems="center" display="flex" justifyContent="space-between">
                      <Box display="flex" flexDirection="column">
                        <Typography variant="subtitle2">
                          Date of Detemination of Non-Conformity
                        </Typography>
                        <Typography>
                          MM/DD/YYYY
                        </Typography>
                      </Box>
                      <Box>
                        <ChplTooltip
                          placement="top"
                          title="Placement text"
                        >
                          <InfoIcon color="primary" />
                        </ChplTooltip>
                      </Box>
                    </Box>
                    <Box width="48%" gridGap="8px" alignItems="center" display="flex" justifyContent="space-between">
                      <Box display="flex" flexDirection="column">
                        <Typography variant="subtitle2">
                          Corrective Action Plan Approval Date
                        </Typography>
                        <Typography>
                          MM/DD/YYYY
                        </Typography>
                      </Box>
                      <Box>
                        <ChplTooltip
                          placement="top"
                          title="Placement text"
                        >
                          <InfoIcon color="primary" />
                        </ChplTooltip>
                      </Box>
                    </Box>
                    <Box width="48%" gridGap="8px" alignItems="center" display="flex" justifyContent="space-between">
                      <Box display="flex" flexDirection="column">
                        <Typography variant="subtitle2">
                          Date Corrective Action Began
                        </Typography>
                        <Typography>
                          MM/DD/YYYY
                        </Typography>
                      </Box>
                      <Box>
                        <ChplTooltip
                          placement="top"
                          title="Placement text"
                        >
                          <InfoIcon color="primary" />
                        </ChplTooltip>
                      </Box>
                    </Box>
                    <Box width="48%" gridGap="8px" alignItems="center" display="flex" justifyContent="space-between">
                      <Box display="flex" flexDirection="column">
                        <Typography variant="subtitle2">
                          Date Corrective Action Plan Must Be Completed
                        </Typography>
                        <Typography>
                          MM/DD/YYYY
                        </Typography>
                      </Box>
                      <Box>
                        <ChplTooltip
                          placement="top"
                          title="Placement text"
                        >
                          <InfoIcon color="primary" />
                        </ChplTooltip>
                      </Box>
                    </Box>
                    <Box width="48%" gridGap="8px" alignItems="center" display="flex" justifyContent="space-between">
                      <Box display="flex" flexDirection="column">
                        <Typography variant="subtitle2">
                          Date Corrective Action Plan Was Completed
                        </Typography>
                        <Typography>
                          MM/DD/YYYY
                        </Typography>
                      </Box>
                      <Box>
                        <ChplTooltip
                          placement="top"
                          title="Placement text"
                        >
                          <InfoIcon color="primary" />
                        </ChplTooltip>
                      </Box>
                    </Box>
                    <Box width="48%" gridGap="8px" alignItems="center" display="flex" justifyContent="space-between">
                      <Box display="flex" flexDirection="column">
                        <Typography variant="subtitle2">
                          Non-Conformity Type
                        </Typography>
                        <Typography>
                          MM/DD/YYYY
                        </Typography>
                      </Box>
                      <Box>
                        <ChplTooltip
                          placement="top"
                          title="Placement text"
                        >
                          <InfoIcon color="primary" />
                        </ChplTooltip>
                      </Box>
                    </Box>
                    <Box width="48%" gridGap="8px" alignItems="center" display="flex" justifyContent="space-between">
                      <Box display="flex" flexDirection="column">
                        <Typography variant="subtitle2">
                          Non-Conformity Status
                        </Typography>
                        <Typography>
                          MM/DD/YYYY
                        </Typography>
                      </Box>
                      <Box>
                        <ChplTooltip
                          placement="top"
                          title="Placement text"
                        >
                          <InfoIcon color="primary" />
                        </ChplTooltip>
                      </Box>
                    </Box>
                    <Box width="48%" gridGap="8px" alignItems="center" display="flex" justifyContent="space-between">
                      <Box display="flex" flexDirection="column">
                        <Typography variant="subtitle2">
                          Non-Conformity Summary
                        </Typography>
                        <Typography>
                          MM/DD/YYYY
                        </Typography>
                      </Box>
                      <Box>
                        <ChplTooltip
                          placement="top"
                          title="Placement text"
                        >
                          <InfoIcon color="primary" />
                        </ChplTooltip>
                      </Box>
                    </Box>
                    <Box width="100%" gridGap="8px" alignItems="center" display="flex" justifyContent="space-between">
                      <Box display="flex" flexDirection="column">
                        <Typography variant="subtitle2">
                          Findings
                        </Typography>
                        <Typography gutterBottom>
                          MM/DD/YYYY
                        </Typography>
                      </Box>
                      <Box>
                        <ChplTooltip
                          placement="top"
                          title="Placement text"
                        >
                          <InfoIcon color="primary" />
                        </ChplTooltip>
                      </Box>
                    </Box>
                    <Box width="100%" gridGap="8px" alignItems="center" display="flex" justifyContent="space-between">
                      <Box display="flex" flexDirection="column">
                        <Typography variant="subtitle2">
                          Developer Explanation
                        </Typography>
                        <Typography gutterBottom>
                          MM/DD/YYYY
                        </Typography>
                      </Box>
                      <Box>
                        <ChplTooltip
                          placement="top"
                          title="Placement text"
                        >
                          <InfoIcon color="primary" />
                        </ChplTooltip>
                      </Box>
                    </Box>
                    <Box width="100%" gridGap="8px" alignItems="center" display="flex" justifyContent="space-between">
                      <Box display="flex" flexDirection="column">
                        <Typography variant="subtitle2">
                          Resolution
                        </Typography>
                        <Typography gutterBottom>
                          MM/DD/YYYY
                        </Typography>
                      </Box>
                      <Box>
                        <ChplTooltip
                          placement="top"
                          title="Placement text"
                        >
                          <InfoIcon color="primary" />
                        </ChplTooltip>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Accordion>
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
