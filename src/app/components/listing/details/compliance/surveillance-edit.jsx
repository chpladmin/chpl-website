import React, { useEffect, useState } from 'react';
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
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { func } from 'prop-types';

import { getDataDisplay } from './compliance.services';

import { eventTrack } from 'services/analytics.service';
import { getDisplayDateFormat } from 'services/date-util';
import { useAnalyticsContext } from 'shared/contexts';
import { surveillance as surveillancePropType } from 'shared/prop-types';
import { getRequirementDisplay, sortRequirements } from 'services/surveillance.service';
import { palette, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  infoIcon: {
    color: palette.primary,
  },
  root: {
    width: '100%',
    padding: '0 8px !important',
  },
  subCard: {
    backgroundColor: palette.white,
    borderBottom: `.5px solid ${palette.divider}`,
  },
  surveillance: {
    borderRadius: '4px',
    display: 'grid',
    border: `.5px solid ${palette.divider}`,
    padding: '0',
    backgroundColor: palette.white,
  },
  surveillanceSummary: {
    backgroundColor: `${palette.white} !important`,
    borderRadius: '4px',
    borderBottom: `.5px solid ${palette.divider}`,
    width: '100%',
    padding: '0 4px !important',
  },
  surveillanceDetailsSummary: {
    backgroundColor: `${palette.white} !important`,
    borderRadius: '4px',
    borderBottom: `.5px solid ${palette.divider}`,
    width: '100%',
    padding: '0 4px !important',
  },
  surveillanceDetailsHeaderWithBorder: {
    backgroundColor: `${palette.white} !important`,
    borderRadius: '4px',
    borderLeft: `2px solid ${palette.black} !important`,
    width: '100%',
    padding: '0 4px !important',
  },
  surveillanceDetailsBorder: {
    borderLeft: `2px solid ${palette.black} !important`,
  },
  '& span.MuiTypography-root.MuiCardHeader-title.MuiTypography-h6.MuiTypography-displayBlock': {
    fontWeight: '300',
  },
  rotate: {
    transform: 'rotate(180deg)',
  },
});

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
          <Box display="flex" flexDirection="column" justifyContent="space-between">
            <Typography variant="body1">
              { `${result.statusName} Non-Conformity Found for ` }
              {' '}
              <span className={result.removed ? 'removed' : ''}>{ result.display }</span>
            </Typography>
          </Box>
        </ListItem>
      ))}
    </List>
  );
};

const getSurveillanceTitle = (surv) => {
  let title = surv.endDay
    ? `Closed Surveillance, Ended ${getDisplayDateFormat(surv.endDay)}: `
    : `Open Surveillance, Began ${getDisplayDateFormat(surv.startDay)}: `;
  const open = surv.requirements.reduce((rCnt, r) => rCnt + r.nonconformities.filter((nc) => nc.nonconformityStatus === 'Open').length, 0);
  const closed = surv.requirements.reduce((rCnt, r) => rCnt + r.nonconformities.filter((nc) => nc.nonconformityStatus === 'Closed').length, 0);
  if (open && closed) {
    title += `${open} Open and ${closed} Closed Non-Conformities Were Found`;
  } else if (open) {
    if (open === 1) {
      title += '1 Open Non-Conformity Was Found';
    } else {
      title += `${open} Open Non-Conformities Were Found`;
    }
  } else if (closed) {
    if (closed === 1) {
      title += '1 Closed Non-Conformity Was Found';
    } else {
      title += `${closed} Closed Non-Conformities Were Found`;
    }
  } else {
    title += 'No Non-Conformities Were Found';
  }
  return title;
};

function ChplSurveillanceEdit({ surveillance, dispatch }) {
  const { analytics } = useAnalyticsContext();
  const [expanded, setExpanded] = useState(false);
  const classes = useStyles();

  const getIcon = () => (expanded
    ? (
      <>
        <Typography color="primary" variant="body2">Hide Details</Typography>
        <ExpandMoreIcon color="primary" fontSize="large" className={classes.rotate} />
      </>
    )
    : (
      <>
        <Typography color="primary" variant="body2">Show Details</Typography>
        <ExpandMoreIcon color="primary" fontSize="large" />
      </>
    ));

  const handleAccordionChange = () => {
    const title = ics ? 'Inherited Certified Status Surveillance Activities' : 'Surveillance Activities';
    eventTrack({
      ...analytics,
      event: expanded ? `Hide ${title}` : `Show ${title}`,
    });
    setExpanded(!expanded);
  };

  const handleWithinChange = (obj, isExpanded) => {
    const title = ics ? 'Surveillance within Inherited Certified Status Surveillance Activities' : 'Surveillance within Surveillance Activities';
    eventTrack({
      ...analytics,
      event: isExpanded ? `Show ${title}` : `Hide ${title}`,
    });
  };

  const handleDetailsChange = (obj, isExpanded) => {
    const title = ics ? 'Details within Inherited Certified Status Surveillance Activities' : 'Details within Surveillance Activities';
    eventTrack({
      ...analytics,
      event: isExpanded ? `Show ${title}` : `Hide ${title}`,
    });
  };

  return (
    <>
      <CardContent>
        <Typography>
          { getSurveillanceTitle(surveillance) }
        </Typography>
        <CardContent>
          <Box display="flex" gridGap="8px" flexWrap="wrap" flexDirection="row" justifyContent="space-between" pb={2}>
            { getDataDisplay('Date Surveillance Began', <Typography>{ getDisplayDateFormat(surveillance.startDay) }</Typography>, 'The date surveillance was initiated') }
            { getDataDisplay('Date Surveillance Ended', <Typography>{ getDisplayDateFormat(surveillance.endDay) }</Typography>, 'The date surveillance was completed') }
            { getDataDisplay('Surveillance Type',
                             <Typography>
                               {surveillance.type.name}
                               {surveillance.type.name === 'Randomized' ? ` (${surveillance.randomizedSitesUsed} sites used in surveillance)` : ''}
                             </Typography>,
                             'The type of surveillance conducted (either randomized or reactive).') }
            { getDataDisplay('Certification Criteria and Program Requirements Surveilled', getItemsSurveilled(surveillance), 'The ONC Health IT Certification Program requirement that was surveilled. For example, this may be a specific certification criteria (e.g. 170.315(a)(1)), disclosure requirement (e.g. 170.523(k)(1)), another requirement with a regulatory reference (e.g. 170.523(l)), or a brief description of the surveilled requirement.', true) }
            { getDataDisplay('Surveillance Result', getSurveillanceResult(surveillance), 'Whether or not a non-conformity was found for the conducted surveillance.', true) }
          </Box>
        </CardContent>
      </CardContent>
    </>
  );
}

export default ChplSurveillanceEdit;

ChplSurveillanceEdit.propTypes = {
  surveillance: surveillancePropType.isRequired,
  dispatch: func.isRequired,
};
