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

import { useFetchSvapsActivity } from 'api/activity';
import ChplSystemMaintenanceActivity from 'components/activity/system-maintenance-activity';
import {
  ChplFilterChips,
  ChplFilterSearchBar,
  useFilterContext,
} from 'components/filter';
import { ChplSearchResultCard, ChplSortControls } from 'components/util';
import { sortComparator } from 'components/util/sortable-headers';
import { sortCriteria } from 'services/criteria.service';
import { UserContext } from 'shared/contexts';
import { svap as svapPropType } from 'shared/prop-types';
import { utilStyles } from 'themes';

const sortOptions = [
  { property: 'regulatoryTextCitation', text: 'Regulatory Text Citation' },
  { property: 'approvedStandardVersion', text: 'Approved Standard Version' },
  { property: 'replaced', text: 'Replaced' },
];

const useStyles = makeStyles({
  ...utilStyles,
      tableResultsHeaderContainer:{
      display: 'flex',
      justifyContent: 'flex-end',
  },
});

function ChplSvapsView(props) {
  const { dispatch } = props;
  const [svaps, setSvaps] = useState([]);
  const { hasAnyRole } = useContext(UserContext);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('regulatoryTextCitation');
  const filterContext = useFilterContext();
  const classes = useStyles();

  useEffect(() => {
    setSvaps(props.svaps
      .filter((item) => filterContext.filters.reduce((acc, f) => f.filterFn(item, f) && acc, true))
      .filter((item) => filterContext.searchTermFilter(filterContext.searchTerm, [
        item.regulatoryTextCitation,
        item.approvedStandardVersion,
      ]))
      .map((item) => ({
        ...item,
        criteriaDisplay: item.criteria
          .sort(sortCriteria)
          .map((c) => c.number)
          .join(', '),
      }))
      .sort(sortComparator('regulatoryTextCitation')));
  }, [props.svaps, filterContext.filters, filterContext.searchTerm]);

  const handleSort = (property, orderDirection) => {
    const descending = orderDirection === 'desc';
    setSvaps((prev) => [...prev].sort(sortComparator(property, descending)));
    setOrderBy(property);
    setOrder(orderDirection);
  };

  return (
    <>
      <ChplFilterSearchBar
        placeholder="Search by Citation or Version..."
      />
      <div>
        <ChplFilterChips />
      </div>
      <Box className={classes.headerContainer}>
        <Box display="flex" flexDirection="row" gridGap={2} alignItems="center">
          <Typography variant="subtitle2">Search Results</Typography>
          <Typography variant="body2">
            {`(${svaps.length} Result${svaps.length !== 1 ? 's' : ''})`}
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
            fetch={useFetchSvapsActivity}
            title="SVAP"
          />
          { hasAnyRole(['chpl-admin', 'chpl-onc']) && (
            <Button
              onClick={() => dispatch({ action: 'edit', payload: {} })}
              id="add-new-svap"
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
        { svaps
          .map((item) => (
            <ChplSearchResultCard
              key={`${item.regulatoryTextCitation}-${item.approvedStandardVersion}`}
              title="Regulatory Text Citation"
              titleValue={item.regulatoryTextCitation}
              fieldGroups={[
                [
                  {
                    label: 'Approved Standard Version',
                    value: item.approvedStandardVersion || 'N/A',
                    xs: 6,
                    sm: 4,
                  },
                  {
                    label: 'Replaced',
                    value: item.replaced ? 'Yes' : 'No',
                    xs: 6,
                    sm: 3,
                  },
                  {
                    label: 'Applicable Criteria',
                    value: item.criteriaDisplay || 'N/A',
                    xs: 6,
                    sm: 4,
                  },
                ],
              ]}
              actions={
                hasAnyRole(['chpl-admin', 'chpl-onc']) && (
                  <Button
                    onClick={() => dispatch({ action: 'edit', payload: item })}
                    id={`edit-svap-${item.regulatoryTextCitation}-${item.approvedStandardVersion}`}
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

export default ChplSvapsView;

ChplSvapsView.propTypes = {
  dispatch: func.isRequired,
  svaps: arrayOf(svapPropType).isRequired,
};
