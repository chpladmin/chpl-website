import React, { useEffect, useState } from 'react';
import { Container, IconButton, Box } from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';

import { palette } from 'themes';
import { useFetchAnnouncements } from 'api/announcements';

const useStyles = makeStyles(() => ({
  announcementBox: {
    color: palette.white,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignContent: 'center',
  },
  nextButton: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  footerAnnouncement: {
    display: 'flex!important',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderBottom: '1px solid #001f57!important',
    boxShadow: 'none',
    zIndex: 1001,
  },
}));

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

    // Show notification only once per session
    const hasSeenAnnouncements = sessionStorage.getItem('hasSeenAnnouncements');
    if (!hasSeenAnnouncements) {
      sessionStorage.setItem('hasSeenAnnouncements', 'true');
    } else {
      setAnnouncements([]);
    }
  }, [data, isLoading, isSuccess]);

  useEffect(() => {
    if (announcements.length === 0) {
      return undefined; // Explicitly return undefined
    }

    const interval = setInterval(() => {
      setCurrentAnnouncementIndex((prevIndex) => (prevIndex + 1) % announcements.length);
    }, 15000); // Change every 15 seconds

    return () => clearInterval(interval);
  }, [announcements]);

  if (announcements.length === 0) {
    return null;
  }

  const currentAnnouncement = announcements[currentAnnouncementIndex];

  const handleNext = () => {
    if (currentAnnouncementIndex + 1 >= announcements.length) {
      setAnnouncements([]);
    } else {
      setCurrentAnnouncementIndex((prevIndex) => (prevIndex + 1) % announcements.length);
    }
  };

  return (
    <Container className={classes.footerAnnouncement} maxWidth="lg">
      <Box className={classes.announcementBox} key={currentAnnouncement.id}>
        {currentAnnouncement.title}
        {currentAnnouncement.text ? `: ${currentAnnouncement.text}` : ''}
      </Box>
      <Box className={classes.nextButton}>
        <IconButton onClick={handleNext}>
          {currentAnnouncementIndex + 1 >= announcements.length ? (
            <CloseIcon color="secondary" />
          ) : (
            <ArrowForwardIcon color="secondary" />
          )}
        </IconButton>
      </Box>
    </Container>
  );
}

export default ChplAnnouncementsDisplay;

ChplAnnouncementsDisplay.propTypes = {
};
