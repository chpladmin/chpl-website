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
import EditIcon from '@material-ui/icons/Edit';
import { arrayOf, func } from 'prop-types';

import { ChplSearchResultCard, ChplSortControls, ChplTooltip } from 'components/util';
import { sortComparator } from 'components/util/sortable-headers';
import { acb as acbType, trigger as triggerType } from 'shared/prop-types';

const sortOptions = [
  { property: 'email', text: 'Email' },
  { property: 'jobName', text: 'Type' },
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

function ChplUserTriggersView({
  acbs = [],
  dispatch = () => {},
  triggers: initialTriggers = [],
}) {
  const [triggers, setTriggers] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('email');
  const classes = useStyles();

  useEffect(() => {
    setTriggers(initialTriggers
      .map((trigger) => {
        const response = {
          ...trigger,
          jobName: trigger.job.name,
          schedule: trigger.cronSchedule,
        };
        if (trigger.acb) {
          const relevant = trigger.acb
            .split(',')
            .map((id) => parseInt(id, 10))
            .map((id) => acbs.find((acb) => acb.id === id))
            .map((acb) => `${acb.name}${acb.retired ? ' (Retired)' : ''}`)
            .sort((a, b) => (a < b ? -1 : 1))
            .join(', ');
          response.acbNames = relevant;
        }
        return response;
      })
      .sort(sortComparator('email')));
  }, [acbs, initialTriggers]);

  const handleSort = (property, orderDirection) => {
    const descending = orderDirection === 'desc';
    setTriggers((prev) => [...prev].sort(sortComparator(property, descending)));
    setOrderBy(property);
    setOrder(orderDirection);
  };

  return (
    <Card>
      <CardHeader title="Currently Scheduled Reports" />
      <CardContent>
        <>
          { (triggers.length === 0)
            && (
              <Typography style={{ padding: '16px' }}>
                No results found. To get started, click on the calendar icon next to the desired report to schedule it.
              </Typography>
            )}
          { triggers.length > 0
            && (
              <>
                <div className={classes.headerContainer}>
                  <div className={classes.resultsContainer}>
                    <Typography variant="subtitle2">Scheduled Reports:</Typography>
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
                  { triggers.map((item) => {
                    const fieldGroups = [
                      [
                        { label: 'Email', value: item.email },
                        { label: 'Schedule', value: item.schedule },
                      ],
                      [
                        { label: 'Type', value: item.jobName },
                      ],
                    ];
                    
                    if (item.acbNames) {
                      fieldGroups[1].push({
                        label: 'ONC-ACB',
                        value: item.acbNames,
                      });
                    }
                    
                    return (
                      <ChplSearchResultCard
                        key={`${item.name}-${item.job.name}`}
                        cardTitle="Report Name"
                        cardTitleValue={item.name}
                        fieldGroups={fieldGroups}
                        actions={
                          <ChplTooltip
                            title="Edit Report"
                            placement="top"
                          >
                            <IconButton
                              onClick={() => dispatch({ action: 'edit', payload: item })}
                              color="primary"
                              aria-label={`Edit Report ${item.name}`}
                            >
                              <EditIcon />
                            </IconButton>
                          </ChplTooltip>
                        }
                      />
                    );
                  })}
                </Box>
              </>
            )}
        </>
      </CardContent>
    </Card>
  );
}

export default ChplUserTriggersView;

ChplUserTriggersView.propTypes = {
  acbs: arrayOf(acbType),
  dispatch: func,
  triggers: arrayOf(triggerType),
};
