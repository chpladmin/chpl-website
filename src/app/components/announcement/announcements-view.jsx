import React, { useState } from 'react';
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
import { getAngularService } from 'services/angular-react-helper';
import { announcement as announcementPropType } from 'shared/prop-types';
import theme from 'themes/theme';

const headers = [
  { property: 'title', text: 'Title' },
  { property: 'text', text: 'Text' },
  { property: 'startDate', text: 'Start Date' },
  { property: 'endDate', text: 'End Date' },
  { property: 'isPublic', text: 'Public?' },
  { property: 'actions', text: 'Actions', invisible: true },
];

const useStyles = makeStyles({
  container: {
    maxHeight: '64vh',
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
    margin: '16px 32px',
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
  const { announcements, dispatch } = props;
  const DateUtil = getAngularService('DateUtil');
  const [announcement, setAnnouncement] = useState(undefined);
  const classes = useStyles();

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
    <Card>
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
                      <ButtonGroup size="small" className={classes.wrap}>
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
                                <TableCell>{ DateUtil.getDisplayDateFormat(item.startDate) }</TableCell>
                                <TableCell>
                                  <Moment
                                    fromNow
                                    withTitle
                                    titleFormat="DD MMM yyyy, HH:mm (Z)"
                                  >
                                    {item.endDate}
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
