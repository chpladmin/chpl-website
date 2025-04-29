import React from 'react';
import {
  Box,
  Button,
  DialogContent,
  Dialog,
  Card,
  Typography,
  makeStyles,
  CardActionArea,
  CircularProgress,
  CardHeader,
} from '@material-ui/core';
import { object } from 'prop-types';
import { RemoveRedEye } from '@material-ui/icons';

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

function ChplQuarterViewListingSurveillance({
  surveillance,
}) {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [progress, setProgress] = React.useState(1);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 1 : 100));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Card style={{ width: '100%' }}>
        <div className={classes.idContainer}>
          <Typography>
            <strong>Friendly ID:</strong>
            {' '}
            {surveillance.friendlyId}
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
                  {`${Math.round(progress)}%`}
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
            {getDisplayDateFormat(surveillance.startDay)}
          </Typography>
          <Typography>
            <strong>End Day:</strong>
            {' '}
            {getDisplayDateFormat(surveillance.endDay)}
          </Typography>
          <Typography>
            <strong>Number of Closed Nonconformities:</strong>
            {' '}
            {surveillance.numClosedNonconformities}
          </Typography>
          <Typography>
            <strong>Number of Open Nonconformities:</strong>
            {' '}
            {surveillance.numOpenNonconformities}
          </Typography>
        </div>
        <CardActionArea style={{ padding: '8px' }}>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            style={{ margin: '8px 0' }}
            endIcon={<RemoveRedEye />}
            onClick={handleClickOpen}
          >
            View Surveillance Data Questionnaire
          </Button>
        </CardActionArea>
      </Card>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <CardHeader title="Surveillance Data Questionnaire" />
        <DialogContent>
          <div className={classes.container}>
            <Typography>
              <strong>Surveillance Type:</strong>
              {' '}
              {surveillance.surveillanceType?.name}
            </Typography>
            <Typography>
              <strong>k1 Reviewed:</strong>
              {' '}
              {surveillance.k1Reviewed}
            </Typography>
            <Typography>
              <strong>Surveillance Outcome:</strong>
              {' '}
              {surveillance.surveillanceOutcome?.name}
            </Typography>
            <Typography>
              <strong>Surveillance Outcome Other:</strong>
              {' '}
              {surveillance.surveillanceOutcomeOther}
            </Typography>
            <Typography>
              <strong>Surveillance Process Type Other:</strong>
              {' '}
              {surveillance.surveillanceProcessTypeOther}
            </Typography>
            <Typography>
              <strong>Surveillance Process Types:</strong>
              {' '}
              {surveillance.surveillanceProcessTypes.map((s) => s.name).join('; ')}
            </Typography>
            <Typography>
              <strong>Grounds For Initiating:</strong>
              {' '}
              {surveillance.groundsForInitiating}
            </Typography>
            <Typography>
              <strong>Surveillance Grounds For Initiating:</strong>
              {' '}
              {surveillance.surveillanceGroundsForInitiating.map((s) => s.name).join('; ')}
            </Typography>
            <Typography>
              <strong>Surveillance Grounds For Initiating Other:</strong>
              {' '}
              {surveillance.surveillanceGroundsForInitiatingOther}
            </Typography>
            <Typography>
              <strong>Nonconformity Causes:</strong>
              {' '}
              {surveillance.nonconformityCauses}
            </Typography>
            <Typography>
              <strong>Nonconformity Nature:</strong>
              {' '}
              {surveillance.nonconformityNature}
            </Typography>
            <Typography>
              <strong>Steps To Surveil:</strong>
              {' '}
              {surveillance.stepsToSurveil}
            </Typography>
            <Typography>
              <strong>Steps To Engage:</strong>
              {' '}
              {surveillance.stepsToEngage}
            </Typography>
            <Typography>
              <strong>Additional Costs Evaluation:</strong>
              {' '}
              {surveillance.additioanlCostsEvaluation}
            </Typography>
            <Typography>
              <strong>Limitations Evaluation:</strong>
              {' '}
              {surveillance.limitationsEvaluation}
            </Typography>
            <Typography>
              <strong>Nondisclosure Evaluation:</strong>
              {' '}
              {surveillance.nondisclosureEvaluation}
            </Typography>
            <Typography>
              <strong>Direction Developer Resolution:</strong>
              {' '}
              {surveillance.directionDeveloperResolution}
            </Typography>
            <Typography>
              <strong>CAP Statuses:</strong>
              {' '}
              {surveillance.capStatuses.map((s) => s.name).join('; ')}
            </Typography>
            <Typography>
              <strong>CAP Status Other:</strong>
              {' '}
              {surveillance.capStatusOther}
            </Typography>
            <Typography>
              <strong>Completed CAP Verification:</strong>
              {' '}
              {surveillance.completedCapVerification}
            </Typography>
            <Typography>
              <strong>Surveillance Findings:</strong>
              {' '}
              {surveillance.surveillanceFindings}
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
