import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { arrayOf } from 'prop-types';

import {
  ChplFilterChips,
  ChplFilterSearchBar,
  useFilterContext,
} from 'components/filter';
import { ChplLink } from 'components/util';
import { ChplSortableHeaders, sortComparator } from 'components/util/sortable-headers';
import { getDisplayDateFormat } from 'services/date-util';
import { criterion as criterionPropType } from 'shared/prop-types';
import { utilStyles } from 'themes';

const headers = [
  { property: 'number', text: 'Number', sortable: true },
  { property: 'title', text: 'Title', sortable: true },
  { property: 'startDay', text: 'Start Date', sortable: true },
  { property: 'endDay', text: 'End Date', sortable: true },
  { text: 'Certification Companion Guide' },
  { text: 'Rule' },
  { text: 'Attributes' },
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
    case 'gap': return 'Gap';
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

function ChplCertificationCriteriaView({ certificationCriteria: initialCertificationCriteria }) {
  const [certificationCriteria, setCertificationCriteria] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('value');
  const filterContext = useFilterContext();
  const classes = useStyles();

  useEffect(() => {
    setCertificationCriteria(initialCertificationCriteria
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
  }, [initialCertificationCriteria, filterContext.filters, filterContext.searchTerm]);

  const handleTableSort = (event, property, orderDirection) => {
    const descending = orderDirection === 'desc';
    const updated = certificationCriteria.sort(sortComparator(property, descending));
    setOrderBy(property);
    setOrder(orderDirection);
    setCertificationCriteria(updated);
  };

  return (
    <>
      <ChplFilterSearchBar
        placeholder="Search by Number, Title, or Rule..."
      />
      <div>
        <ChplFilterChips />
      </div>
      <div className={classes.tableResultsHeaderContainer}>
        <Box display="flex" flexDirection="row" gridGap={1}>
          <Typography variant="subtitle2">
            Search Results:
          </Typography>
          <Typography variant="body2">
            {`(${certificationCriteria.length} Result${certificationCriteria.length !== 1 ? 's' : ''})`}
          </Typography>
        </Box>
      </div>
      <TableContainer className={classes.container} component={Paper}>
        <Table
          aria-label="Certification Criteria table"
        >
          <ChplSortableHeaders
            headers={headers}
            onTableSort={handleTableSort}
            orderBy={orderBy}
            order={order}
            stickyHeader
          />
          <TableBody>
            { certificationCriteria
              .map((item) => (
                <TableRow key={`${item.id}`}>
                  <TableCell className={classes.firstColumn}>
                    { item.removed
                      && (
                        <>
                          Removed |
                        </>
                      )}
                    { item.number }
                  </TableCell>
                  <TableCell>
                    { item.title }
                  </TableCell>
                  <TableCell>
                    { getDisplayDateFormat(item.startDay) }
                  </TableCell>
                  <TableCell>
                    { getDisplayDateFormat(item.endDay) }
                  </TableCell>
                  <TableCell>
                    { item.companionGuideLink
                      && (
                        <ChplLink
                          href={item.companionGuideLink}
                          text={item.companionGuideLink}
                          external={false}
                        />
                      )}
                    { !item.companionGuideLink
                      && (
                        'N/A'
                      )}
                  </TableCell>
                  <TableCell>
                    { item.rule?.name }
                  </TableCell>
                  <TableCell>
                    { item.displayAttributes.length > 0 ? item.displayAttributes : 'N/A' }
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default ChplCertificationCriteriaView;

ChplCertificationCriteriaView.propTypes = {
  certificationCriteria: arrayOf(criterionPropType).isRequired,
};
