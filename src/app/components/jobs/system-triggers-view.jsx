import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
  makeStyles,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import PlayArrowOutlinedIcon from '@material-ui/icons/PlayArrowOutlined';
import Moment from 'react-moment';
import { arrayOf, func } from 'prop-types';

import ChplActionBarConfirmation from 'components/action-bar/action-bar-confirmation';
import { ChplSearchResultCard, ChplSortControls } from 'components/util';
import { sortComparator } from 'components/util/sortable-headers';
import { scheduledSystemTrigger } from 'shared/prop-types';

const sortOptions = [
  { property: 'name', text: 'Job Name' },
  { property: 'nextRunDate', text: 'Next Run Date' },
  { property: 'triggerScheduleType', text: 'Trigger Schedule Type' },
];

const useStyles = makeStyles({
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
  },
  resultsContainer: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
});

function ChplSystemTriggersView({
  dispatch,
  triggers: initialTriggers = [],
}) {
  const [triggers, setTriggers] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('nextRunDate');
  const [isConfirming, setIsConfirming] = useState(false);
  const [pendingAction, setPendingAction] = useState({});
  const [pendingMessage, setPendingMessage] = useState('');
  const classes = useStyles();

  let getAction;

  useEffect(() => {
    setTriggers(initialTriggers
      .map((trigger) => ({
        ...trigger,
        action: getAction(trigger, dispatch),
      }))
      .sort(sortComparator('nextRunDate')));
  }, [initialTriggers, dispatch]);

  const confirmDelete = (item) => {
    setIsConfirming(true);
    setPendingAction({
      action: 'delete',
      payload: {
        name: item.triggerName,
        group: item.triggerGroup,
        successMessage: 'Job deleted: System job deleted',
      },
    });
    setPendingMessage('Are you sure you want to delete this system job?');
  };

  const handleConfirmation = (response) => {
    if (response === 'yes' && pendingAction) {
      dispatch(pendingAction);
    }
    setIsConfirming(false);
    setPendingAction({});
  };

  const handleSort = (property, orderDirection) => {
    const descending = orderDirection === 'desc';
    setTriggers((prev) => [...prev].sort(sortComparator(property, descending)));
    setOrderBy(property);
    setOrder(orderDirection);
  };

  getAction = (item) => {
    let action = null;
    if (item.triggerScheduleType === 'ONE_TIME') {
      action = (
        <IconButton
          onClick={() => confirmDelete(item)}
          variant="contained"
          aria-label={`Delete Job ${item.name}`}
        >
          <DeleteIcon color="error" />
        </IconButton>
      );
    }
    return action;
  };

  return (
    <>
      { isConfirming
        && (
        <ChplActionBarConfirmation
          dispatch={handleConfirmation}
          pendingMessage={pendingMessage}
        />
        )}
      <Card>
        <CardHeader
          style={{ paddingLeft: '16px' }}
          title={(
            <>
              Currently Scheduled System Jobs
              <PlayArrowOutlinedIcon style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
            </>
          )}
        />
        <CardContent>
          <>            { (triggers.length === 0)
              && (
                <Typography style={{ padding: '16px' }}>
                  No results found
                </Typography>
              )}
            { triggers.length > 0
              && (
                <>
                  <div className={classes.headerContainer}>
                    <div className={classes.resultsContainer}>
                      <Typography variant="subtitle2">Scheduled Jobs:</Typography>
                      <Typography variant="body2">
                        {`(${triggers.length} Result${triggers.length !== 1 ? 's' : ''})`}
                      </Typography>
                    </div>
                    <ChplSortControls
                      sortOptions={sortOptions}
                      orderBy={orderBy}
                      order={order}
                      onSort={handleSort}
                    />
                  </div>
                  <Box style={{ maxHeight: 'calc(100vh - 400px)', overflow: 'auto', padding: '0 16px' }}>
                    { triggers.map((item) => (
                      <ChplSearchResultCard
                        key={item.nextRunDate}
                        fieldGroups={[
                          [
                            { label: 'Job Name', value: item.name, xs: 12, sm: 6 },
                            { label: 'Description', value: item.description, xs: 12, sm: 6 },
                          ],
                          [
                            {
                              label: 'Next Run Date',
                              value: item.nextRunDate ? (
                                <Moment
                                  fromNow
                                  withTitle
                                  titleFormat="DD MMM yyyy, h:mm a"
                                >
                                  {item.nextRunDate}
                                </Moment>
                              ) : (
                                <>In Progress</>
                              ),
                              xs: 12,
                              sm: 6,
                            },
                            { label: 'Trigger Schedule Type', value: item.triggerScheduleType, xs: 12, sm: 6 },
                          ],
                        ]}
                        actions={item.action}
                      />
                    ))}
                  </Box>
                </>
              )}
          </>
        </CardContent>
      </Card>
    </>
  );
}

export default ChplSystemTriggersView;

ChplSystemTriggersView.propTypes = {
  triggers: arrayOf(scheduledSystemTrigger),
  dispatch: func.isRequired,
};
