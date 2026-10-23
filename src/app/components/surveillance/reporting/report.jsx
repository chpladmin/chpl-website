import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  MenuItem,
  Skeleton,
} from '@mui/material';
import { func } from 'prop-types';

import ChplAnnual from './annual';
import ChplQuarter from './quarter';

import { useFetchAnnual, useFetchQuarters, useFetchQuarterly } from 'api/surveillance';
import { ChplSkeletonCard, ChplTextField } from 'components/util';
import { acb as acbPropType } from 'shared/prop-types';
import { utilStyles } from 'themes';

// Stands in for data that hasn't arrived. A constant, so the effect below that
// depends on it doesn't re-run on every render
const none = [];

const loadingStyles = {
  // The CardHeader and CardContent padding of the active year card
  section: {
    padding: '16px',
  },
  // The grid the quarter and annual cards sit in
  reports: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '12px',
  },
  report: {
    minWidth: '250px',
    minHeight: '121px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
};

// The active year card over one card for each quarter and one for the year
function ChplReportLoading() {
  return (
    <Box role="status" aria-live="polite">
      <Box component="span" sx={utilStyles.visuallyHidden}>Loading surveillance reports</Box>
      <Box display="flex" flexDirection="column" gap="16px" aria-hidden="true">
        <ChplSkeletonCard>
          <Box sx={loadingStyles.section}>
            <Skeleton variant="text" width="30%" height={32} />
          </Box>
          <Box sx={loadingStyles.section}>
            <Skeleton variant="rectangular" height={40} sx={{ borderRadius: '4px' }} />
          </Box>
        </ChplSkeletonCard>
        <Box sx={loadingStyles.reports}>
          {['Q1', 'Q2', 'Q3', 'Q4', 'Annual'].map((report) => (
            <ChplSkeletonCard key={report} sx={loadingStyles.report}>
              <Skeleton variant="text" width="60%" height={42} />
              <Skeleton variant="text" width="85%" height={20} />
              <Skeleton variant="rectangular" width={100} height={30} sx={{ borderRadius: '4px', marginTop: '8px' }} />
            </ChplSkeletonCard>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

function ChplReport({ acb, dispatch }) {
  const annualQuery = useFetchAnnual();
  const quarterQuery = useFetchQuarters();
  const quarterlyQuery = useFetchQuarterly();
  const [activeYear, setActiveYear] = useState(new Date().getYear() + 1900);
  const [filteredAnnual, setFilteredAnnual] = useState([]);
  const [filteredQuarterly, setFilteredQuarterly] = useState([]);
  const [state, setState] = useState('');
  const availableYears = [...Array(new Date().getYear() + 1900 - 2019 + 1)]
    .map((_, i) => 2019 + i)
    .sort((a, b) => b - a);

  const annual = annualQuery.data ?? none;
  const quarters = quarterQuery.data ?? none;
  const quarterly = quarterlyQuery.data ?? none;

  useEffect(() => {
    setFilteredAnnual((annual).find((r) => r.acb.id === acb.id && r.year === activeYear));
    setFilteredQuarterly((quarterly).filter((r) => r.acb.id === acb.id && r.year === activeYear));
  }, [annual, quarterly, acb, activeYear]);

  // Wait on the queries rather than on their data, so a year with no reports
  // yet still shows the cards to initiate them
  if (annualQuery.isLoading || quarterQuery.isLoading || quarterlyQuery.isLoading) {
    return <ChplReportLoading />;
  }

  const handleDispatch = ({ action, payload }) => {
    switch (action) {
      case 'cancel':
        setState('');
        dispatch({ action: 'cancel' });
        break;
      case 'focus-annual':
        setState('focus-annual');
        dispatch({ action: 'focus' });
        break;
      case 'focus-quarter-Q1':
        setState('focus-quarter-Q1');
        dispatch({ action: 'focus' });
        break;
      case 'focus-quarter-Q2':
        setState('focus-quarter-Q2');
        dispatch({ action: 'focus' });
        break;
      case 'focus-quarter-Q3':
        setState('focus-quarter-Q3');
        dispatch({ action: 'focus' });
        break;
      case 'focus-quarter-Q4':
        setState('focus-quarter-Q4');
        dispatch({ action: 'focus' });
        break;
      default:
        dispatch({ action, payload });
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap="16px">
      { state === ''
        && (
          <Card>
            <CardHeader title={acb.name} />
            <CardContent>
              <ChplTextField
                select
                id="active-year"
                name="activeYear"
                label="Active Year"
                value={activeYear}
                onChange={(event) => setActiveYear(event.target.value)}
              >
                { availableYears
                  .map((item) => (
                    <MenuItem value={item} key={item}>{item}</MenuItem>
                  ))}
              </ChplTextField>
            </CardContent>
          </Card>
        )}
      <Box
        display="grid"
        gridTemplateColumns={state === '' ? 'repeat(auto-fill, minmax(250px, 1fr))' : 'repeat(1, 1fr)'}
        gap="12px"
        alignItems="stretch"
        justifyItems="stretch"
      >
        { quarters.filter((q) => state === '' || state === `focus-quarter-${q.name}`)
          .map((q) => (
            <ChplQuarter
              dispatch={handleDispatch}
              key={q.id}
              quarter={q}
              report={filteredQuarterly.find((r) => r.quarter === q.name)}
              year={activeYear}
              acb={acb}
              style={{ minWidth: '250px', minHeight: '275px' }}
            />
          ))}
        { (state === '' || state === 'focus-annual')
          && (
            <ChplAnnual
              dispatch={handleDispatch}
              report={filteredAnnual}
              year={activeYear}
              acb={acb}
              style={{ minWidth: '250px', minHeight: '275px' }}
            />
          )}
      </Box>
    </Box>
  );
}

export default ChplReport;
export { ChplReportLoading };

ChplReport.propTypes = {
  acb: acbPropType.isRequired,
  dispatch: func.isRequired,
};
