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
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PlayArrowOutlinedIcon from '@material-ui/icons/PlayArrowOutlined';
import { arrayOf, func } from 'prop-types';

import { ChplSearchResultCard, ChplSortControls, ChplTooltip } from 'components/util';
import { sortComparator } from 'components/util/sortable-headers';
import { job as jobType } from 'shared/prop-types';

const sortOptions = [
  { property: 'name', text: 'Job Name' },
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

function ChplSystemJobTypesView(props) {
  const { dispatch } = props;
  const [jobTypes, setJobTypes] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const classes = useStyles();

  useEffect(() => {
    setJobTypes(props.jobTypes
      .sort(sortComparator('name')));
  }, []);

  const handleTableSort = (property, orderDirection) => {
    const descending = orderDirection === 'desc';
    setJobTypes((prev) => [...prev].sort(sortComparator(property, descending)));
    setOrderBy(property);
    setOrder(orderDirection);
  };

  return (
    <Card>
      <CardHeader
        style={{ paddingLeft: '16px' }}
        title={(
          <>
            Types of Jobs
            <PlayArrowOutlinedIcon style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
          </>
        )}
      />
      <CardContent>
        <div className={classes.headerContainer}>
          <div className={classes.resultsContainer}>
            <Typography variant="subtitle2">Jobs:</Typography>
            <Typography variant="body2">
              {`(${jobTypes.length} Result${jobTypes.length !== 1 ? 's' : ''})`}
            </Typography>
          </div>
          <ChplSortControls
            sortOptions={sortOptions}
            orderBy={orderBy}
            order={order}
            onSort={handleTableSort}
          />
        </div>
        <Box style={{ maxHeight: 'calc(100vh - 400px)', overflow: 'auto', padding: '0 16px' }}>
          { jobTypes.map((item) => (
            <ChplSearchResultCard
              key={item.name}
              cardTitle="Job Name"
              cardTitleValue={item.name}
              fieldGroups={[
                [
                  { label: 'Job Name', value: item.name, xs: 12, sm: 6 },
                  { label: 'Description', value: item.description, xs: 12, sm: 5 },
                ],
              ]}
              actions={
                <ChplTooltip
                  title="Schedule Job"
                  placement="top"
                >
                  <IconButton
                    onClick={() => dispatch({ action: 'schedule', payload: item })}
                    color="primary"
                    aria-label={`Schedule Job ${item.name}`}
                  >
                    <PlayArrowIcon />
                  </IconButton>
                </ChplTooltip>
              }
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}

export default ChplSystemJobTypesView;

ChplSystemJobTypesView.propTypes = {
  jobTypes: arrayOf(jobType).isRequired,
  dispatch: func.isRequired,
};
