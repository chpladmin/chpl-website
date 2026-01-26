import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { arrayOf } from 'prop-types';

import {
  ChplFilterChips,
  ChplFilterSearchBar,
  useFilterContext,
} from 'components/filter';
import { ChplLink, ChplSearchResultCard, ChplSortControls } from 'components/util';
import { sortComparator } from 'components/util/sortable-headers';
import { getDisplayDateFormat } from 'services/date-util';
import { criterion as criterionPropType } from 'shared/prop-types';
import { utilStyles } from 'themes';

const sortOptions = [
  { property: 'number', text: 'Number' },
  { property: 'title', text: 'Title' },
  { property: 'startDay', text: 'Start Date' },
  { property: 'endDay', text: 'End Date' },
];

const useStyles = makeStyles({
  ...utilStyles,
});

const getDisplay = (key) => {
  switch (key) {
    case 'additionalSoftware': return 'Additional Software';
    case 'apiDocumentation': return 'API Documentation';
    case 'attestationAnswer': return 'Attestation Answer';
    case 'codeSet': return 'Code Sets';
    case 'conformanceMethod': return 'Conformance Method';
    case 'documentationUrl': return 'Documentation URL';
    case 'exportDocumentation': return 'Export Documentation';
    case 'functionalityTested': return 'Functionality Tested';
    case 'g1Success': return 'G1 Success';
    case 'g2Success': return 'G2 Success';
    case 'optionalStandard': return 'Optional Standard';
    case 'privacySecurityFramework': return 'Privacy & Security Framework';
    case 'riskManagementSummaryInformation': return 'Risk Management Summary Information';
    case 'sed': return 'SED';
    case 'serviceBaseUrlList': return 'Service Base URL List';
    case 'standard': return 'Standard';
    case 'standardsTested': return 'Standards Tested';
    case 'svap': return 'SVAP';
    case 'testData': return 'Test Data';
    case 'testProcedure': return 'Test Procedure';
    case 'testTool': return 'Test Tool';
    case 'useCases': return 'Use Cases';
    default:
      console.debug(key);
      return key;
  }
};

function ChplCertificationCriteriaView(props) {
  const [certificationCriteria, setCertificationCriteria] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('value');
  const filterContext = useFilterContext();
  const classes = useStyles();

  useEffect(() => {
    setCertificationCriteria(props.certificationCriteria
      .filter((item) => filterContext.filters.reduce((acc, f) => f.filterFn(item, f) && acc, true))
      .filter((item) => filterContext.searchTermFilter(filterContext.searchTerm, [
        item.number,
        item.title,
        item.rule?.name,
      ]))
      .map((item) => ({
        ...item,
        displayAttributes: Object
          .entries(item.attributes)
          .filter(([, value]) => value)
          .map(([key]) => getDisplay(key))
          .sort((a, b) => (a < b ? -1 : 1))
          .join('; '),
      }))
      .sort(sortComparator('value')));
  }, [props.certificationCriteria, filterContext.filters, filterContext.searchTerm]);

  const handleSort = (property, orderDirection) => {
    const descending = orderDirection === 'desc';
    setCertificationCriteria((prev) => [...prev].sort(sortComparator(property, descending)));
    setOrderBy(property);
    setOrder(orderDirection);
  };

  return (
    <>
      <ChplFilterSearchBar
        placeholder="Search by Number, Title, or Rule..."
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
            {`(${certificationCriteria.length} Result${certificationCriteria.length !== 1 ? 's' : ''})`}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gridGap={4}>
          <ChplSortControls
            sortOptions={sortOptions}
            orderBy={orderBy}
            order={order}
            onSort={handleSort}
          />
        </Box>
      </Box>
      <Box style={{ maxHeight: 'calc(100vh - 400px)', overflow: 'auto', padding: '16px' }}>
        {certificationCriteria
          .map((item) => (
            <ChplSearchResultCard
              key={`${item.id}`}
              title="Number"
              titleValue={`${item.removed ? 'Removed | ' : ''}${item.number}`}
              fieldGroups={[
                [
                  {
                    label: 'Title',
                    value: item.title,
                    xs: 6,
                    sm: 4,
                  },
                  {
                    label: 'Start Date',
                    value: getDisplayDateFormat(item.startDay),
                    xs: 6,
                    sm: 4,
                  },
                  {
                    label: 'End Date',
                    value: getDisplayDateFormat(item.endDay),
                    xs: 6,
                    sm: 4,
                  },
                ],
                [
                  {
                    label: 'Rule',
                    value: item.rule?.name || 'N/A',
                    xs: 6,
                    sm: 4,
                  },
                  {
                    label: 'Certification Companion Guide',
                    value: item.companionGuideLink ? (
                      <ChplLink
                        href={item.companionGuideLink}
                        text={item.companionGuideLink}
                        external={false}
                      />
                    ) : 'N/A',
                    xs: 6,
                    sm: 4,
                  },
                  {
                    label: 'Attributes',
                    value: item.displayAttributes.length > 0 ? item.displayAttributes : 'N/A',
                    xs: 12,
                    sm: 4,
                  },
                ],
              ]}
            />
          ))}
      </Box>
    </>
  );
}

export default ChplCertificationCriteriaView;

ChplCertificationCriteriaView.propTypes = {
  certificationCriteria: arrayOf(criterionPropType).isRequired,
};
