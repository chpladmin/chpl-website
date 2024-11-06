import React, { useContext, useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { arrayOf } from 'prop-types';

import ChplProductView from './product-view';

import {
  ChplFilterChips,
  ChplFilterSearchBar,
  useFilterContext,
} from 'components/filter';
import {
  ChplLink,
} from 'components/util';
import { eventTrack } from 'services/analytics.service';
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

function ChplProductsView({ products }) {
  const { analytics } = useAnalyticsContext();
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
          unfilteredListings: version.listings,
        })).filter((version) => version.listings.length > 0),
      }))
      .filter((product) => product.versions.length > 0));
  }, [params, products]);

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
        { displayedProducts
          .sort((a, b) => sortProducts(a, b))
          .map((product) => (
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
