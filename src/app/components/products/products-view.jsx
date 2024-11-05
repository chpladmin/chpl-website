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

import ChplProductView from './product-view';

import {
  ChplFilterChips,
  ChplFilterSearchBar,
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
  const { queryParams, queryString } = useFilterContext();
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    setDisplayedProducts(products);
  }, [products]);

  return (
    <Card>
      <CardHeader title="Products" />
      <CardContent>
        <ChplFilterSearchBar
          hideSearchTerm
        />
        <div>
          <ChplFilterChips />
        </div>
        <div className={classes.tableResultsHeaderContainer}>
          <div className={`${classes.resultsContainer} ${classes.wrap}`}>
            <Typography variant="subtitle2">Search Results:</Typography>
            { displayedProducts.length === 0
              && (
                <>
                  No results found
                </>
              )}
            { displayedProducts.length > 0
              && (
                <Typography variant="body2">
                  { displayedProducts.length }
                  {' '}
                  Result
                  { displayedProducts.length === 1 ? '' : 's' }
                </Typography>
              )}
          </div>
        </div>
        { displayedProducts.map((product) => (
          <ChplProductView
            key={product.id}
            product={product}
          />
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
