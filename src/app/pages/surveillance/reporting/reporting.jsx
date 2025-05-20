import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import { useFetchAcbs } from 'api/acbs';
import ChplReport from 'components/surveillance/reporting/report';
import { theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingTop: '16px',
    gap: '16px',
    [theme.breakpoints.up('md')]: {
      display: 'grid',
      gridTemplateColumns: '1fr 3fr',
      alignItems: 'start',
    },
  },
  fixFooterSpacing: {
    minHeight: 'calc(100vh - 100px)',
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
  const [acbs, setAcbs] = useState([]);
  const [activeAcb, setActiveAcb] = useState(undefined);
  const [state, setState] = useState('');
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
      case 'cancel':
        setState('');
        break;
      case 'focus':
        setState('focus');
        break;
      default:
        console.error(`No action found for ${action} with payload ${payload}`);
        // no default
    }
  };

  const navigate = (acb) => {
    setActiveAcb(acb);
  };

  return (
    <Container className={classes.fixFooterSpacing} maxWidth="lg">
      <div className={(acbs.length > 1 && state === '') ? classes.container : ''}>
        { acbs.length > 1 && state === ''
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
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom component="h2">
                  <strong>Quarterly and Annual Surveillance Reporting</strong>
                </Typography>
                <Typography gutterBottom>
                  To view detailed quarterly and annual reports, start by selecting an ONC-ACB from the menu on the left.
                </Typography>
                <Typography>
                  Once selected, the corresponding reports will appear here, giving you access to key performance data and year-end summaries.
                </Typography>
              </CardContent>
            </Card>
          )}
        { activeAcb
          && (
            <ChplReport
              acb={activeAcb}
              dispatch={handleDispatch}
            />
          )}
      </div>
    </Container>
  );
}

export default ChplSurveillanceReporting;

ChplSurveillanceReporting.propTypes = {
};
