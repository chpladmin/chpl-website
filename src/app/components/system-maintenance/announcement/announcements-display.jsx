import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  IconButton,
  makeStyles,
  Typography,
} from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { palette } from 'themes';
import { useFetchAnnouncements } from 'api/announcements';

const useStyles = makeStyles({
  announcementBox: {
    color: palette.white,
    display: 'flex',
    flexDirection: 'row',
    width: '90%',
    alignContent: 'center',
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
      return undefined; // Explicitly return undefined
    }
    return () => {}; // Return a cleanup function or an empty function
  }, [announcements]);

  const currentAnnouncement = announcements[currentAnnouncementIndex];

  const handleNext = () => {
    setCurrentAnnouncementIndex((prevIndex) => (prevIndex + 1) % announcements.length);
  };

  const handlePrevious = () => {
    setCurrentAnnouncementIndex((prevIndex) => (prevIndex - 1 + announcements.length) % announcements.length);
  };

  return (
    <Container disableGutters className={classes.footerAnnouncement} maxWidth="lg">
      <Box className={classes.announcementBox} key={currentAnnouncement.id}>
        <strong>{currentAnnouncement.title}</strong>
        {currentAnnouncement.text ? `: ${currentAnnouncement.text}` : ''}
      </Box>
      <Box className={classes.counter}>
        {announcements.length > 1 && (
        <Typography color="secondary" variant="body2">
          {currentAnnouncementIndex + 1}
          {' '}
          /
          {announcements.length}
        </Typography>
        )}
      </Box>
      {announcements.length > 1 && (
        <Box className={classes.nextButton}>
          <IconButton onClick={handlePrevious}>
            <ArrowBackIcon color="secondary" />
          </IconButton>
          <IconButton onClick={handleNext}>
            <ArrowForwardIcon color="secondary" />
          </IconButton>
        </Box>
      )}
    </Container>
  );
}

export default ChplAnnouncementsDisplay;

ChplAnnouncementsDisplay.propTypes = {
};
