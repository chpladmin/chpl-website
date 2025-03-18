import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Button,
  Container,
  IconButton,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import { palette } from 'themes';
import { useFetchAnnouncements } from 'api/announcements';
import { getAngularService } from 'services/angular-react-helper';

const useStyles = makeStyles({
  announcementBox: {
    color: palette.white,
    display: 'flex',
    flexDirection: 'row !important',
    width: '95%',
    alignItems: 'center',
    gridGap: '8px',
    padding: '0 !important',
  },
  nextButton: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '4px',
  },
  nextButtonOutline: {
    '&:focus': {
      outline: 'solid 2px rgb(255, 255, 255)',
    },
    '&:focus-visible': {
      outline: 'solid 2px rgb(255, 255, 255)',
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
  const $state = getAngularService('$state');
  const announcementRef = useRef(null);
  const nextButtonRef = useRef(null);

  useEffect(() => {
    if (isLoading || !isSuccess) {
      return;
    }
    setAnnouncements(data.sort((a, b) => (a.startDateTime < b.startDateTime ? -1 : 1)));
  }, [data, isLoading, isSuccess]);

  let currentAnnouncement = {};
  if (announcements.length > 0) {
    currentAnnouncement = announcements[currentAnnouncementIndex];
  }
  const handleNext = () => {
    setCurrentAnnouncementIndex((prevIndex) => (prevIndex + 1) % announcements.length);
    if (document.activeElement === nextButtonRef.current && announcementRef.current) {
      announcementRef.current.focus();
    }
  };

  return (
    <>
      {announcements.length > 0 && (
        <Container disableGutters className={classes.footerAnnouncement} maxWidth="lg">
          {currentAnnouncement.id && (
            <>
              <Box
                className={classes.announcementBox}
                key={currentAnnouncement.id}
                ref={announcementRef}
                tabIndex="0"
              >
                <strong>
                  {currentAnnouncement.title.length > 25
                    ? `${currentAnnouncement.title.substring(0, 25)}`
                    : currentAnnouncement.title}
                </strong>
                {`${currentAnnouncement.text.substring(0, 200)}`}
              </Box>
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
                <IconButton
                  disableFocusRipple
                  aria-label='Reveal the next announcement.'
                  size="small"
                  onClick={handleNext}
                  ref={nextButtonRef}
                  className={classes.nextButtonOutline}
                  tabIndex="0"
                >
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
