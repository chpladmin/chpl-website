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

import { useFetchStandardsActivity } from 'api/activity';
import ChplSystemMaintenanceActivity from 'components/activity/system-maintenance-activity';
import {
  ChplFilterChips,
  ChplFilterSearchBar,
  useFilterContext,
} from 'components/filter';
import {
  ChplSearchResultCard,
  ChplSortControls,
  ChplUpdateIndicator,
  ChplTooltip,
} from 'components/util';
import { sortComparator } from 'components/util/sortable-headers';
import { sortCriteria } from 'services/criteria.service';
import { getDisplayDateFormat } from 'services/date-util';
import { UserContext } from 'shared/contexts';
import { standard as standardPropType } from 'shared/prop-types';
import { utilStyles } from 'themes';

const sortOptions = [
  { property: 'value', text: 'Value' },
  { property: 'regulatoryTextCitation', text: 'Regulatory Text Citation' },
  { property: 'startDay', text: 'Start Date' },
  { property: 'requiredDay', text: 'Required Date' },
  { property: 'extensionEndDay', text: 'Extension End Date' },
  { property: 'endDay', text: 'End Date' },
];

const useStyles = makeStyles({
  ...utilStyles,
  tableResultsHeaderContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
});

function ChplStandardsView({ dispatch, standards: initialStandards }) {
  const [standards, setStandards] = useState([]);
  const { hasAnyRole } = useContext(UserContext);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('value');
  const filterContext = useFilterContext();
  const classes = useStyles();

  useEffect(() => {
    setStandards(initialStandards
      .filter((item) => filterContext.filters.reduce((acc, f) => f.filterFn(item, f) && acc, true))
      .filter((item) => filterContext.searchTermFilter(filterContext.searchTerm, [
        item.value,
        item.regulatoryTextCitation,
                     item.rule?.name,
                     item.groupName,
      ]))
      .map((item) => ({
        ...item,
        criteriaDisplay: item.criteria
          .sort(sortCriteria)
          .map((c) => `${c.status === 'REMOVED' ? 'Removed | ' : ''}${c.number}`)
          .join(', '),
      }))
      .sort(sortComparator('value')));
  }, [initialStandards, filterContext]);

  const handleSort = (property, orderDirection) => {
    const descending = orderDirection === 'desc';
    setStandards((prev) => [...prev].sort(sortComparator(property, descending)));
    setOrderBy(property);
    setOrder(orderDirection);
  };

  return (
    <>
      <ChplFilterSearchBar
        placeholder="Search by Value, Citation, Rule, or Group..."
      />
      <div>
        <ChplFilterChips />
      </div>
      <Box className={classes.headerContainer}>
        <Box display="flex" flexDirection="row" gridGap={2} alignItems="center">
          <Typography variant="subtitle2">Search Results</Typography>
          <Typography variant="body2">
            {`(${standards.length} Result${standards.length !== 1 ? 's' : ''})`}
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
            fetch={useFetchStandardsActivity}
            title="Standards"
          />
          { hasAnyRole(['chpl-admin', 'chpl-onc']) && (
            <Button
              onClick={() => dispatch({ action: 'edit', payload: {} })}
              id="add-new-standard"
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
        { standards
          .map((item) => (
            <ChplSearchResultCard
              key={`${item.id}-${item.value}`}
              cardTitle="Value"
              cardTitleValue={`${item.value}${item.retired ? ' (Expired)' : ''}`}
              additionalTitleContent={(
                <ChplUpdateIndicator
                  requiredDay={item.requiredDay}
                  endDay={item.endDay}
                  additionalInformation={item.additionalInformation}
                />
              )}
              fieldGroups={[
                [
                  {
                    label: 'Regulatory Text Citation',
                    value: item.regulatoryTextCitation || 'N/A',
                    iconButton: (
                      <ChplTooltip title="Use this value in a upload file">
                        <IconButton color="primary" size="small">
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </ChplTooltip>
                    ),
                  },
                  {
                    label: 'Rule',
                    value: item.rule?.name ?? 'N/A',
                  },
                  {
                    label: 'Group',
                    value: item.groupName ?? 'N/A',
                  },
                  {
                    label: 'Applicable Criteria',
                    value: item.criteriaDisplay || 'N/A',
                  },
                ],
                [
                  {
                    label: 'Start Date',
                    value: getDisplayDateFormat(item.startDay),
                  },
                  {
                    label: 'Required Date',
                    value: getDisplayDateFormat(item.requiredDay),
                  },
                  {
                    label: 'Extension End Date',
                    value: getDisplayDateFormat(item.extensionEndDay),
                  },
                  {
                    label: 'End Date',
                    value: getDisplayDateFormat(item.endDay),
                  },
                ],
              ]}
              actions={
                hasAnyRole(['chpl-admin', 'chpl-onc']) && (
                  <Button
                    onClick={() => dispatch({ action: 'edit', payload: item })}
                    id={`edit-standard-${item.value}`}
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

export default ChplStandardsView;

ChplStandardsView.propTypes = {
  dispatch: func.isRequired,
  standards: arrayOf(standardPropType).isRequired,
};
