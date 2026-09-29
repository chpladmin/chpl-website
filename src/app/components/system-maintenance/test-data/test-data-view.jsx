import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { arrayOf, object } from 'prop-types';

import { ChplSearchResultCard } from 'components/util';
import { sortComparator } from 'components/util/sortable-headers';
import { sortCriteria } from 'services/criteria.service';
import { utilStyles } from 'themes';

const styles = {
  ...utilStyles,
};

function ChplTestDataView({ testData: initialTestData }) {
  const [testData, setTestData] = useState([]);

  useEffect(() => {
    setTestData(initialTestData
      .map((item) => ({
        ...item,
        criteriaDisplay: item.criteria
          .sort(sortCriteria)
          .map((c) => `${c.status === 'REMOVED' ? 'Removed | ' : ''}${c.number}`)
          .join(', '),
      }))
      .sort(sortComparator('name')));
  }, [initialTestData]);

  return <>
    <Box sx={styles.headerContainer}>
      <Box display="flex" flexDirection="row" gap="2px" alignItems="center">
        <Typography variant="subtitle2">
          Test Data
        </Typography>
        <Typography variant="body2">
          {`(${testData.length} Result${testData.length !== 1 ? 's' : ''})`}
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" gap="4px" />
    </Box>
    <Box style={{ maxHeight: 'calc(100vh - 300px)', overflow: 'auto', padding: '16px' }}>
      { testData
        .map((item) => (
          <ChplSearchResultCard
            key={`${item.id}`}
            cardTitle="Name"
            cardTitleValue={item.name}
            fieldGroups={[
              [
                {
                  label: 'Applicable Criteria',
                  value: item.criteriaDisplay || 'N/A',
                },
              ],
            ]}
          />
        ))}
    </Box>
  </>;
}

export default ChplTestDataView;

ChplTestDataView.propTypes = {
  testData: arrayOf(object).isRequired,
};
