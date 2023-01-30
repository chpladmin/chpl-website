import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Box,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import DeleteIcon from '@material-ui/icons/Delete';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';

import createPdf from './cms-pdf';

import { useFetchCmsIdAnalysis, useFetchCmsIdPdf, usePostCreateCmsId } from 'api/cms';
import { ChplLink } from 'components/util';
import ChplEllipsis from 'components/util/chpl-ellipsis';
import { getAngularService } from 'services/angular-react-helper';
import { CmsContext } from 'shared/contexts';

const ProgressBar = (props) => {
  const { value } = props;
  return (
    <Box
      pt={2}
      gridGap={8}
      pb={2}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      id="progress-bar"
    >
      <Box width="56%">
        <LinearProgress
          id="progress-bar-bar"
          variant="determinate"
          {...props}
        />
      </Box>
      <Box>
        <Typography
          variant="body2"
          color="textPrimary"
          id="progress-bar-text"
        >
          <strong>
            { value }
            %
          </strong>
          {' '}
          Base Criteria Met
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
  secondaryButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: '8px',
  },
  cardcontentPadding: {
    padding: '8px',
  },
  chipContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '4px',
    marginTop: '16px',
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
  certCopyContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

function ChplCmsDisplay() {
  const $analytics = getAngularService('$analytics');
  const $rootScope = getAngularService('$rootScope');
  const { cannotGenerate15EIsOn, listings, removeListing } = useContext(CmsContext);
  const [certId, setCertId] = useState(undefined);
  const [idAnalysis, setIdAnalysis] = useState({});
  const [isDownloading, setIsDownloading] = useState(false);
  const { data, isFetching, isSuccess } = useFetchCmsIdAnalysis(listings);
  const { data: pdfData, isFetching: pdfIsFetching, isSuccess: pdfIsSuccess } = useFetchCmsIdPdf(certId, isDownloading);
  const { mutate } = usePostCreateCmsId(listings);
  const classes = useStyles();

  useEffect(() => {
    if (isFetching || !isSuccess) { return; }
    setIdAnalysis(data);
  }, [data, isFetching, isSuccess]);

  useEffect(() => {
    if (pdfIsFetching || !pdfIsSuccess) { return; }
    createPdf(pdfData, cannotGenerate15EIsOn);
    setIsDownloading(false);
  }, [pdfData, pdfIsFetching, pdfIsSuccess, cannotGenerate15EIsOn]);

  useEffect(() => {
    setCertId(undefined);
  }, [listings]);

  const compareAll = () => {
    $analytics.eventTrack('Compare Listings', { category: 'CMS Widget' });
    $rootScope.$broadcast('compare.compareAll', listings);
    $rootScope.$broadcast('HideCmsWidget');
    $rootScope.$broadcast('ShowCompareWidget');
    $rootScope.$digest();
  };

  const copyToClipboard = () => {
    $analytics.eventTrack('Copy EHR Certification ID to Clipboard', { category: 'CMS Widget' });
    navigator.clipboard.writeText(certId);
  };

  const createCertId = () => {
    $analytics.eventTrack('Get EHR Certification ID', { category: 'CMS Widget' });
    mutate({}, {
      onSuccess: (response) => {
        setCertId(response.data.ehrCertificationId);
      },
    });
  };

  const downloadPdf = () => {
    $analytics.eventTrack('Download EHR Certification ID PDF', { category: 'CMS Widget' });
    setIsDownloading(true);
  };

  const removeAll = () => {
    $analytics.eventTrack('Remove all Listings', { category: 'CMS Widget' });
    $rootScope.$broadcast('cms.removeAll');
  };

  if (!listings || listings.length === 0) {
    return (
      <>
        <Typography gutterBottom><strong>No products selected.</strong></Typography>
        <Typography>
          Note: the selected product
          {listings?.length !== 1 ? 's' : ''}
          {' '}
          must meet 100% of the Base Criteria. For assistance, view the
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
        <Divider />
        <Typography variant="body2">
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
      </>
    );
  }

  return (
    <CardContent className={classes.cardcontentPadding}>
      { certId
        && (
          <>
            <Typography>
              <strong> Your CMS EHR Certification ID</strong>
            </Typography>
            <div className={classes.certCopyContainer}>
              <Typography color="primary">
                { certId }
              </Typography>
              <IconButton
                onClick={copyToClipboard}
                color="primary"
              >
                <FileCopyOutlinedIcon />
              </IconButton>
            </div>
            <Typography variant="body2">
              * Additional certification criteria may need to be added in order to meet submission requirements for Medicaid and Medicare programs.
            </Typography>
          </>
        )}
      { idAnalysis.metPercentages?.criteriaMet < 100
        && (
          <Typography>
            Note: the selected product
            {listings?.length !== 1 ? 's' : ''}
            {' '}
            must meet 100% of the Base Criteria. For assistance, view the
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
            <Divider />
            <Typography variant="body2">Please select a product or products that contain the following criteria:</Typography>
            <List id="missing-and">
              { idAnalysis.missingAnd.map((criterion) => <ListItem key={criterion}><Typography variant="body2">{ criterion }</Typography></ListItem>)}
            </List>
          </>
        )}
      { idAnalysis.missingOr?.length > 0
        && (
          <>
            <Divider />
            <Typography variant="body2">
              { idAnalysis.missingAnd.length > 0 && 'In addition, products' }
              { idAnalysis.missingAnd.length === 0 && 'Please select a product' }
              {' '}
              with at least 1 criteria from the following group
              { idAnalysis.missingOr.length > 1 && 's' }
            </Typography>
            <List id="missing-or">
              { idAnalysis.missingOr.map((criteria) => <ListItem key={criteria.join(',')}><Typography variant="body2">{ criteria.join(', ') }</Typography></ListItem>)}
            </List>
          </>
        )}
      <Divider />
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
      { isFetching && <CircularProgress id="cms-id-processing" size={20} /> }
      <Divider />
      <Typography variant="body2">
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
      <div className={classes.buttonContainer}>
        { !certId
          && (
            <Button
              fullWidth
              color="primary"
              variant="contained"
              id="create-cert-id"
              onClick={createCertId}
              disabled={!idAnalysis.valid}
              endIcon={<ArrowForwardIcon />}
            >
              Create Certification ID
            </Button>
          )}
        { certId
          && (
            <Button
              fullWidth
              color="primary"
              variant="contained"
              id="download-cert-id"
              onClick={downloadPdf}
              endIcon={<ArrowDownwardIcon />}
            >
              Download PDF
            </Button>
          )}
        <div className={classes.secondaryButtonContainer}>
          <Button
            fullWidth
            color="primary"
            variant="outlined"
            id="compare-listings"
            onClick={compareAll}
            disabled={listings.length === 1}
            endIcon={<CompareArrowsIcon />}
          >
            Compare All
          </Button>
          <Button
            fullWidth
            className={classes.deleteButton}
            variant="contained"
            id="remove-listings"
            onClick={removeAll}
            endIcon={<DeleteIcon />}
          >
            Remove All
          </Button>
        </div>
      </div>
    </CardContent>
  );
}

export default ChplCmsDisplay;
