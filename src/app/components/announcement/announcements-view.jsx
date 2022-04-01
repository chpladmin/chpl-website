import React, { useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
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
import Moment from 'react-moment';
import { arrayOf, func } from 'prop-types';

import ChplAnnouncementEdit from './announcement-edit';

import { ChplSortableHeaders } from 'components/util';
import { getDisplayDateFormat } from 'services/date-util';
import { announcement as announcementPropType } from 'shared/prop-types';
import theme from 'themes/theme';

const headers = [
  { property: 'title', text: 'Title' },
  { property: 'text', text: 'Text' },
  { property: 'startDateTime', text: 'Start Date (as formated string)' },
  { property: 'endDateTime', text: 'End Date (as relative date)' },
  { property: 'isPublic', text: 'Public?' },
  { property: 'actions', text: 'Actions', invisible: true },
];

const useStyles = makeStyles({
  container: {
    maxHeight: '64vh',
  },
  cardSpacing: {
    marginTop: '32px',
  },
  searchContainer: {
    backgroundColor: '#c6d5e5',
    padding: '16px 32px',
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
    alignItems: 'center',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-end',
    },
  },
  tableResultsHeaderContainer: {
    display: 'grid',
    gap: '8px',
    marginBottom: '16px',
    gridTemplateColumns: '1fr',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: 'auto auto',
    },
  },
  resultsContainer: {
    display: 'grid',
    gap: '8px',
    justifyContent: 'start',
    gridTemplateColumns: 'auto auto',
    alignItems: 'center',
  },
  wrap: {
    flexFlow: 'wrap',
  },
  iconSpacing: {
    marginLeft: '4px',
  },
  tableFirstColumn: {
    position: 'sticky',
    left: 0,
    boxShadow: 'rgba(149, 157, 165, 0.1) 0px 4px 8px',
    backgroundColor: '#ffffff',
  },
  tableDeveloperCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  developerName: {
    fontWeight: '600',
  },
  noResultsContainer: {
    padding: '16px 32px',
  },
});

function ChplAnnouncementsView(props) {
  const { dispatch } = props;
  const [announcement, setAnnouncement] = useState(undefined);
  const [announcements, setAnnouncements] = useState([]);
  const classes = useStyles();

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
    setAnnouncement(undefined);
  };

  return (
    <Card className={classes.cardSpacing}>
      <CardHeader title="Announcements" />
      <CardContent>
        { announcement
          && (
            <ChplAnnouncementEdit
              announcement={announcement}
              dispatch={handleActionBarDispatch}
            />
          )}
        { !announcement
          && (
            <>
              { (announcements.length === 0)
                && (
                  <Typography className={classes.noResultsContainer}>
                    No results found
                  </Typography>
                )}
              { announcements.length > 0
                && (
                  <>
                    <div className={classes.tableResultsHeaderContainer}>
                      <ButtonGroup className={classes.wrap}>
                        <Button
                          color="secondary"
                          variant="contained"
                          fullWidth
                          id="add-new-announcement"
                          onClick={() => setAnnouncement({})}
                        >
                          Add Announcement
                          {' '}
                          <AddIcon className={classes.iconSpacing} />
                        </Button>
                      </ButtonGroup>
                    </div>
                    <TableContainer className={classes.container} component={Paper}>
                      <Table
                        aria-label="Announcements table"
                      >
                        <ChplSortableHeaders
                          headers={headers}
                          onTableSort={() => {}}
                          orderBy="currentStatusChangeDate"
                          order="asc"
                        />
                        <TableBody>
                          { announcements
                            .map((item) => (
                              <TableRow key={item.id}>
                                <TableCell className={classes.tableFirstColumn}>{ item.title }</TableCell>
                                <TableCell>{ item.text }</TableCell>
                                <TableCell>
                                  { getDisplayDateFormat(item.startDateTime) }
                                </TableCell>
                                <TableCell>
                                  <Moment
                                    fromNow
                                    withTitle
                                    titleFormat="DD MMM yyyy, h:mm a"
                                  >
                                    {item.endDateTime}
                                  </Moment>
                                </TableCell>
                                <TableCell>{ item.isPublic ? 'Yes' : 'No' }</TableCell>
                                <TableCell align="right">
                                  <Button
                                    onClick={() => setAnnouncement(item)}
                                    variant="contained"
                                    color="primary"
                                  >
                                    Edit
                                    {' '}
                                    <EditOutlinedIcon className={classes.iconSpacing} />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
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
