import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
} from '@material-ui/core';
import { arrayOf, func } from 'prop-types';
import AddIcon from '@material-ui/icons/Add';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import InfoIcon from '@material-ui/icons/Info';

import { useFetchFunctionalitiesTestedActivity } from 'api/activity';
import ChplSystemMaintenanceActivity from 'components/activity/system-maintenance-activity';
import {
  ChplFilterLayout,
  ChplFilterSearchBar,
  useFilterContext,
} from 'components/filter';
import {
  ChplSearchResultCard,
  ChplSearchResultControls,
  ChplSortControls,
  ChplTooltip,
  ChplUpdateIndicator,
} from 'components/util';
import { sortComparator } from 'components/util/sortable-headers';
import { sortCriteria } from 'services/criteria.service';
import { getDisplayDateFormat } from 'services/date-util';
import { UserContext } from 'shared/contexts';
import { functionalityTested as functionalityTestedPropType } from 'shared/prop-types';
import { palette } from 'themes';

const sortOptions = [
  { property: 'value', text: 'Value' },
  { property: 'regulatoryTextCitation', text: 'Citation' },
  { property: 'startDay', text: 'Start Date' },
  { property: 'requiredDay', text: 'Required Date' },
  { property: 'extensionEndDay', text: 'Extension End' },
  { property: 'endDay', text: 'End Date' },
];

function ChplFunctionalitiesTestedView({ dispatch, functionalitiesTested: initialFunctionalitiesTested }) {
  const { hasAnyRole } = useContext(UserContext);
  const [functionalitiesTested, setFunctionalitiesTested] = useState([]);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('value');
  const filterContext = useFilterContext();

  useEffect(() => {
    setFunctionalitiesTested(initialFunctionalitiesTested
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
  }, [initialFunctionalitiesTested, filterContext]);

  const handleSort = (property, orderDirection) => {
    const descending = orderDirection === 'desc';
    setFunctionalitiesTested((prev) => [...prev].sort(sortComparator(property, descending)));
    setOrderBy(property);
    setOrder(orderDirection);
  };

  return (
    <>
      <ChplFilterSearchBar
        placeholder="Search by Value, Citation, Rule, or Practice Type..."
        sticky
        fadeBackground={palette.white}
      />
      <ChplFilterLayout>
        <ChplSearchResultControls
          recordCount={functionalitiesTested.length}
          pageStart={functionalitiesTested.length > 0 ? 1 : 0}
          pageEnd={functionalitiesTested.length}
          fadeBackground={palette.white}
        >
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
        </ChplSearchResultControls>
        <Box>
          {functionalitiesTested
            .map((item) => (
              <ChplSearchResultCard
                key={`${item.id}-${item.value}`}
                cardTitle="Value"
                cardTitleValue={`${item.value}${item.retired ? ' (Retired)' : ''}`}
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
                      value: item.rule?.name || 'N/A',
                    },
                    {
                      label: 'Practice Type',
                      value: item.practiceType?.name || 'N/A',
                    },
                    {
                      label: 'Applicable Criteria',
                      value: item.criteriaDisplay || 'N/A',
                    },
                  ],
                  [
                    {
                      label: 'Start Date',
                      value: getDisplayDateFormat(item.startDay) || 'N/A',
                    },
                    {
                      label: 'End Date',
                      value: getDisplayDateFormat(item.endDay) || 'N/A',
                    },
                    {
                      label: 'Required Date',
                      value: getDisplayDateFormat(item.requiredDay) || 'N/A',
                    },
                    {
                      label: 'Extension End Date',
                      value: getDisplayDateFormat(item.extensionEndDay) || 'N/A',
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
      </ChplFilterLayout>
    </>
  );
}

export default ChplFunctionalitiesTestedView;

ChplFunctionalitiesTestedView.propTypes = {
  dispatch: func.isRequired,
  functionalitiesTested: arrayOf(functionalityTestedPropType).isRequired,
};
