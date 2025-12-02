import React, { useEffect, useState } from 'react';
import {
  Badge,
  Box,
  Fab,
  IconButton,
  Paper,
  Slide,
  Typography,
  makeStyles,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { useFetchAnnouncements } from 'api/announcements';
import { palette } from 'themes';

const useStyles = makeStyles({
  fab: {
    position: 'sticky',
    zIndex: 96000,
    backgroundColor: palette.primary,
    color: 'white',
    '&:hover': {
      backgroundColor: palette.primaryDark,
    },
  },
  badge: {
    backgroundColor: palette.primary,
    color: 'white',
    height: '20px',
    minWidth: '20px',
    fontSize: '0.75rem',
  },
  paper: {
    position: 'sticky',
    width: '325px',
    top: '140px',
    right: '0px',
    position: 'fixed',
    maxWidth: 'calc(100vw - 48px)',
    maxHeight: 'calc(100vh - 100px)',
    zIndex: 9998,
    display: 'flex',
    flexDirection: 'column',
    border: `1px solid ${palette.divider}`,
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
  header: {
    padding: '16px',
    backgroundColor: palette.primary,
    color: 'white',
    borderRadius: '8px 0px 0px 0px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    padding: '16px',
    overflowY: 'auto',
    flex: 1,
  },
  announcement: {
    marginBottom: '16px',
    paddingBottom: '16px',
    wordWrap: 'break-word',
    borderBottom: `1px solid ${palette.divider}`,
    '&:last-child': {
      borderBottom: 'none',
      marginBottom: 0,
      paddingBottom: 0,
    },
  },
  carouselControls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    borderTop: '1px solid #e0e0e0',
    backgroundColor: '#f5f5f5',
  },
  noAnnouncements: {
    textAlign: 'center',
    color: '#999',
    padding: '32px 16px',
  },
});

function ChplAnnouncementsFab() {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const { data, isLoading, isSuccess } = useFetchAnnouncements({ getFuture: false });
  const [announcements, setAnnouncements] = useState([]);

  console.log('ChplAnnouncementsFab rendering', { isLoading, isSuccess, dataLength: data?.length });

  useEffect(() => {
    if (isLoading || !isSuccess) {
      return;
    }
    setAnnouncements(data.sort((a, b) => a.startDate - b.startDate));
  }, [data, isLoading, isSuccess]);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      {!expanded && (
        <Fab
          className={classes.fab}
          onClick={handleToggle}
          elevation={0}
          aria-label="Show announcements"
        >
          <Badge
            badgeContent={announcements.length}
            classes={{ badge: classes.badge }}
            overlap="rectangular"
            max={99}
          >
            <NotificationsIcon style={{ color: palette.secondary}} />
          </Badge>
        </Fab>
      )}

      <Slide direction="up" in={expanded} mountOnEnter unmountOnExit>
        <Paper elevation={0} className={classes.paper}>
          <Box className={classes.header}>
            <Typography variant="h6">
              Announcement{announcements.length !== 1 ? 's' : ''}
            </Typography>
            <IconButton
              size="small"
              onClick={handleToggle}
              style={{ color: 'white' }}
              aria-label="Close announcements"
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Box className={classes.content}>
            {announcements.length === 0 ? (
              <Box className={classes.noAnnouncements}>
                <Typography variant="body1">
                  No current announcements
                </Typography>
              </Box>
            ) : (
              announcements.map((announcement, index) => (
                <Box key={announcement.id || index} className={classes.announcement}>
                  <Typography variant="body1">
                    <strong>{announcement.title}</strong>
                    {announcement.text && (
                      <>
                        : {announcement.text}
                      </>
                    )}
                  </Typography>
                </Box>
              ))
            )}
          </Box>
        </Paper>
      </Slide>
    </>
  );
}

export default ChplAnnouncementsFab;
