import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  makeStyles,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import AnnouncementOutlinedIcon from '@material-ui/icons/AnnouncementOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { arrayOf, func } from 'prop-types';

import ChplAnnouncementEdit from './announcement-edit';

import { useFetchAnnouncementsActivity } from 'api/activity';
import ChplSystemMaintenanceActivity from 'components/activity/system-maintenance-activity';
import { ChplSearchResultCard } from 'components/util';
import { getDisplayDateFormat } from 'services/date-util';
import { UserContext } from 'shared/contexts';
import { announcement as announcementPropType } from 'shared/prop-types';
import { theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  actionContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  noResultsContainer: {
    padding: '16px 32px',
  },
});

function ChplAnnouncementsView({ announcements: initialAnnouncements = [], dispatch = () => {} }) {
  const { hasAnyRole } = useContext(UserContext);
  const [announcement, setAnnouncement] = useState(undefined);
  const [announcements, setAnnouncements] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    setAnnouncements(initialAnnouncements.sort((a, b) => (a.startDateTime < b.startDateTime ? -1 : 1)));
  }, [initialAnnouncements]);

  const handleActionBarDispatch = (action, payload) => {
    if (action !== 'close') {
      dispatch(action, {
        ...announcement,
        ...payload,
      });
    }
    setAnnouncement(undefined);
  };

  const getTitle = () => {
    if (!announcement) {
      return (
        <>
          Announcements
          <AnnouncementOutlinedIcon style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
        </>
      );
    }
    if (announcement.id) {
      return (
        <>
          Edit Announcement
          <AnnouncementOutlinedIcon style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
        </>
      );
    }
    return (
      <>
        Add Announcement
        <AnnouncementOutlinedIcon style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
      </>
    );
  };

  return (
    <Card>
      <CardHeader style={{ paddingLeft: '16px' }} title={getTitle()} />
      <CardContent>
        { announcement
          && (
            <div className={classes.actionContainer}>
              <ChplAnnouncementEdit
                announcement={announcement}
                dispatch={handleActionBarDispatch}
              />
            </div>
          )}
        { !announcement
          && (
            <>
              <Box className={classes.headerContainer}>
                <Box display="flex" flexDirection="row" gridGap={2} alignItems="center">
                  <Typography variant="subtitle2">
                    Announcements
                  </Typography>
                  <Typography variant="body2">
                    {`(${announcements.length} Result${announcements.length !== 1 ? 's' : ''})`}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gridGap={4}>
                  <ChplSystemMaintenanceActivity
                    fetch={useFetchAnnouncementsActivity}
                    title="Announcements"
                  />
                  { hasAnyRole(['chpl-admin', 'chpl-onc']) && (
                    <Button
                      color="primary"
                      variant="contained"
                      id="add-new-announcement"
                      onClick={() => setAnnouncement({})}
                      endIcon={<AddIcon />}
                    >
                      Add
                    </Button>
                  )}
                </Box>
              </Box>
              { (announcements.length === 0)
                && (
                  <Typography className={classes.noResultsContainer}>
                    No results found
                  </Typography>
                )}
              { announcements.length > 0
                && (
                  <Box style={{ maxHeight: 'calc(100vh - 300px)', overflow: 'auto', padding: '16px' }}>
                    { announcements
                      .map((item) => (
                        <ChplSearchResultCard
                          key={item.id}
                          title="Title"
                          titleValue={item.title}
                          fieldGroups={[
                            [
                              {
                                label: 'Text',
                                value: item.text || 'N/A',
                                xs: 12,
                                sm: 12,
                              },
                            ],
                            [
                              {
                                label: 'Start Date',
                                value: getDisplayDateFormat(item.startDateTime),
                                xs: 6,
                                sm: 3,
                              },
                              {
                                label: 'End Date',
                                value: getDisplayDateFormat(item.endDateTime),
                                xs: 6,
                                sm: 3,
                              },
                              {
                                label: 'Public?',
                                value: item.isPublic ? 'Yes' : 'No',
                                xs: 6,
                                sm: 3,
                              },
                            ],
                          ]}
                          actions={
                            hasAnyRole(['chpl-admin', 'chpl-onc']) && (
                              <Button
                                onClick={() => setAnnouncement(item)}
                                variant="contained"
                                color="secondary"
                                size="small"
                                endIcon={<EditOutlinedIcon />}
                              >
                                Edit
                              </Button>
                            )
                          }
                        />
                      ))}
                  </Box>
                )}
            </>
          )}
      </CardContent>
    </Card>
  );
}

export default ChplAnnouncementsView;

ChplAnnouncementsView.propTypes = {
  announcements: arrayOf(announcementPropType),
  dispatch: func,
};
