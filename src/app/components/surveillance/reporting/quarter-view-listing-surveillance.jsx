import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { object } from 'prop-types';

import { getDisplayDateFormat } from 'services/date-util';
import { theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '16px',
    [theme.breakpoints.up('md')]: {
      display: 'grid',
      gridTemplateColumns: '1fr 3fr',
      alignItems: 'start',
    },
  },
  menuItems: {
    padding: '8px',
    justifyContent: 'space-between',
    '&.Mui-disabled': {
      color: '#000',
      backgroundColor: '#f9f9f9',
      fontWeight: 600,
    },
  },
});

function ChplQuarterViewListingSurveillance({
  surveillance,
}) {
  const classes = useStyles();

  return (
    <Card>
      <CardContent>
        <Typography>
          Additional Costs Evaluation:
          { surveillance.additioanlCostsEvaluation }
        </Typography>
        <Typography>
          CAP Status Other:
          { surveillance.capStatusOther }
        </Typography>
        <Typography>
          CAP Statuses:
          { surveillance.capStatuses.map((s) => s.name).join('; ') }
        </Typography>
        <Typography>
          Completed CAP Verification:
          { surveillance.completedCapVerification }
        </Typography>
        <Typography>
          Direction Developer Resolution:
          { surveillance.directionDeveloperResolution }
        </Typography>
        <Typography>
          End Day:
          { getDisplayDateFormat(surveillance.endDay) }
        </Typography>
        <Typography>
          Friendly ID:
          { surveillance.friendlyId }
        </Typography>
        <Typography>
          Grounds For Initiating:
          { surveillance.groundsForInitiating }
        </Typography>
        <Typography>
          k1 Reviewed:
          { surveillance.k1Reviewed }
        </Typography>
        <Typography>
          Limitations Evaluation:
          { surveillance.limitationsEvaluation }
        </Typography>
        <Typography>
          Nonconformity Causes:
          { surveillance.nonconformityCauses }
        </Typography>
        <Typography>
          Nonconformity Nature:
          { surveillance.nonconformityNature }
        </Typography>
        <Typography>
          Nondisclosure Evaluation:
          { surveillance.nondisclosureEvaluation }
        </Typography>
        <Typography>
          Number of Closed Nonconformities:
          { surveillance.numClosedNonconformities }
        </Typography>
        <Typography>
          Number of Open Nonconformities:
          { surveillance.numOpenNonconformities }
        </Typography>
        <Typography>
          Number of Randomized Sites:
          { surveillance.numRandomizedSites }
        </Typography>
        <Typography>
          Start Day:
          { getDisplayDateFormat(surveillance.startDay) }
        </Typography>
        <Typography>
          Steps To Engage:
          { surveillance.stepsToEngage }
        </Typography>
        <Typography>
          Steps To Surveil:
          { surveillance.stepsToSurveil }
        </Typography>
        <Typography>
          Surveillance Findings:
          { surveillance.surveillanceFindings }
        </Typography>
        <Typography>
          Surveillance Grounds For Initiating:
          { surveillance.surveillanceGroundsForInitiating.map((s) => s.name).join('; ') }
        </Typography>
        <Typography>
          Surveillance Grounds For Initiating Other:
          { surveillance.surveillanceGroundsForInitiatingOther }
        </Typography>
        <Typography>
          Surveillance Outcome:
          { surveillance.surveillanceOutcome?.name }
        </Typography>
        <Typography>
          Surveillance Outcome Other:
          { surveillance.surveillanceOutcomeOther }
        </Typography>
        <Typography>
          Surveillance Process Type Other:
          { surveillance.surveillanceProcessTypeOther }
        </Typography>
        <Typography>
          Surveillance Process Types:
          { surveillance.surveillanceProcessTypes.map((s) => s.name).join('; ') }
        </Typography>
        <Typography>
          Surveillance Type:
          { surveillance.surveillanceType?.name }
        </Typography>
      </CardContent>
    </Card>
  );
}

export default ChplQuarterViewListingSurveillance;

ChplQuarterViewListingSurveillance.propTypes = {
  surveillance: object.isRequired,
};
