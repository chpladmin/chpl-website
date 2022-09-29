import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { arrayOf, func } from 'prop-types';

import ChplAnnouncementEdit from './announcement-edit';

import { ChplSortableHeaders } from 'components/util';
import { getDisplayDateFormat } from 'services/date-util';
import { BreadcrumbContext } from 'shared/contexts';
import { announcement as announcementPropType } from 'shared/prop-types';
import { theme, utilStyles } from 'themes';

const headers = [
  { property: 'title', text: 'Title' },
  { property: 'text', text: 'Text' },
  { property: 'startDateTime', text: 'Start Date' },
  { property: 'endDateTime', text: 'End Date' },
  { property: 'isPublic', text: 'Public?' },
  { property: 'actions', text: 'Actions', invisible: true },
];

const useStyles = makeStyles({
  ...utilStyles,
  container: {
    maxHeight: '64vh',
  },
  actionContainer: {
    display: 'grid',
    gap: '16px',
    gridTemplateColumns: '1fr',
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: '1fr 1fr',
    },
  },
  noResultsContainer: {
    padding: '16px 32px',
  },
  tableResultsHeaderContainer: {
    paddingBottom: '16px',
    display: 'flex',
    justifyContent: 'flex-end',
  },
});

function ChplAnnouncementsView(props) {
  const { dispatch } = props;
  const { append, display, hide } = useContext(BreadcrumbContext);
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
    setAnnouncements(props.announcements.sort((a, b) => (a.startDateTime < b.startDateTime ? -1 : 1)));
  }, [props.announcements]); // eslint-disable-line react/destructuring-assignment

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
              <div className={classes.tableResultsHeaderContainer}>
                <Button
                  color="primary"
                  variant="contained"
                  id="add-new-announcement"
                  onClick={() => handleBreadcrumbs({ action: 'add' })}
                  endIcon={<AddIcon />}
                >
                  Add
                </Button>
              </div>
              { (announcements.length === 0)
                && (
                  <Typography className={classes.noResultsContainer}>
                    No results found
                  </Typography>
                )}
              { announcements.length > 0
                && (
                  <TableContainer className={classes.container} component={Paper}>
                    <Table
                      aria-label="Announcements table"
                    >
                      <ChplSortableHeaders
                        headers={headers}
                        onTableSort={() => {}}
                        orderBy="currentStatusChangeDate"
                        order="asc"
                        stickyHeader
                      />
                      <TableBody>
                        { announcements
                          .map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className={classes.firstColumn}>{ item.title }</TableCell>
                              <TableCell>{ item.text }</TableCell>
                              <TableCell>
                                { getDisplayDateFormat(item.startDateTime) }
                              </TableCell>
                              <TableCell>
                                { getDisplayDateFormat(item.endDateTime) }
                              </TableCell>
                              <TableCell>
                                { item.isPublic ? 'Yes' : 'No' }
                              </TableCell>
                              <TableCell align="right">
                                <Button
                                  onClick={() => handleBreadcrumbs({ action: 'edit', payload: item })}
                                  variant="contained"
                                  color="secondary"
                                  endIcon={<EditOutlinedIcon />}
                                >
                                  Edit
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
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
