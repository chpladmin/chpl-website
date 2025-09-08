import React, { useContext, useState, useEffect } from 'react';
import {
  Box,
  Typography,
  makeStyles,
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import VisibilityIcon from '@material-ui/icons/Visibility';

import { DeveloperContext } from 'shared/contexts';

const useStyles = makeStyles({
  statusOpen: {
    color: '#4caf50',
  },
  statusClosed: {
    color: '#f44336',
  },
});

function ChplDashboardSurveillance() {
  const { developer } = useContext(DeveloperContext);
  const [surveillanceActivities, setSurveillanceActivities] = useState(undefined);
  const classes = useStyles();

  useEffect(() => {
    // todo: update API to provide data needed to fill in this data
    const surveillanceData = [];

    developer.products.forEach((product) => {
      product.versions?.forEach((version) => {
        version.listings?.forEach((listing) => {
          listing.surveillance?.forEach((surveillance) => {
            const startDate = surveillance.startDay ? new Date(surveillance.startDay).toLocaleDateString() : '';
            const endDate = surveillance.endDay ? new Date(surveillance.endDay).toLocaleDateString() : '';

            let period = '';
            if (surveillance.endDay) {
              period = `Ended ${endDate}`;
            } else if (surveillance.startDay) {
              period = `Began ${startDate}`;
            } else {
              period = 'Date not specified';
            }

            const status = surveillance.endDay ? 'Close' : 'Open';

            surveillanceData.push({
              id: surveillance.id,
              friendlyId: surveillance.friendlyId,
              period,
              status,
              type: surveillance.type?.name || 'Unknown',
              productName: product.name,
              listingChplProductNumber: listing.chplProductNumber,
              hasNonconformities: surveillance.requirements?.some((req) => req.nonconformities && req.nonconformities.length > 0
              ) || false,
            });
          });
        });
      });
    });

    surveillanceData.sort((a, b) => {
      const dateA = a.period.includes('Ended')
        ? new Date(a.period.replace('Ended ', ''))
        : new Date(a.period.replace('Began ', ''));
      const dateB = b.period.includes('Ended')
        ? new Date(b.period.replace('Ended ', ''))
        : new Date(b.period.replace('Began ', ''));
      return dateB - dateA;
    });

    setSurveillanceActivities(surveillanceData);
  }, [developer]);

  if (!developer || !surveillanceActivities || true) { // todo: remove "true" when api is updated
    return (
      <Box display="flex" justifyContent="space-between" alignItems="center" style={{ marginBottom: '16px' }}>
        <Typography variant="h6">Surveillance Activities</Typography>
        <Skeleton animation={false} variant="text" width="80%" height={20} style={{ marginBottom: 8 }} />
        <Skeleton animation={false} variant="text" width="100%" height={16} style={{ marginBottom: 4 }} />
        <Skeleton animation={false} variant="text" width="90%" height={16} style={{ marginBottom: 16 }} />
        <Skeleton animation={false} variant="text" width="75%" height={20} style={{ marginBottom: 8 }} />
        <Skeleton animation={false} variant="text" width="100%" height={16} style={{ marginBottom: 4 }} />
        <Skeleton animation={false} variant="text" width="85%" height={16} style={{ marginBottom: 16 }} />
        <Skeleton animation={false} variant="text" width="85%" height={20} style={{ marginBottom: 8 }} />
        <Skeleton animation={false} variant="text" width="100%" height={16} style={{ marginBottom: 4 }} />
        <Skeleton animation={false} variant="text" width="95%" height={16} style={{ marginBottom: 16 }} />
        <Skeleton animation={false} variant="text" width="70%" height={20} style={{ marginBottom: 8 }} />
        <Skeleton animation={false} variant="text" width="100%" height={16} style={{ marginBottom: 4 }} />
        <Skeleton animation={false} variant="text" width="90%" height={16} style={{ marginBottom: 16 }} />
        <Skeleton animation={false} variant="rect" width="100%" height={32} style={{ marginTop: 16 }} />
      </Box>
    );
  }

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" style={{ marginBottom: '16px' }}>
        <Typography variant="h6">Surveillance Activities</Typography>
        <Typography variant="body2">
          (
          {surveillanceActivities.length}
          {' '}
          Found)
        </Typography>
      </Box>
      <Typography variant="body2" style={{ marginBottom: '16px' }}>
        Open surveillance information that pertains to this listing under this developer can be found here.
      </Typography>
      {surveillanceActivities.length === 0 ? (
        <Typography variant="body2" style={{ margin: '12px 0', fontStyle: 'italic' }}>
          No surveillance activities found
        </Typography>
      ) : (
        <>
          <Box display="flex" justifyContent="space-between" style={{ marginBottom: '16px' }}>
            <Typography variant="subtitle2">Period</Typography>
            <Typography variant="subtitle2">Status</Typography>
          </Box>
          {surveillanceActivities.slice(0, 5).map((item, index) => (
            <Box key={item.id || `surveillance-${index}`} display="flex" justifyContent="space-between" alignItems="center" style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
              <Box>
                <Typography variant="body2">{item.period}</Typography>
                {item.productName && (
                  <Typography variant="caption" color="textSecondary">
                    {item.productName}
                    {' '}
                    -
                    {' '}
                    {item.type}
                  </Typography>
                )}
              </Box>
              <Box display="flex" alignItems="center">
                <Typography
                  variant="body2"
                  className={item.status === 'Open' ? classes.statusOpen : classes.statusClosed}
                  style={{ marginRight: '8px' }}
                >
                  {item.status}
                  {item.hasNonconformities && ' (NC)'}
                </Typography>
                <VisibilityIcon color="primary" />
              </Box>
            </Box>
          ))}
          {surveillanceActivities.length > 5 && (
            <Typography variant="body2" color="primary" style={{ marginTop: '12px', textDecoration: 'underline', cursor: 'pointer' }}>
              View all
              {' '}
              {surveillanceActivities.length}
              {' '}
              surveillance activities
            </Typography>
          )}
        </>
      )}
    </>
  );
}
export default ChplDashboardSurveillance;
