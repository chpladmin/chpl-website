import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';

import { palette, theme } from 'themes';
import { useFetchAnnouncements } from 'api/announcements';

const useStyles = makeStyles({
  announcementBox: {
    color: palette.white,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'flex-start',
    gridGap: '8px',
    overflowY: 'auto',
    maxHeight: '18px',
    padding: '0 !important',
    '&:focus': {
      outline: 'none !important',
    },
    '&:focus-visible': {
      outline: 'none !important',
    },
    '&::-webkit-scrollbar': {
      width: '2px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1',
      borderRadius: '8px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: palette.primary,
      borderRadius: '8px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: theme.palette.primary.dark,
    },
  },
  footerAnnouncement: {
    display: 'flex !important',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderBottom: '2px solid #001f57 !important',
    boxShadow: 'none',
    zIndex: 999,
    paddingBottom: '4px',
  },
});

function ChplAnnouncementsDisplay() {
  const classes = useStyles();
  const { data, isLoading, isSuccess } = useFetchAnnouncements({ getFuture: false });
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    if (isLoading || !isSuccess) {
      return;
    }
    setAnnouncements(data.sort((a, b) => (a.startDateTime < b.startDateTime ? -1 : 1)));
  }, [data, isLoading, isSuccess]);

  return (
    <>
      {announcements.length > 0 && (
        <Container disableGutters className={classes.footerAnnouncement} maxWidth="lg" role="region" aria-live="polite" aria-label="Announcements">
          <Box className={classes.announcementBox}>
            {announcements.map((announcement, index) => (
              <Box justifyContent="space-between" display="flex" flexDirection="row" minWidth="99%" key={announcement.id}>
                <Box gridGap="8px" display="flex" flexDirection="row">
                  <Typography style={{ fontWeight: 600 }} role="heading" aria-level="2">
                    {announcement.title}
                  </Typography>
                  <Typography role="text">
                    {announcement.text}
                  </Typography>
                </Box>
                <Typography variant="body2" role="text">
                  {`${index + 1} / ${announcements.length}`}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      )}
    </>
  );
}

export default ChplAnnouncementsDisplay;

ChplAnnouncementsDisplay.propTypes = {
};
