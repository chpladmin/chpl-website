import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { arrayOf, func } from 'prop-types';
import AddIcon from '@material-ui/icons/Add';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';

import { ChplSearchResultCard, ChplSortControls } from 'components/util';
import { sortComparator } from 'components/util/sortable-headers';
import { UserContext } from 'shared/contexts';
import { qmsStandardType } from 'shared/prop-types';
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

function ChplQmsStandardsView(props) {
  const { dispatch } = props;
  const [qmsStandards, setQmsStandards] = useState([]);
  const { hasAnyRole } = useContext(UserContext);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const classes = useStyles();

  useEffect(() => {
    setQmsStandards(props.qmsStandards
      .map((item) => ({
        ...item,
      }))
      .sort(sortComparator('name')));
  }, [props.qmsStandards]); // eslint-disable-line react/destructuring-assignment

  const handleSort = (property, orderDirection) => {
    const descending = orderDirection === 'desc';
    const updated = qmsStandards.sort(sortComparator(property, descending));
    setOrderBy(property);
    setOrder(orderDirection);
    setQmsStandards(updated);
  };

  return (
    <>
      <Box className={classes.headerContainer}>
        <Box display="flex" flexDirection="row" gridGap={2} alignItems="center">
          <Typography variant="subtitle2">
            QMS Standards
          </Typography>
          <Typography variant="body2">
            {`(${qmsStandards.length} Result${qmsStandards.length !== 1 ? 's' : ''})`}
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
              id="add-new-qms-standard"
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
        { qmsStandards
          .map((item) => (
            <ChplSearchResultCard
              key={`${item.id}`}
              title="Name"
              titleValue={item.name}
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
