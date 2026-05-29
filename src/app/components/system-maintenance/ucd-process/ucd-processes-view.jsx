import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { arrayOf, func } from 'prop-types';
import AddIcon from '@material-ui/icons/Add';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import InfoIcon from '@material-ui/icons/Info';

import { ChplSearchResultCard, ChplSortControls, ChplTooltip } from 'components/util';
import { sortComparator } from 'components/util/sortable-headers';
import { UserContext } from 'shared/contexts';
import { ucdProcessType } from 'shared/prop-types';
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

function ChplUcdProcessesView({ dispatch, ucdProcesses: initialUcdProcesses }) {
  const { hasAnyRole } = useContext(UserContext);
  const [ucdProcesses, setUcdProcesses] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const classes = useStyles();

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
      <Box className={classes.headerContainer}>
        <Box display="flex" flexDirection="row" gridGap={2} alignItems="center">
          <Typography variant="subtitle2">
            UCD Processes
          </Typography>
          <Typography variant="body2">
            {`(${ucdProcesses.length} Result${ucdProcesses.length !== 1 ? 's' : ''})`}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gridGap={4}>
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
        </Box>
      </Box>
      <Box style={{ maxHeight: 'calc(100vh - 300px)', overflow: 'auto', padding: '16px' }}>
        { ucdProcesses
          .map((item) => (
            <ChplSearchResultCard
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
