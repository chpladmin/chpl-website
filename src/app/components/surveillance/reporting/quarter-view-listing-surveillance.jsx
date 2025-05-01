import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogContent,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { object } from 'prop-types';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';

import { getDisplayDateFormat } from 'services/date-util';
import { theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: '0 16px 16px 16px',
    width: '100%',
    gap: '9px',
    margin: '8px 0',
    [theme.breakpoints.up('md')]: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      alignItems: 'start',
    },
  },
  dialogActions: {
    padding: '8px 32px',
  },
  idContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    padding: '16px 16px 0 16px',
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

function ChplQuarterViewListingSurveillance({ surveillance }) {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const classes = useStyles();

  useEffect(() => {
    setProgress(Math.round(((
      (surveillance.surveillanceOutcome ? 1 : 0)
        + (surveillance.surveillanceProcessTypes?.length > 0 ? 1 : 0)
        + (surveillance.k1Reviewed ? 1 : 0)
        + (surveillance.surveillanceGroundsForInitiating?.length > 0 ? 1 : 0)
        + (surveillance.nonconformityCauses ? 1 : 0)
        + (surveillance.nonconformityNature ? 1 : 0)
        + (surveillance.stepsToSurveil ? 1 : 0)
        + (surveillance.stepsToEngage ? 1 : 0)
        + (surveillance.additionalCostsEvaluation ? 1 : 0)
        + (surveillance.limitationsEvaluation ? 1 : 0)
        + (surveillance.nondisclosureEvaluation ? 1 : 0)
        + (surveillance.directionDeveloperResolution ? 1 : 0)
        + (surveillance.capStatuses?.length > 0 ? 1 : 0)
    ) * 100) / 13));
  }, [surveillance]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Card style={{ width: '100%' }}>
        <div className={classes.idContainer}>
          <Typography>
            <strong>Friendly ID:</strong>
            {' '}
            { surveillance.friendlyId }
          </Typography>
          <Box display="flex" flexDirection="row" alignItems="center" gridGap="4px">
            <Box position="relative" display="inline-flex">
              <CircularProgress value={progress} variant="determinate" size={24} color="primary" />
              <Box
                top={0}
                left={0}
                bottom={0}
                right={0}
                position="absolute"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Typography variant="caption" component="div" color="textSecondary">
                  {`${progress} %`}
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2">Completed</Typography>
          </Box>
        </div>
        <div className={classes.container}>
          <Typography>
            <strong>Start Day:</strong>
            {' '}
            { getDisplayDateFormat(surveillance.startDay) }
          </Typography>
          <Typography>
            <strong>End Day:</strong>
            {' '}
            { getDisplayDateFormat(surveillance.endDay) }
          </Typography>
          <Typography>
            <strong>Number of Closed Nonconformities:</strong>
            {' '}
            { surveillance.numClosedNonconformities }
          </Typography>
          <Typography>
            <strong>Number of Open Nonconformities:</strong>
            {' '}
            { surveillance.numOpenNonconformities }
          </Typography>
        </div>
        <Box style={{ padding: '8px' }}>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            style={{ margin: '8px 0' }}
            endIcon={<RemoveRedEye />}
            onClick={handleOpen}
          >
            View Surveillance Data
          </Button>
        </Box>
      </Card>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <CardHeader title="Surveillance Data" />
        <DialogContent>
          <div className={classes.container}>
            <Typography>
              <strong>Surveillance Type:</strong>
              {' '}
              { surveillance.surveillanceType?.name }
            </Typography>
            <Typography>
              <strong>k1 Reviewed:</strong>
              {' '}
              { surveillance.k1Reviewed ? 'Yes' : 'No' }
            </Typography>
            <Typography>
              <strong>Surveillance Outcome:</strong>
              {' '}
              { surveillance.surveillanceOutcome?.name }
            </Typography>
            <Typography>
              <strong>Surveillance Outcome Other:</strong>
              {' '}
              { surveillance.surveillanceOutcomeOther }
            </Typography>
            <Typography>
              <strong>Surveillance Process Type Other:</strong>
              {' '}
              { surveillance.surveillanceProcessTypeOther }
            </Typography>
            <Typography>
              <strong>Surveillance Process Types:</strong>
              {' '}
              { surveillance.surveillanceProcessTypes.map((s) => s.name).join('; ') }
            </Typography>
            <Typography>
              <strong>Grounds For Initiating:</strong>
              {' '}
              { surveillance.groundsForInitiating }
            </Typography>
            <Typography>
              <strong>Surveillance Grounds For Initiating:</strong>
              {' '}
              { surveillance.surveillanceGroundsForInitiating.map((s) => s.name).join('; ') }
            </Typography>
            <Typography>
              <strong>Surveillance Grounds For Initiating Other:</strong>
              {' '}
              { surveillance.surveillanceGroundsForInitiatingOther }
            </Typography>
            <Typography>
              <strong>Nonconformity Causes:</strong>
              {' '}
              { surveillance.nonconformityCauses }
            </Typography>
            <Typography>
              <strong>Nonconformity Nature:</strong>
              {' '}
              { surveillance.nonconformityNature }
            </Typography>
            <Typography>
              <strong>Steps To Surveil:</strong>
              {' '}
              { surveillance.stepsToSurveil }
            </Typography>
            <Typography>
              <strong>Steps To Engage:</strong>
              {' '}
              { surveillance.stepsToEngage }
            </Typography>
            <Typography>
              <strong>Additional Costs Evaluation:</strong>
              {' '}
              { surveillance.additioanlCostsEvaluation }
            </Typography>
            <Typography>
              <strong>Limitations Evaluation:</strong>
              {' '}
              { surveillance.limitationsEvaluation }
            </Typography>
            <Typography>
              <strong>Nondisclosure Evaluation:</strong>
              {' '}
              { surveillance.nondisclosureEvaluation }
            </Typography>
            <Typography>
              <strong>Direction Developer Resolution:</strong>
              {' '}
              { surveillance.directionDeveloperResolution }
            </Typography>
            <Typography>
              <strong>CAP Statuses:</strong>
              {' '}
              { surveillance.capStatuses.map((s) => s.name).join('; ') }
            </Typography>
            <Typography>
              <strong>CAP Status Other:</strong>
              {' '}
              { surveillance.capStatusOther }
            </Typography>
            <Typography>
              <strong>Completed CAP Verification:</strong>
              {' '}
              { surveillance.completedCapVerification }
            </Typography>
            <Typography>
              <strong>Surveillance Findings:</strong>
              {' '}
              { surveillance.surveillanceFindings }
            </Typography>
          </div>
        </DialogContent>
        <div className={classes.dialogActions}>
          <Button onClick={handleClose} variant="outlined" color="primary">
            Close
          </Button>
        </div>
      </Dialog>
    </>
  );
}

export default ChplQuarterViewListingSurveillance;

ChplQuarterViewListingSurveillance.propTypes = {
  surveillance: object.isRequired,
};
