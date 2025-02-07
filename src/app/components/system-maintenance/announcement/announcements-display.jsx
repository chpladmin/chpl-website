import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  IconButton,
  Button,
  makeStyles,
  Typography,
} from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import { palette } from 'themes';
import { useFetchAnnouncements } from 'api/announcements';

const useStyles = makeStyles({
  announcementBox: {
    color: palette.white,
    display: 'flex',
    flexDirection: 'row',
    width: '90%',
    alignItems: 'center',
    gridGap: '8px',
  },
  nextButton: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '4px',
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
  counter: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  readMore: {
    fontSize: '1.2rem',
  },
});

function ChplAnnouncementsDisplay() {
  const classes = useStyles();
  const { data, isLoading, isSuccess } = useFetchAnnouncements({ getFuture: false });
  const [announcements, setAnnouncements] = useState([]);
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);

  useEffect(() => {
    if (isLoading || !isSuccess) {
      return;
    }
    const sortedAnnouncements = data.sort((a, b) => (a.startDateTime < b.startDateTime ? -1 : 1));
    setAnnouncements(sortedAnnouncements);
  }, [data, isLoading, isSuccess]);

  useEffect(() => {
    if (announcements.length === 0) {
      return undefined;
    }
    return () => {};
  }, [announcements]);

  const currentAnnouncement = announcements[currentAnnouncementIndex] || {};

  const handleNext = () => {
    setCurrentAnnouncementIndex((prevIndex) => (prevIndex + 1) % announcements.length);
  };

  return (
    <>
      {announcements.length > 0 && (
        <Container disableGutters className={classes.footerAnnouncement} maxWidth="lg">
          {currentAnnouncement.id && (
            <>
              <Box className={classes.announcementBox} key={currentAnnouncement.id}>
                <strong>{currentAnnouncement.title}</strong>
                {`${currentAnnouncement.text.substring(0, 160)}...`}
              </Box>
              <Button className={classes.readMore} variant="text" color="secondary" size="small" onClick={() => { window.location.href = '#/resources/overview'; window.scrollTo(0, 0); }}>Read more</Button>
            </>
          )}
          {announcements.length > 1 && (
            <>
              <Box className={classes.counter}>
                <Typography color="secondary" variant="body2">
                  {currentAnnouncementIndex + 1}
                  {' '}
                  /
                  {announcements.length}
                </Typography>
              </Box>
              <Box className={classes.nextButton}>
                <IconButton size="small" onClick={handleNext}>
                  <ArrowForwardIcon size="small" color="secondary" />
                </IconButton>
              </Box>
            </>
          )}
        </Container>
      )}
    </>
  );
}

export default ChplAnnouncementsDisplay;

ChplAnnouncementsDisplay.propTypes = {
};
