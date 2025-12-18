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
import { ErrorBoundary } from 'react-error-boundary';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import { useFetchAcbs } from 'api/acbs';
import { ChplActionBar } from 'components/action-bar';
import { ChplConfirmDeveloper, ChplConfirmProduct, ChplConfirmVersion, ChplConfirmListing, ChplConfirmProgress } from 'components/listing/confirm';
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

function ChplConfirm() {
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
    }
  };

  return (
    <Container className={classes.fixFooterSpacing} maxWidth="lg">
      <div className={classes.container}>
        Header
        <ErrorBoundary fallback={<div>Progress Bar went wrong</div>}>
          <ChplConfirmProgress />
        </ErrorBoundary>
        <ErrorBoundary fallback={<div>Developer went wrong</div>}>
          <ChplConfirmDeveloper />
        </ErrorBoundary>
        <ErrorBoundary fallback={<div>Product went wrong</div>}>
          <ChplConfirmProduct />
        </ErrorBoundary>
        <ErrorBoundary fallback={<div>Version went wrong</div>}>
          <ChplConfirmVersion />
        </ErrorBoundary>
        <ErrorBoundary fallback={<div>Listing went wrong</div>}>
          <ChplConfirmListing />
        </ErrorBoundary>
        <ErrorBoundary fallback={<div>Action Bar went wrong</div>}>
          <ChplActionBar />
        </ErrorBoundary>
      </div>
    </Container>
  );
}

export default ChplConfirm;

ChplConfirm.propTypes = {
};
