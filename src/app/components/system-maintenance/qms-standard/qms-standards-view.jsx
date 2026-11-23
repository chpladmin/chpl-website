import React, { useContext, useEffect, useState } from 'react';
import {
  Box, Button, IconButton,
} from '@mui/material';
import { arrayOf, func } from 'prop-types';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import InfoIcon from '@mui/icons-material/Info';

import { resultCardSx, resultsHeaderSx } from 'components/system-maintenance/results-styles';
import {
  ChplSearchResultCard,
  ChplSearchResultControls,
  ChplSortControls,
  ChplTooltip,
} from 'components/util';
import { sortComparator } from 'components/util/sortable-headers';
import { UserContext } from 'shared/contexts';
import { qmsStandardType } from 'shared/prop-types';

const sortOptions = [
  { property: 'name', text: 'Name' },
];

function ChplQmsStandardsView({ dispatch, qmsStandards: initialQmsStandards }) {
  const [qmsStandards, setQmsStandards] = useState([]);
  const { hasAnyRole } = useContext(UserContext);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');

  useEffect(() => {
    setQmsStandards(initialQmsStandards
      .map((item) => ({
        ...item,
      }))
      .sort(sortComparator('name')));
  }, [initialQmsStandards]);

  const handleSort = (property, orderDirection) => {
    const descending = orderDirection === 'desc';
    setQmsStandards((prev) => [...prev].sort(sortComparator(property, descending)));
    setOrderBy(property);
    setOrder(orderDirection);
  };

  return (
    <>
      <ChplSearchResultControls
        recordCount={qmsStandards.length}
        pageStart={1}
        pageEnd={qmsStandards.length}
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
        { hasAnyRole(['chpl-admin', 'chpl-onc']) && (
          <Button
            onClick={() => dispatch({ action: 'edit', payload: {} })}
            id="add-new-qms-standard"
            variant="contained"
            color="primary"
            endIcon={<AddIcon />}
          >
            Add
          </Button>
        )}
      </ChplSearchResultControls>
      <Box>
        { qmsStandards
          .map((item) => (
            <ChplSearchResultCard
              sx={resultCardSx}
              key={`${item.id}`}
              cardTitle="Name"
              cardTitleValue={item.name}
              titleIconButton={(
                <ChplTooltip title="Use this value in a upload file">
                  <IconButton color="primary" size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </ChplTooltip>
            )}
              actions={
              hasAnyRole(['chpl-admin', 'chpl-onc']) && (
                <Button
                  onClick={() => dispatch({ action: 'edit', payload: item })}
                  id={`edit-qms-standard-${item.id}`}
                  variant="contained"
                  color="secondary"
                  size="small"
                  endIcon={<EditOutlinedIcon />}
                >
                  Edit
                </Button>
              )
            }
            />
          ))}
      </Box>
    </>
  );
}

export default ChplQmsStandardsView;

ChplQmsStandardsView.propTypes = {
  dispatch: func.isRequired,
  qmsStandards: arrayOf(qmsStandardType).isRequired,
};
