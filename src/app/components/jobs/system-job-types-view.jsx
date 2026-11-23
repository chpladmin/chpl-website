import React, { useMemo, useState } from 'react';
import {
  Box, Card, CardContent, CardHeader, IconButton,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import { arrayOf, func } from 'prop-types';

import { resultCardSx, resultsHeaderSx } from 'components/system-maintenance/results-styles';
import {
  ChplSearchResultCard,
  ChplSearchResultControls,
  ChplSortControls,
  ChplTooltip,
} from 'components/util';
import { sortComparator } from 'components/util/sortable-headers';
import { job as jobType } from 'shared/prop-types';

const sortOptions = [
  { property: 'name', text: 'Job Name' },
];

function ChplSystemJobTypesView(props) {
  const { dispatch, jobTypes: initialJobTypes } = props;
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');

  // Built from the props on every change, so job types fetched again are shown in the chosen order
  const jobTypes = useMemo(() => [...initialJobTypes]
    .sort(sortComparator(orderBy, order === 'desc')), [initialJobTypes, order, orderBy]);

  const handleTableSort = (property, orderDirection) => {
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
        <ChplSearchResultControls
          recordCount={jobTypes.length}
          pageStart={1}
          pageEnd={jobTypes.length}
          sticky={false}
          wrapActions
          showEmptyState
          sx={resultsHeaderSx}
        >
          <ChplSortControls
            sortOptions={sortOptions}
            orderBy={orderBy}
            order={order}
            onSort={handleTableSort}
          />
        </ChplSearchResultControls>
        <Box style={{ maxHeight: 'calc(100vh - 400px)', overflow: 'auto', padding: '0 16px' }}>
          { jobTypes.map((item) => (
            <ChplSearchResultCard
              sx={resultCardSx}
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
                    size="large"
                  >
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
