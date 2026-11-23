import React, { useContext, useEffect, useState } from 'react';
import {
  Box, Button, IconButton,
} from '@mui/material';
import { arrayOf, func, shape } from 'prop-types';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import InfoIcon from '@mui/icons-material/Info';

import { useFetchConformanceMethodsActivity } from 'api/activity';
import ChplSystemMaintenanceActivity from 'components/activity/system-maintenance-activity';
import { resultCardSx, resultsHeaderSx } from 'components/system-maintenance/results-styles';
import {
  ChplSearchResultCard,
  ChplSearchResultControls,
  ChplSortControls,
  ChplTooltip,
} from 'components/util';
import { sortComparator } from 'components/util/sortable-headers';
import { sortCriteria } from 'services/criteria.service';
import { getDisplayDateFormat } from 'services/date-util';
import { UserContext } from 'shared/contexts';

const sortOptions = [
  { property: 'name', text: 'Name' },
];

function ChplConformanceMethodsView({ dispatch, conformanceMethods: initialConformanceMethods }) {
  const { hasAnyRole } = useContext(UserContext);
  const [conformanceMethods, setConformanceMethods] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');

  useEffect(() => {
    setConformanceMethods(initialConformanceMethods
      .map((item) => ({
        ...item,
        criteriaDisplay: [...item.criteria]
          .sort(sortCriteria)
          .map((c) => `${c.status === 'REMOVED' ? 'Removed | ' : ''}${c.number}`)
          .join(', '),
      }))
      .sort(sortComparator('name')));
  }, [initialConformanceMethods]);

  const handleSort = (property, orderDirection) => {
    const descending = orderDirection === 'desc';
    setConformanceMethods((prev) => [...prev].sort(sortComparator(property, descending)));
    setOrderBy(property);
    setOrder(orderDirection);
  };

  return (
    <>
      <ChplSearchResultControls
        recordCount={conformanceMethods.length}
        pageStart={1}
        pageEnd={conformanceMethods.length}
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
        <ChplSystemMaintenanceActivity
          fetch={useFetchConformanceMethodsActivity}
          title="Conformance Methods"
        />
        { hasAnyRole(['chpl-admin', 'chpl-onc']) && (
          <Button
            onClick={() => dispatch({ action: 'edit', payload: {} })}
            id="add-new-conformance-method"
            variant="contained"
            color="primary"
            endIcon={<AddIcon />}
          >
            Add
          </Button>
        )}
      </ChplSearchResultControls>
      <Box>
        { conformanceMethods
          .map((item) => (
            <ChplSearchResultCard
              sx={resultCardSx}
              key={`${item.id}`}
              cardTitle="Name"
              cardTitleValue={`${item.removed ? 'Removed | ' : ''}${item.name}`}
              titleIconButton={(
                <ChplTooltip title="Use this value in a upload file">
                  <IconButton color="primary" size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </ChplTooltip>
            )}
              fieldGroups={[
                [
                  {
                    label: 'Removal Date',
                    value: getDisplayDateFormat(item.removalDate),
                  },
                  {
                    label: 'Applicable Criteria',
                    value: item.criteriaDisplay || 'N/A',
                  },
                ],
              ]}
              actions={
              hasAnyRole(['chpl-admin', 'chpl-onc']) && (
                <Button
                  onClick={() => dispatch({ action: 'edit', payload: item })}
                  id={`edit-conformance-method-${item.value}`}
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

export default ChplConformanceMethodsView;

ChplConformanceMethodsView.propTypes = {
  conformanceMethods: arrayOf(shape({})).isRequired,
  dispatch: func.isRequired,
};
