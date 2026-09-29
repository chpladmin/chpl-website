import React, { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, CardHeader, IconButton, Typography,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import { arrayOf, func } from 'prop-types';

import { ChplSearchResultCard, ChplSortControls, ChplTooltip } from 'components/util';
import { sortComparator } from 'components/util/sortable-headers';
import { job as jobType } from 'shared/prop-types';

const sortOptions = [
  { property: 'name', text: 'Job Name' },
];

const styles = {
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
};

function ChplSystemJobTypesView(props) {
  const { dispatch, jobTypes: initialJobTypes } = props;
  const [jobTypes, setJobTypes] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');

  useEffect(() => {
    setJobTypes(initialJobTypes
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
        <Box sx={styles.headerContainer}>
          <Box sx={styles.resultsContainer}>
            <Typography variant="subtitle2">Jobs:</Typography>
            <Typography variant="body2">
              {`(${jobTypes.length} Result${jobTypes.length !== 1 ? 's' : ''})`}
            </Typography>
          </Box>
          <ChplSortControls
            sortOptions={sortOptions}
            orderBy={orderBy}
            order={order}
            onSort={handleTableSort}
          />
        </Box>
        <Box style={{ maxHeight: 'calc(100vh - 400px)', overflow: 'auto', padding: '0 16px' }}>
          { jobTypes.map((item) => (
            <ChplSearchResultCard
              key={item.name}
              cardTitle="Job Name"
              cardTitleValue={item.name}
              fieldGroups={[
                [
                  {
                    label: 'Job Name', value: item.name,
                  },
                  {
                    label: 'Description', value: item.description,
                  },
                ],
              ]}
              actions={(
                <ChplTooltip
                  title="Schedule Job"
                  placement="top"
                >
                  <IconButton
                    onClick={() => dispatch({ action: 'schedule', payload: item })}
                    color="primary"
                    aria-label={`Schedule Job ${item.name}`}
                    size="large">
                    <PlayArrowIcon />
                  </IconButton>
                </ChplTooltip>
              )}
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
