import React, { useEffect, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { arrayOf } from 'prop-types';

import { resultCardSx, resultsHeaderSx } from 'components/system-maintenance/results-styles';
import {
  ChplSearchResultCard,
  ChplSearchResultControls,
  ChplSortControls,
  ChplTooltip,
} from 'components/util';
import { sortComparator } from 'components/util/sortable-headers';
import { cqm as cqmPropType } from 'shared/prop-types';

const sortOptions = [
  { property: 'display', text: 'ID' },
  { property: 'title', text: 'Title' },
  { property: 'description', text: 'Description' },
];

const sortVersion = (a, b) => {
  const aNum = parseInt(a.substring(1), 10);
  const bNum = parseInt(b.substring(1), 10);
  return aNum - bNum;
};

function ChplCqmsView({ cqms: initialCqms }) {
  const [cqms, setCqms] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('display');

  useEffect(() => {
    setCqms(initialCqms
      .map((c) => ({
        ...c,
        display: c.cmsId ? c.cmsId : `NQF-${c.nqfNumber}`,
        versionDisplay: [...c.versions].sort(sortVersion).join(', '),
      }))
      .sort(sortComparator('display')));
  }, [initialCqms]);

  const handleSort = (property, orderDirection) => {
    const descending = orderDirection === 'desc';
    setCqms((prev) => [...prev].sort(sortComparator(property, descending)));
    setOrderBy(property);
    setOrder(orderDirection);
  };

  return (
    <>
      <ChplSearchResultControls
        recordCount={cqms.length}
        pageStart={1}
        pageEnd={cqms.length}
        sticky={false}
        wrapActions
        sx={resultsHeaderSx}
      >
        <ChplSortControls
          sortOptions={sortOptions}
          orderBy={orderBy}
          order={order}
          onSort={handleSort}
        />
      </ChplSearchResultControls>
      <Box>
        { cqms
          .map((item) => (
            <ChplSearchResultCard
              sx={resultCardSx}
              key={item.display}
              cardTitle="ID"
              cardTitleValue={item.display}
              titleIconButton={(
                <ChplTooltip title="Use this value in a upload file">
                  <IconButton color="primary" size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </ChplTooltip>
            )}
              fieldGroups={[
                [
                  { label: 'Title', value: item.title || 'N/A' },
                  { label: `Version${item.versionDisplay.indexOf(',') > -1 ? 's' : ''}`, value: item.versionDisplay || 'N/A' },
                ],
                [{ label: 'Description', value: item.description || 'N/A' }],
              ]}
            />
          ))}
      </Box>
    </>
  );
}

export default ChplCqmsView;

ChplCqmsView.propTypes = {
  cqms: arrayOf(cqmPropType).isRequired,
};
