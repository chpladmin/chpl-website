import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Skeleton,
  Typography,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { useFetchAcbs } from 'api/acbs';
import ChplReport, { ChplReportLoading } from 'components/surveillance/reporting/report';
import { ChplPageBody, ChplPageHeader, ChplSkeletonCard } from 'components/util';
import { compareOrganizations } from 'services/sort.service';
import { UserContext } from 'shared/contexts';
import { theme, utilStyles } from 'themes';

const styles = {
  ...utilStyles,
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '16px',
    [theme.breakpoints.up('md')]: {
      display: 'grid',
      gridTemplateColumns: '1.5fr 4fr',
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
};

const loadingStyles = {
  // A menu Button: its 8px padding around a line of text
  menuItem: {
    padding: '8px',
  },
  intro: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
};

// The ONC-ACB menu beside the introduction card
function ChplSurveillanceReportingLoading() {
  return (
    <Box role="status" aria-live="polite">
      <Box component="span" sx={utilStyles.visuallyHidden}>Loading ONC-ACBs</Box>
      <Box sx={styles.container} aria-hidden="true">
        <ChplSkeletonCard>
          {[...Array(6)].map((_acb, idx) => (
            // eslint-disable-next-line react/no-array-index-key
            <Box key={idx} sx={loadingStyles.menuItem}>
              <Skeleton variant="text" width="70%" height={24} />
            </Box>
          ))}
        </ChplSkeletonCard>
        <ChplSkeletonCard sx={loadingStyles.intro}>
          <Skeleton variant="text" width="55%" height={40} />
          <Skeleton variant="text" width="95%" height={24} />
          <Skeleton variant="text" width="85%" height={24} />
        </ChplSkeletonCard>
      </Box>
    </Box>
  );
}

const none = [];

function ChplSurveillanceReporting() {
  const { hasAnyRole } = useContext(UserContext);
  const acbQuery = useFetchAcbs(true);
  const [activeAcb, setActiveAcb] = useState(undefined);
  const [state, setState] = useState('');
  const acbs = useMemo(() => (acbQuery.data ? [...acbQuery.data.acbs].sort(compareOrganizations) : none), [acbQuery.data]);

  useEffect(() => {
    if (acbs.length === 1) {
      setActiveAcb(acbs[0]);
    }
  }, [acbs]);

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

  // A single ONC-ACB opens straight away, so wait for it to be selected too.
  // ONC-ACB users usually have only their own, so they see the report's shape
  // rather than the menu's
  if (acbQuery.isLoading || (acbs.length === 1 && !activeAcb)) {
    return (
      <>
        <ChplPageHeader text="Surveillance Reporting" />
        <ChplPageBody>
          { hasAnyRole(['chpl-admin', 'chpl-onc'])
            ? <ChplSurveillanceReportingLoading />
            : <ChplReportLoading /> }
        </ChplPageBody>
      </>
    );
  }

  return (
    <>
      <ChplPageHeader text="Surveillance Reporting" />
      <ChplPageBody>
        <Box sx={(acbs.length > 1 && state === '') ? styles.container : undefined}>
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
                  sx={styles.menuItems}
                >
                  <Box display="flex" flexDirection="row" gap="4px">
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
        </Box>
      </ChplPageBody>
    </>
  );
}

export default ChplSurveillanceReporting;

ChplSurveillanceReporting.propTypes = {
};
