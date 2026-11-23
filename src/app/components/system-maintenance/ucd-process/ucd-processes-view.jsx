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
import { ucdProcessType } from 'shared/prop-types';

const sortOptions = [
  { property: 'name', text: 'Name' },
];

function ChplUcdProcessesView({ dispatch, ucdProcesses: initialUcdProcesses }) {
  const { hasAnyRole } = useContext(UserContext);
  const [ucdProcesses, setUcdProcesses] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');

  useEffect(() => {
    setUcdProcesses(initialUcdProcesses
      .map((item) => ({
        ...item,
      }))
      .sort(sortComparator('name')));
  }, [initialUcdProcesses]);

  const handleSort = (property, orderDirection) => {
    const descending = orderDirection === 'desc';
    setUcdProcesses((prev) => [...prev].sort(sortComparator(property, descending)));
    setOrderBy(property);
    setOrder(orderDirection);
  };

  return (
    <>
      <ChplSearchResultControls
        recordCount={ucdProcesses.length}
        pageStart={1}
        pageEnd={ucdProcesses.length}
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
            id="add-new-ucd-process"
            variant="contained"
            color="primary"
            endIcon={<AddIcon />}
          >
            Add
          </Button>
        )}
      </ChplSearchResultControls>
      <Box>
        { ucdProcesses
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
                  id={`edit-ucd-process-${item.id}`}
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

export default ChplUcdProcessesView;

ChplUcdProcessesView.propTypes = {
  dispatch: func.isRequired,
  ucdProcesses: arrayOf(ucdProcessType).isRequired,
};
