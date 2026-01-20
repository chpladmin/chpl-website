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
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { arrayOf, func } from 'prop-types';

import ChplAnnouncementEdit from './announcement-edit';

import { useFetchAnnouncementsActivity } from 'api/activity';
import ChplSystemMaintenanceActivity from 'components/activity/system-maintenance-activity';
import { ChplSearchResultCard } from 'components/util';
import { getDisplayDateFormat } from 'services/date-util';
import { BreadcrumbContext, UserContext } from 'shared/contexts';
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

function ChplAnnouncementsView({ announcements: initialAnnouncements, dispatch }) {
  const { append, display, hide } = useContext(BreadcrumbContext);
  const { hasAnyRole } = useContext(UserContext);
  const [announcement, setAnnouncement] = useState(undefined);
  const [announcements, setAnnouncements] = useState([]);
  const classes = useStyles();
  let handleBreadcrumbs;

  useEffect(() => {
    append(
      <Button
        key="announcements.viewall.disabled"
        depth={1}
        variant="text"
        disabled
      >
        Announcements
      </Button>,
    );
    append(
      <Button
        key="announcements.viewall"
        depth={1}
        variant="text"
        onClick={() => handleBreadcrumbs({ action: 'close' })}
      >
        Announcements
      </Button>,
    );
    append(
      <Button
        key="announcements.add.disabled"
        depth={2}
        variant="text"
        disabled
      >
        Add
      </Button>,
    );
    append(
      <Button
        key="announcements.edit.disabled"
        depth={2}
        variant="text"
        disabled
      >
        Edit
      </Button>,
    );
    display('announcements.viewall.disabled');
  }, []);

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
    handleBreadcrumbs({ action: 'close' });
  };

  handleBreadcrumbs = ({ action, payload }) => {
    switch (action) {
      case 'add':
        setAnnouncement({});
        display('announcements.add.disabled');
        display('announcements.viewall');
        hide('announcements.viewall.disabled');
        break;
      case 'close':
        setAnnouncement(undefined);
        display('announcements.viewall.disabled');
        hide('announcements.add.disabled');
        hide('announcements.edit.disabled');
        hide('announcements.viewall');
        break;
      case 'edit':
        setAnnouncement(payload);
        display('announcements.edit.disabled');
        display('announcements.viewall');
        hide('announcements.viewall.disabled');
        break;
        // no default
    }
  };

  const getTitle = () => {
    if (!announcement) {
      return (
        <>Announcements</>
      );
    }
    if (announcement.id) {
      return (
        <>Edit Announcement</>
      );
    }
    return (
      <>Add Announcement</>
    );
  };

  return (
    <Card>
      <CardHeader title={getTitle()} />
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
                      onClick={() => handleBreadcrumbs({ action: 'add' })}
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
                                sm: 6,
                              },
                              {
                                label: 'End Date',
                                value: getDisplayDateFormat(item.endDateTime),
                                xs: 6,
                                sm: 4,
                              },
                              {
                                label: 'Public?',
                                value: item.isPublic ? 'Yes' : 'No',
                                xs: 6,
                                sm: 4,
                              },
                            ],
                          ]}
                          actions={
                            hasAnyRole(['chpl-admin', 'chpl-onc']) && (
                              <Button
                                onClick={() => handleBreadcrumbs({ action: 'edit', payload: item })}
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

ChplAnnouncementsView.defaultProps = {
  announcements: [],
  dispatch: () => {},
};
