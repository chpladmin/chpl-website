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

import { useFetchFunctionalitiesTestedActivity } from 'api/activity';
import ChplSystemMaintenanceActivity from 'components/activity/system-maintenance-activity';
import {
  ChplFilterChips,
  ChplFilterSearchBar,
  useFilterContext,
} from 'components/filter';
import { ChplSearchResultCard, ChplSortControls, ChplUpdateIndicator } from 'components/util';
import { sortComparator } from 'components/util/sortable-headers';
import { sortCriteria } from 'services/criteria.service';
import { getDisplayDateFormat } from 'services/date-util';
import { UserContext } from 'shared/contexts';
import { functionalityTested as functionalityTestedPropType } from 'shared/prop-types';
import { utilStyles } from 'themes';

const sortOptions = [
  { property: 'value', text: 'Value' },
  { property: 'regulatoryTextCitation', text: 'Citation' },
  { property: 'startDay', text: 'Start Date' },
  { property: 'requiredDay', text: 'Required Date' },
  { property: 'extensionEndDay', text: 'Extension End' },
  { property: 'endDay', text: 'End Date' },
];

const useStyles = makeStyles({
  ...utilStyles,
});

function ChplFunctionalitiesTestedView(props) {
  const { dispatch, functionalitiesTested: propsFunctionalitiesTested } = props;
  const { hasAnyRole } = useContext(UserContext);
  const [functionalitiesTested, setFunctionalitiesTested] = useState([]);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('value');
  const filterContext = useFilterContext();
  const classes = useStyles();

  useEffect(() => {
    setFunctionalitiesTested(propsFunctionalitiesTested
      .filter((item) => filterContext.filters.reduce((acc, f) => f.filterFn(item, f) && acc, true))
      .filter((item) => filterContext.searchTermFilter(filterContext.searchTerm, [
        item.value,
        item.regulatoryTextCitation,
        item.rule?.name,
        item.practiceType?.name,
      ]))
      .map((item) => ({
        ...item,
        criteriaDisplay: item.criteria
          .sort(sortCriteria)
          .map((c) => `${c.status === 'REMOVED' ? 'Removed | ' : ''}${c.number}`)
          .join(', '),
      }))
      .sort(sortComparator('value')));
  }, [propsFunctionalitiesTested, filterContext]);

  const handleSort = (property, orderDirection) => {
    const descending = orderDirection === 'desc';
    const updated = functionalitiesTested.sort(sortComparator(property, descending));
    setOrderBy(property);
    setOrder(orderDirection);
    setFunctionalitiesTested(updated);
  };

  return (
    <>
      <ChplFilterSearchBar
        placeholder="Search by Value, Citation, Rule, or Practice Type..."
      />
      <div>
        <ChplFilterChips />
      </div>
      <Box className={classes.headerContainer}>
        <Box display="flex" flexDirection="row" gridGap={2} alignItems="center">
          <Typography variant="subtitle2">
            Search Results
          </Typography>
          <Typography variant="body2">
            {`(${functionalitiesTested.length} Result${functionalitiesTested.length !== 1 ? 's' : ''})`}
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
            fetch={useFetchFunctionalitiesTestedActivity}
            title="Functionalities Tested"
          />
          {hasAnyRole(['chpl-admin', 'chpl-onc']) && (
            <Button
              onClick={() => dispatch({ action: 'edit', payload: {} })}
              id="add-new-functionality-tested"
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
        {functionalitiesTested
          .map((item) => (
            <ChplSearchResultCard
              key={`${item.id}-${item.value}`}
              title="Value"
              titleValue={`${item.value}${item.retired ? ' (Retired)' : ''}`}
              additionalTitleContent={
                <ChplUpdateIndicator
                  requiredDay={item.requiredDay}
                  endDay={item.endDay}
                  additionalInformation={item.additionalInformation}
                />
              }
              fieldGroups={[
                [
                  {
                    label: 'Regulatory Text Citation',
                    value: item.regulatoryTextCitation || 'N/A',
                    xs: 6,
                    sm: 3,
                  },
                  {
                    label: 'Rule',
                    value: item.rule?.name || 'N/A',
                    xs: 6,
                    sm: 3,
                  },
                  {
                    label: 'Practice Type',
                    value: item.practiceType?.name || 'N/A',
                    xs: 6,
                    sm: 3,
                  },
                  {
                    label: 'Applicable Criteria',
                    value: item.criteriaDisplay || 'N/A',
                    xs: 6,
                    sm: 2,
                  },
                ],
                [
                  {
                    label: 'Start Date',
                    value: getDisplayDateFormat(item.startDay) || 'N/A',
                    xs: 6,
                    sm: 3,
                  },
                  {
                    label: 'End Date',
                    value: getDisplayDateFormat(item.endDay) || 'N/A',
                    xs: 6,
                    sm: 3,
                  },
                  {
                    label: 'Required Date',
                    value: getDisplayDateFormat(item.requiredDay) || 'N/A',
                    xs: 6,
                    sm: 3,
                  },
                  {
                    label: 'Extension End Date',
                    value: getDisplayDateFormat(item.extensionEndDay) || 'N/A',
                    xs: 6,
                    sm: 2,
                  },
                ],
              ]}
              actions={
                hasAnyRole(['chpl-admin', 'chpl-onc']) && (
                  <Button
                    onClick={() => dispatch({ action: 'edit', payload: item })}
                    id={`edit-functionality-tested-${item.value}`}
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

export default ChplFunctionalitiesTestedView;

ChplFunctionalitiesTestedView.propTypes = {
  dispatch: func.isRequired,
  functionalitiesTested: arrayOf(functionalityTestedPropType).isRequired,
};
