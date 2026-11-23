import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { arrayOf, object } from 'prop-types';

import { resultCardSx, resultsHeaderSx } from 'components/system-maintenance/results-styles';
import { ChplSearchResultCard, ChplSearchResultControls } from 'components/util';
import { sortComparator } from 'components/util/sortable-headers';
import { sortCriteria } from 'services/criteria.service';

function ChplTestDataView({ testData: initialTestData }) {
  const [testData, setTestData] = useState([]);

  useEffect(() => {
    setTestData(initialTestData
      .map((item) => ({
        ...item,
        criteriaDisplay: [...item.criteria]
          .sort(sortCriteria)
          .map((c) => `${c.status === 'REMOVED' ? 'Removed | ' : ''}${c.number}`)
          .join(', '),
      }))
      .sort(sortComparator('name')));
  }, [initialTestData]);

  return (
    <>
      <ChplSearchResultControls
        recordCount={testData.length}
        pageStart={1}
        pageEnd={testData.length}
        sticky={false}
        wrapActions
        sx={resultsHeaderSx}
      />
      <Box>
        { testData
          .map((item) => (
            <ChplSearchResultCard
              sx={resultCardSx}
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
    </>
  );
}

export default ChplTestDataView;

ChplTestDataView.propTypes = {
  testData: arrayOf(object).isRequired,
};
