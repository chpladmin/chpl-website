import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { arrayOf, func, shape } from 'prop-types';
import AddIcon from '@material-ui/icons/Add';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import InfoIcon from '@material-ui/icons/Info';

import { useFetchConformanceMethodsActivity } from 'api/activity';
import ChplSystemMaintenanceActivity from 'components/activity/system-maintenance-activity';
import { ChplSearchResultCard, ChplSortControls, ChplTooltip } from 'components/util';
import { sortComparator } from 'components/util/sortable-headers';
import { sortCriteria } from 'services/criteria.service';
import { getDisplayDateFormat } from 'services/date-util';
import { UserContext } from 'shared/contexts';
import { utilStyles } from 'themes';

const sortOptions = [
  { property: 'name', text: 'Name' },
];

const useStyles = makeStyles({
  ...utilStyles,
  tableResultsHeaderContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
});

function ChplConformanceMethodsView({ dispatch, conformanceMethods: initialConformanceMethods }) {
  const { hasAnyRole } = useContext(UserContext);
  const [conformanceMethods, setConformanceMethods] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const classes = useStyles();

  useEffect(() => {
    setConformanceMethods(initialConformanceMethods
      .map((item) => ({
        ...item,
        criteriaDisplay: item.criteria
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
      <Box className={classes.headerContainer}>
        <Box display="flex" flexDirection="row" gridGap={2} alignItems="center">
          <Typography variant="subtitle2">
            Conformance Methods
          </Typography>
          <Typography variant="body2">
            {`(${conformanceMethods.length} Result${conformanceMethods.length !== 1 ? 's' : ''})`}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gridGap={4}>
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
        </Box>
      </Box>
      <Box style={{ maxHeight: 'calc(100vh - 300px)', overflow: 'auto', padding: '16px' }}>
        { conformanceMethods
          .map((item) => (
            <ChplSearchResultCard
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
                    xs: 6,
                    sm: 3,
                  },
                  {
                    label: 'Applicable Criteria',
                    value: item.criteriaDisplay || 'N/A',
                    xs: 12,
                    sm: 8,
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
