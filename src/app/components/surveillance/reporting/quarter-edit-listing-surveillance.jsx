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
import Edit from '@material-ui/icons/Edit';

import ChplQuarterEditListingSurveillanceData from './quarter-edit-listing-surveillance-data';

import { getDisplayDateFormat } from 'services/date-util';
import { theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingLeft: '16px',
    paddingRight: '16px',
    paddingTop: '0px',
    paddingBottom: '8px',
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
    padding: '16px 32px',
  },
  idContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    padding: '32px 16px 0px 16px',
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

function ChplQuarterEditListingSurveillance({ surveillance }) {
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

  const handleDispatch = ({ action }) => {
    console.log({action});
  };

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
            <strong>Surveillance ID:</strong>
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
        <Box style={{ padding: '8px 16px' }}>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            style={{ margin: '8px 0' }}
            endIcon={<Edit />}
            onClick={handleOpen}
          >
            Edit Surveillance Data
          </Button>
        </Box>
      </Card>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <CardHeader title="Surveillance Data" />
        <DialogContent>
          <div className={classes.container}>
            <ChplQuarterEditListingSurveillanceData
              surveillance={surveillance}
              dispatch={handleDispatch}
            />
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

export default ChplQuarterEditListingSurveillance;

ChplQuarterEditListingSurveillance.propTypes = {
  surveillance: object.isRequired,
};
