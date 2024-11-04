import React, { useContext, useEffect, useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  Button,
  ButtonGroup,
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Moment from 'react-moment';
import { arrayOf } from 'prop-types';

import {
  ChplFilterChips,
  useFilterContext,
} from 'components/filter';
import {
  ChplLink,
  ChplPagination,
} from 'components/util';
import { eventTrack } from 'services/analytics.service';
import { getDisplayDateFormat } from 'services/date-util';
import { useSessionStorage as useStorage } from 'services/storage.service';
import { UserContext, useAnalyticsContext } from 'shared/contexts';
import { product as productPropType } from 'shared/prop-types';
import { palette, theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  products: {
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column',
    borderColor: palette.divider,
    borderWidth: '.5px',
    borderStyle: 'solid',
    padding: '0px',
    backgroundColor: palette.white,
  },
  productsSummary: {
    backgroundColor: `${palette.white} !important`,
    borderRadius: '4px',
    borderBottom: `.5px solid ${palette.divider}`,
    width: '100%',
    padding: '0 4px',
  },
  tableResultsHeaderContainer: {
    display: 'grid',
    gap: '8px',
    margin: '16px 32px',
    gridTemplateColumns: '1fr',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: 'auto auto',
    },
  },
  resultsContainer: {
    display: 'grid',
    gap: '8px',
    justifyContent: 'start',
    gridTemplateColumns: 'auto auto',
    alignItems: 'center',
  },
  wrap: {
    flexFlow: 'wrap',
  },
  tableFirstColumn: {
    position: 'sticky',
    left: 0,
    boxShadow: 'rgba(149, 157, 165, 0.1) 0px 4px 8px',
    backgroundColor: '#ffffff',
  },
  tableDeveloperCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  developerName: {
    fontWeight: '600',
  },
  noResultsContainer: {
    padding: '16px 32px',
  },
});

function ChplProductsView({ products }) {
  const storageKey = 'storageKey-productsView';
  const { analytics } = useAnalyticsContext();
  const { hasAnyRole } = useContext(UserContext);
  const [order, setOrder] = useStorage(`${storageKey}-order`, 'desc');
  const { queryParams, queryString } = useFilterContext();
  const [displayedProdts, setDisplayedProducts] = useState([]);
  const classes = useStyles();

  const getIcon = (product) => (product.expanded
    ? (
      <>
        <Typography color="primary" variant="body2">Hide Details</Typography>
        <ExpandMoreIcon color="primary" fontSize="large" className={classes.rotate} />
      </>
    )
    : (
      <>
        <Typography color="primary" variant="body2">Show Details</Typography>
        <ExpandMoreIcon color="primary" fontSize="large" />
      </>
    ));

  const handleAccordionChange = (product) => {
    eventTrack({
      ...analytics,
      event: expanded ? `Hide Product ${product.name}` : `Show Product ${product.name}`,
    });
    setExpanded(!expanded);
  };

  return (
    <Card>
      <CardHeader title="Products" />
      <CardContent>
        <div>
          <ChplFilterChips />
        </div>
        <div className={classes.tableResultsHeaderContainer}>
          <div className={`${classes.resultsContainer} ${classes.wrap}`}>
            <Typography variant="subtitle2">Search Results:</Typography>
            { products.length === 0
              && (
                <>
                  No results found
                </>
              )}
            { products.length > 0
              && (
                <Typography variant="body2">
                  {products.length}
                  {' '}
                  Result
                  { products.length === 1 ? '' : 's' }
                </Typography>
              )}
          </div>
        </div>
        { products.map((product) => (
          <Accordion
            key={product.id}
            className={classes.products}
            onChange={() => handleAccordionChange(product)}
          >
            <AccordionSummary
              expandIcon={getIcon(product)}
              className={classes.productsSummary}
            >
              <Box display="flex" flexDirection="row" justifyContent="space-between" width="100%">
                <Typography variant="body1">
                  { product.name }
                </Typography>
                <Typography variant="body2">
                  (
                  { product.versions.length }
                  {' '}
                  version
                  { product.versions.length !== 1 ? 's ' : ' ' }
                  found)
                </Typography>
              </Box>
            </AccordionSummary>
            <CardContent>
              <TableContainer component={Paper}>
                <Table
                  stickyHeader
                  aria-label="Listings table"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>CHPL ID</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell># Non-conformities</TableCell>
                      <TableCell>Certification Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    { product.versions
                      .filter((version) => version.version !== 'All') // remove when angularJS component is removed
                      .flatMap((version) => version.listings
                               .map((item) => (
                                 <TableRow key={item.id}>
                                   <TableCell>{item.chplProductNumber}</TableCell>
                                   <TableCell>{item.certificationStatus}</TableCell>
                                   <TableCell>
                                     { item.openSurveillanceNonConformityCount }
                                     {' open / '}
                                     { item.closedSurveillanceNonConformityCount }
                                     {' closed'}
                                   </TableCell>
                                   <TableCell>{getDisplayDateFormat(item.certificationDay)}</TableCell>
                                 </TableRow>
                               )))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Accordion>
        ))}
      </CardContent>
    </Card>
  );
}

export default ChplProductsView;

ChplProductsView.propTypes = {
  products: arrayOf(productPropType),
};

ChplProductsView.defaultProps = {
  products: [],
};
