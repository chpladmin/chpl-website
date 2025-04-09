import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { useSnackbar } from 'notistack';

import { useFetchAcbs } from 'api/acbs';
import {
  useDeleteTrigger,
  useFetchJobTypes,
  useFetchUserTriggers,
  usePostTrigger,
  usePutJob,
  usePutTrigger,
} from 'api/jobs';
import ChplJobEdit from 'components/jobs/job-edit';
import ChplReportJobTypesView from 'components/jobs/report-job-types-view';
import ChplUserTriggersView from 'components/jobs/user-triggers-view';
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

function ChplSurveillanceReporting() {
  const acbQuery = useFetchAcbs(true);
  const { enqueueSnackbar } = useSnackbar();
  const [acbs, setAcbs] = useState([]);
  const [activeAcb, setActiveAcb] = useState(undefined);
  const classes = useStyles();

  useEffect(() => {
    if (acbQuery.isLoading || !acbQuery.isSuccess) { return; }
    setAcbs(acbQuery.data.acbs);
    if (acbQuery.data.acbs.length === 1) {
      setActiveAcb(acbQuery.data.acbs[0]);
    }
  }, [acbQuery.data, acbQuery.isLoading, acbQuery.isSuccess]);

  const handleDispatch = ({ action, payload }) => {
    switch (action) {
      default:
        console.error(`No action found for ${action} with payload ${payload}`);
        // no default
    }
  };

  const navigate = (acb) => {
    console.log(`Navigating to ${acb}`);
    setActiveAcb(acb);
  };

  return (
    <Container maxWidth="lg">
      <div className={acbs.length > 1 ? classes.container : ''}>
        { acbs.length > 1
          && (
            <Card>
              { acbs.map((acb) => (
                <Button
                  key={acb.name}
                  onClick={() => navigate(acb)}
                  disabled={acbs.find((o) => o.id === activeAcb?.id)?.name === acb.name}
                  id={`acb-navigation-${acb.name}`}
                  fullWidth
                  variant="text"
                  color="primary"
                  endIcon={<ArrowForwardIcon />}
                  className={classes.menuItems}
                >
                  <Box display="flex" flexDirection="row" gridGap={4}>
                    { acb.retired ? <Chip size="small" color="default" variant="outlined" label="Retired" /> : '' }
                    { acb.name }
                  </Box>
                </Button>
              ))}
            </Card>
          )}
        { !activeAcb
          && (
            <Typography>
              Reports go here
            </Typography>
          )}
        { activeAcb
          && (
            <Card>
              <Typography>{activeAcb.name}</Typography>
            </Card>
          )}
      </div>
    </Container>
  );
}

export default ChplSurveillanceReporting;

ChplSurveillanceReporting.propTypes = {
};
