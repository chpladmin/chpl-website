import React, { useContext, useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { arrayOf, func } from 'prop-types';

import ChplProductView from './product-view';

import ChplProductsHistory from 'components/activity/products-history';
import {
  ChplFilterChips,
  ChplFilterSearchBar,
  useFilterContext,
} from 'components/filter';
import { UserContext } from 'shared/contexts';
import { product as productPropType } from 'shared/prop-types';
import { theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  cardHeader: {
    margin: '0',
    fontSize: '1.25em',
  },
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
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
});

const includeListing = (listing, params) => {
  let include = true;
  if (params.certificationStatuses) {
    include = include && params.certificationStatuses.includes(listing.certificationStatus);
  }
  if (params.hasHadComplianceActivity === 'true') {
    include = include && (listing.closedSurveillanceCount > 0 || listing.openSurveillanceCount > 0);
  }
  if (params.hasHadComplianceActivity === 'false') {
    include = include && listing.closedSurveillanceCount === 0 && listing.openSurveillanceCount === 0;
  }
  if (params.nonConformityOptionsOperator === 'or') {
    const opts = params.nonConformityOptions.split(',');
    let meets = 0;
    if (opts.includes('closed_nonconformity') && listing.closedSurveillanceNonConformityCount > 0) { meets += 1; }
    if (opts.includes('never_nonconformity') && listing.closedSurveillanceNonConformityCount === 0 && listing.openSurveillanceNonConformityCount === 0) { meets += 1; }
    if (opts.includes('not_closed_nonconformity') && listing.closedSurveillanceNonConformityCount === 0) { meets += 1; }
    if (opts.includes('not_never_nonconformity') && (listing.closedSurveillanceNonConformityCount > 0 || listing.openSurveillanceNonConformityCount > 0)) { meets += 1; }
    if (opts.includes('not_open_nonconformity') && listing.openSurveillanceNonConformityCount === 0) { meets += 1; }
    if (opts.includes('open_nonconformity') && listing.openSurveillanceNonConformityCount > 0) { meets += 1; }
    include = include && meets > 0;
  }
  if (params.nonConformityOptionsOperator === 'and') {
    const opts = params.nonConformityOptions.split(',');
    if (opts.includes('closed_nonconformity')) { include = include && listing.closedSurveillanceNonConformityCount > 0; }
    if (opts.includes('never_nonconformity')) { include = include && listing.closedSurveillanceNonConformityCount === 0 && listing.openSurveillanceNonConformityCount === 0; }
    if (opts.includes('not_closed_nonconformity')) { include = include && listing.closedSurveillanceNonConformityCount === 0; }
    if (opts.includes('not_never_nonconformity')) { include = include && (listing.closedSurveillanceNonConformityCount > 0 || listing.openSurveillanceNonConformityCount > 0); }
    if (opts.includes('not_open_nonconformity')) { include = include && listing.openSurveillanceNonConformityCount === 0; }
    if (opts.includes('open_nonconformity')) { include = include && listing.openSurveillanceNonConformityCount > 0; }
  }
  return include;
};

const sortProducts = (a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' });

function ChplProductsView({ products, dispatch }) {
  const { hasAnyRole } = useContext(UserContext);
  const { queryParams } = useFilterContext();
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [params, setParams] = useState({});
  const classes = useStyles();

  useEffect(() => {
    setParams(queryParams());
  }, [queryParams]);

  useEffect(() => {
    setDisplayedProducts(products
      .map((product) => ({
        ...product,
        versions: product.versions.map((version) => ({
          ...version,
          listings: version.listings.filter((listing) => includeListing(listing, params)),
        })).filter((version) => version.listings.length > 0),
      }))
      .filter((product) => product.versions.length > 0));
  }, [params, products]);

  return (
    <Card>
      <CardHeader
        title={(
          <div className={classes.headerContainer}>
            Products
            { hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb'])
              && (
                <ChplProductsHistory
                  products={products}
                />
              )}
          </div>
        )}
        component="div"
        className={classes.cardHeader}
      />
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
        { displayedProducts
          .sort((a, b) => sortProducts(a, b))
          .map((product) => (
            <ChplProductView
              key={product.id}
              product={product}
              dispatch={dispatch}
            />
          ))}
      </CardContent>
    </Card>
  );
}

export default ChplProductsView;

ChplProductsView.propTypes = {
  products: arrayOf(productPropType),
  dispatch: func.isRequired,
};

ChplProductsView.defaultProps = {
  products: [],
};
