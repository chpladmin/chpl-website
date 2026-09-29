import React, { useContext, useEffect, useState } from 'react';
import {
  Box, Button, Card, CardContent, CardHeader, Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AnnouncementOutlinedIcon from '@mui/icons-material/AnnouncementOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { arrayOf, func } from 'prop-types';

import ChplAnnouncementEdit from './announcement-edit';

import { useFetchAnnouncementsActivity } from 'api/activity';
import ChplSystemMaintenanceActivity from 'components/activity/system-maintenance-activity';
import { ChplSearchResultCard } from 'components/util';
import { getDisplayDateFormat } from 'services/date-util';
import { UserContext } from 'shared/contexts';
import { announcement as announcementPropType } from 'shared/prop-types';
import { theme, utilStyles } from 'themes';

const styles = {
  ...utilStyles,
  actionContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  noResultsContainer: {
    padding: '16px 32px',
  },
};

function ChplAnnouncementsView({ announcements: initialAnnouncements = [], dispatch = () => {} }) {
  const { hasAnyRole } = useContext(UserContext);
  const [announcement, setAnnouncement] = useState(undefined);
  const [announcements, setAnnouncements] = useState([]);

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
            <Box sx={styles.actionContainer}>
              <ChplAnnouncementEdit
                announcement={announcement}
                dispatch={handleActionBarDispatch}
              />
            </Box>
          )}
        { !announcement
          && (
            <>
              <Box sx={styles.headerContainer}>
                <Box display="flex" flexDirection="row" gap="2px" alignItems="center">
                  <Typography variant="subtitle2">
                    Announcements
                  </Typography>
                  <Typography variant="body2">
                    {`(${announcements.length} Result${announcements.length !== 1 ? 's' : ''})`}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap="4px">
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
                  <Typography sx={styles.noResultsContainer}>
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
                          cardTitle="Title"
                          cardTitleValue={item.title}
                          fieldGroups={[
                            [
                              {
                                label: 'Text',
                                value: item.text || 'N/A',
                              },
                            ],
                            [
                              {
                                label: 'Start Date',
                                value: getDisplayDateFormat(item.startDateTime),
                              },
                              {
                                label: 'End Date',
                                value: getDisplayDateFormat(item.endDateTime),
                              },
                              {
                                label: 'Public?',
                                value: item.isPublic ? 'Yes' : 'No',
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
