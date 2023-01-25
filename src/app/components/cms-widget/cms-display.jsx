import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Box,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  List,
  ListItem,
  Typography,
  makeStyles,
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import DeleteIcon from '@material-ui/icons/Delete';

import { useFetchCmsIdAnalysis } from 'api/cms';
import { ChplLink } from 'components/util';
import ChplEllipsis from 'components/util/chpl-ellipsis';
import { getAngularService } from 'services/angular-react-helper';
import { CmsContext } from 'shared/contexts';

const ProgressBar = (props) => {
  const { value } = props;
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress
          variant="determinate"
          {...props}
        />
      </Box>
      <Box minWidth={70}>
        <Typography variant="body2" color="textSecondary">
          { value }
          % Base Criteria Met
        </Typography>
      </Box>
    </Box>
  );
};

const useStyles = makeStyles({
  buttonContainer: {
    marginTop: '16px',
    gap: '8px',
    display: 'flex',
    flexDirection: 'column',
  },
  cardcontentPadding: {
    padding: '8px',
  },
  chipContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  deleteButton: {
    backgroundColor: '#c44f65',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#853544',
    },
  },
  productChips: {
    justifyContent: 'space-between',
    marginBottom: '8px',
    display: 'flex',
  },
});

function ChplCmsDisplay() {
  const $analytics = getAngularService('$analytics');
  const $rootScope = getAngularService('$rootScope');
  const { listings, removeListing } = useContext(CmsContext);
  const { data, isFetching, isSuccess } = useFetchCmsIdAnalysis(listings);
  const [idAnalysis, setIdAnalysis] = useState({});
  const classes = useStyles();

  useEffect(() => {
    if (isFetching || !isSuccess) { return; }
    setIdAnalysis(data);
  }, [data, isFetching, isSuccess]);

  const actOnCertId = () => {
    console.log('acting');
  };

  const compareAll = () => {
    $analytics.eventTrack('Compare Listings', { category: 'CMS Widget' });
    console.log('do compare all');
  };

  const removeAll = () => {
    $analytics.eventTrack('Remove all Listings', { category: 'CMS Widget' });
    $rootScope.$broadcast('removeAll');
  };

  if (!listings || listings.length === 0) {
    return (
      <Typography>No products selected</Typography>
    );
  }

  return (
    <CardContent className={classes.cardcontentPadding}>
      { idAnalysis.metPercentages?.criteriaMet < 100
        && (
          <Typography>
            Note the selected product{listings?.length !== 1 ? 's' : ''} must meet 100% of the Base Criteria. For assistance, view the
            {' '}
            <ChplLink
              href="https://www.healthit.gov/sites/default/files/policy/chpl_public_user_guide.pdf"
              text="CHPL Public User Guide"
              analytics={{ event: 'Open CHPL Public User Guide', category: 'CMS Widget' }}
              external={false}
              inline
            />
            {' '}
            or
            {' '}
            <ChplLink
              href="http://healthit.gov/topic/certification-ehrs/2015-edition-test-method/2015-edition-cures-update-base-electronic-health-record-definition"
              text="Base Criteria"
              analytics={{ event: 'Open Base Criteria', category: 'CMS Widget' }}
              external={false}
              inline
            />
            .
          </Typography>
        )}
      { idAnalysis.products?.length > 0
        && (
          <ProgressBar
            value={idAnalysis.metPercentages.criteriaMet}
          />
        )}
      { idAnalysis.missingAnd?.length > 0
        && (
          <>
            <Typography>Please select a product or products that contain the following criteria:</Typography>
            <List>
              { idAnalysis.missingAnd.map((criterion) => <ListItem key={criterion}>{ criterion }</ListItem>)}
            </List>
          </>
        )}
      { idAnalysis.missingOr?.length > 0
        && (
          <>
            <Typography>
              { idAnalysis.missingAnd.length > 0 && 'In addition, products' }
              { idAnalysis.missingAnd.length === 0 && 'Please select a product' }
              {' '}
              with at least 1 criteria from the following group
              { idAnalysis.missingOr.length > 1 && 's' }
            </Typography>
            <List>
              { idAnalysis.missingOr.map((criteria) => <ListItem key={criteria.join(',')}>{ criteria.join(', ') }</ListItem>)}
            </List>
          </>
        )}
      <div className={classes.chipContainer}>
        { listings.sort((a, b) => (a.name < b.name ? -1 : 1))
          .map((listing) => (
            <Chip
              className={classes.productChips}
              color="primary"
              variant="outlined"
              key={listing.id}
              label={<ChplEllipsis text={listing.name} />}
              onDelete={() => removeListing(listing)}
            />
          ))}
      </div>
      <Typography>
        To view which products were used to create a specific CMS ID, use the
        {' '}
        <ChplLink
          href="#/resources/cms-lookup"
          text="CMS ID Reverse Lookup"
          analytics={{ event: 'Go to CMS ID Reverse Lookup page', category: 'CMS Widget' }}
          external={false}
          router={{ sref: 'resources.cms-lookup' }}
          inline
        />
        .
      </Typography>
      <Divider />
      <div className={classes.buttonContainer}>
        <Button
          fullWidth
          color="primary"
          variant="contained"
          id="act-on-cert-id"
          onClick={actOnCertId}
          disabled={!idAnalysis.valid}
          endIcon={<CheckIcon />}
        >
          Create Certification ID
        </Button>
        <Button
          fullWidth
          color="primary"
          variant="outlined"
          id="compare-listings"
          onClick={compareAll}
          disabled={listings.length === 1}
          endIcon={<CompareArrowsIcon />}
        >
          Compare Products
        </Button>
        <Button
          className={classes.deleteButton}
          fullWidth
          variant="contained"
          id="remove-listings"
          onClick={removeAll}
          endIcon={<DeleteIcon />}
        >
          Remove All
        </Button>
      </div>
    </CardContent>
  );
}

export default ChplCmsDisplay;
