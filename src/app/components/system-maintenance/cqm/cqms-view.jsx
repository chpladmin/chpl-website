import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { arrayOf } from 'prop-types';

import { ChplSearchResultCard, ChplSortControls } from 'components/util';
import { sortComparator } from 'components/util/sortable-headers';
import { cqm as cqmPropType } from 'shared/prop-types';
import { utilStyles } from 'themes';

const sortOptions = [
  { property: 'display', text: 'ID' },
  { property: 'title', text: 'Title' },
  { property: 'description', text: 'Description' },
];

const useStyles = makeStyles({
  ...utilStyles,
});

const sortVersion = (a, b) => {
  const aNum = parseInt(a.substring(1), 10);
  const bNum = parseInt(b.substring(1), 10);
  return aNum - bNum;
};

function ChplCqmsView(props) {
  const [cqms, setCqms] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('value');
  const classes = useStyles();

  useEffect(() => {
    setCqms(props.cqms
      .map((c) => ({
        ...c,
        display: c.cmsId ? c.cmsId : `NQF-${c.nqfNumber}`,
        versionDisplay: c.versions.sort(sortVersion).join(', '),
      }))
      .sort(sortComparator('value')));
  }, [props.cqms]);

  const handleSort = (property, orderDirection) => {
    const descending = orderDirection === 'desc';
    const updated = cqms.sort(sortComparator(property, descending));
    setOrderBy(property);
    setOrder(orderDirection);
    setCqms(updated);
  };

  return (
    <>
      <Box className={classes.headerContainer}>
        <Box display="flex" flexDirection="row" gridGap={2} alignItems="center">
          <Typography variant="subtitle2">
            CQMs
          </Typography>
          <Typography variant="body2">
            {`(${cqms.length} Result${cqms.length !== 1 ? 's' : ''})`}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gridGap={4}>
          <ChplSortControls
            sortOptions={sortOptions}
            orderBy={orderBy}
            order={order}
            onSort={handleSort}
          />
        </Box>
      </Box>
      <Box style={{ maxHeight: 'calc(100vh - 300px)', overflow: 'auto', padding: '16px' }}>
        { cqms
          .map((item) => (
            <ChplSearchResultCard
              key={item.display}
              title="ID"
              titleValue={item.display}
              fieldGroups={[
                [
                  {
                    label: 'Title',
                    value: item.title || 'N/A',
                    xs: 12,
                    sm: 6,
                  },
                  {
                    label: 'Version(s)',
                    value: item.versionDisplay || 'N/A',
                    xs: 12,
                    sm: 6,
                  },
                ],
                [
                  {
                    label: 'Description',
                    value: item.description || 'N/A',
                    xs: 12,
                    sm: 12,
                  },
                ],
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
