import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Box,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import DeleteIcon from '@material-ui/icons/Delete';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import PropTypes from 'prop-types';

import createPdf from './cms-pdf';

import { useFetchCmsIdAnalysis, useFetchCmsIdPdf, usePostCreateCmsId } from 'api/cms';
import { ChplLink } from 'components/util';
import ChplEllipsis from 'components/util/chpl-ellipsis';
import { getAngularService } from 'services/angular-react-helper';
import { CmsContext, FlagContext } from 'shared/contexts';
import { utilStyles } from 'themes';

const getProgressColor = (theme, value) => {
  if (value >= 100) return theme.palette.success?.main || '#66926d';
  if (value < 25) return theme.palette.error.main;
  return theme.palette.primary.main;
};

const useProgressBarStyles = makeStyles((theme) => ({
  barContainer: {
    flexShrink: 0,
  },
  root: {
    height: '16px',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  colorPrimary: {
    backgroundColor: ({ value }) => {
      if (value >= 100) return 'rgba(76,175,80,0.2)';
      if (value < 25) return 'rgba(244,67,54,0.2)';
      return theme.palette.primary.light;
    },
  },
  barColorPrimary: {
    backgroundColor: ({ value }) => getProgressColor(theme, value),
  },
  bar1Determinate: {
    backgroundColor: ({ value }) => getProgressColor(theme, value),
  },
}));

const ProgressBar = ({ value, year }) => {
  const normalizedValue = Number.isFinite(Number(value))
    ? Math.min(100, Math.max(0, Number(value)))
    : 0;
  const progressClasses = useProgressBarStyles({ value: normalizedValue });
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
      <Box width="150px" className={progressClasses.barContainer}>
        <LinearProgress
          id="progress-bar-bar"
          variant="determinate"
          value={normalizedValue}
          classes={{
            root: progressClasses.root,
            colorPrimary: progressClasses.colorPrimary,
            barColorPrimary: progressClasses.barColorPrimary,
            bar1Determinate: progressClasses.bar1Determinate,
          }}
        />
      </Box>
      <Box>
        <Typography
          variant="h6"
          color="textPrimary"
          id="progress-bar-text"
        >
          <strong>
            { value }
            %
          </strong>
          {' '}
          Base Criteria Met
          {year !== '2015'
             && (
               <>
                 {' '}
                 for CY
                 {year}
               </>
             )}
        </Typography>
      </Box>
    </Box>
  );
};

ProgressBar.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  year: PropTypes.string.isRequired,
};

const useStyles = makeStyles({
  ...utilStyles,
  emptyStateTitle: {
    fontWeight: '700 !important',
  },
  boldText: {
    fontWeight: '800 !important',
  },
  centeredWrappedText: {
    textAlign: 'center',
    textWrap: 'wrap',
  },
  preWrapText: {
    whiteSpace: 'pre-wrap',
  },
  redText: {
    color: 'red',
  },
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
    maxWidth: '500px',
  },
  chipContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '4px',
    marginTop: '16px',
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
  missingLists: {
    display: 'flex',
    flexDirection: 'column',
  },
  yearSelector: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '0px 0px 8px 8px',
    backgroundColor: '#eeeeee',
    marginTop: '-8px',
    marginBottom: '16px',
  },
  yearSelectorLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: '16px',
  },
  yearLabel: {
    fontSize: '2rem',
    fontWeight: '900 !important',
    marginBottom: 0,
    whiteSpace: 'nowrap',
  },
  yearRadioGroup: {
    gap: '8px',
  },
  yearOptionLabelActive: {
    fontWeight: '600 !important',
  },
  yearOptionLabel: {
    fontWeight: '400 !important',
  },
  radioRoot: {
    color: '#66926d',
  },
  radioScaled: {
    transform: 'scale(1.5)',
    marginRight: '4px',
  },
  disclaimerContainer: {
    gap: '8px',
  },
});

function ChplCmsDisplay() {
  const $analytics = getAngularService('$analytics');
  const $rootScope = getAngularService('$rootScope');
  const { listings, removeListing } = useContext(CmsContext);
  const { domainIsOn } = useContext(FlagContext);
  const [activeYear, setActiveYear] = useState('');
  const [idAnalysis, setIdAnalysis] = useState({});
  const [isDownloading, setIsDownloading] = useState(false);
  const [reportingYears, setReportingYears] = useState([]);
  const { data, isFetching, isSuccess } = useFetchCmsIdAnalysis(listings);
  const { data: pdfData, isFetching: pdfIsFetching, isSuccess: pdfIsSuccess } = useFetchCmsIdPdf(idAnalysis.ehrCertificationId, isDownloading);
  const { mutate, isLoading } = usePostCreateCmsId();
  const classes = useStyles();

  useEffect(() => {
    if (isFetching || !isSuccess) { return; }
    const stripped = data.map(({ ehrCertificationId: _, ...rest }) => rest);
    setReportingYears(stripped.map((a) => a.year));
    if (activeYear === '') {
      setIdAnalysis(stripped[0]);
      setActiveYear(stripped[0].year);
    } else {
      const nextAnalysis = stripped.find((d) => d.year === activeYear) || stripped[0];
      setIdAnalysis((previous) => {
        const sameContext = previous?.ehrCertificationId
          && previous.year === nextAnalysis.year
          && (previous.products || []).map((p) => p.productId).sort().join(',')
            === (nextAnalysis.products || []).map((p) => p.productId).sort().join(',');
        return sameContext
          ? { ...nextAnalysis, ehrCertificationId: previous.ehrCertificationId }
          : nextAnalysis;
      });
    }
  }, [activeYear, data, isFetching, isSuccess]);

  useEffect(() => {
    if (pdfIsFetching || !pdfIsSuccess) { return; }
    createPdf(pdfData);
    setIsDownloading(false);
  }, [pdfData, pdfIsFetching, pdfIsSuccess]);

  const compareAll = () => {
    $analytics.eventTrack('Compare Listings', { category: 'CMS Widget' });
    $rootScope.$broadcast('compare.compareAll', listings);
    $rootScope.$broadcast('HideCmsWidget');
    $rootScope.$broadcast('ShowCompareWidget');
    $rootScope.$digest();
  };

  const copyToClipboard = () => {
    $analytics.eventTrack('Copy EHR Certification ID to Clipboard', { category: 'CMS Widget' });
    navigator.clipboard.writeText(idAnalysis.ehrCertificationId);
  };

  const createCertId = async () => {
    $analytics.eventTrack('Get EHR Certification ID', { category: 'CMS Widget' });
    await mutate({ idAnalysis }, {
      onSuccess: (response) => {
        setIdAnalysis(response.data);
      },
    });
  };

  const downloadPdf = () => {
    $analytics.eventTrack('Download EHR Certification ID PDF', { category: 'CMS Widget' });
    setIsDownloading(true);
  };

  const handleYearSelection = (e) => {
    setActiveYear(e);
    setIdAnalysis(data.find((d) => d.year === e));
  };

  const removeAll = () => {
    $analytics.eventTrack('Remove all Listings', { category: 'CMS Widget' });
    $rootScope.$broadcast('cms.removeAll');
  };

  if (!listings || listings.length === 0) {
    return (
      <>
        <Typography className={classes.emptyStateTitle} variant="h3" gutterBottom>
          CMS Certification ID Creator
        </Typography>
        <Divider />
        <Typography gutterBottom><strong>No products selected.</strong></Typography>
        <Divider />
        <Typography className={classes.centeredWrappedText} variant="body2" color="textSecondary">
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
      <Typography variant="h2" gutterBottom>
        CMS Certification ID Creator
      </Typography>
      <Divider />
      { idAnalysis.ehrCertificationId
        && (
          <>
            <Typography>
              <strong> Your CMS EHR Certification ID</strong>
            </Typography>
            <div className={classes.certCopyContainer} id="ehr-cert-id">
              <Typography variant="h5" color="primary">
                { idAnalysis.ehrCertificationId }
              </Typography>
              <IconButton
                onClick={copyToClipboard}
                color="primary"
              >
                <FileCopyOutlinedIcon />
              </IconButton>
            </div>
            <Typography gutterBottom className={classes.preWrapText} variant="body2">
              <span className={classes.redText}>*</span>
              {' '}
              Additional certification criteria may need to be added in order to meet submission requirements for Medicaid and Medicare programs.
            </Typography>
            <Divider />
          </>
        )}
      { reportingYears.length > 1
        && (
          <FormControl className={`${classes.yearSelector} ${classes.yearSelectorLayout}`}>
            <FormLabel className={classes.yearLabel}>
              Reporting Year
            </FormLabel>
            <RadioGroup
              row
              onChange={(e) => handleYearSelection(e.currentTarget.value)}
              value={activeYear}
              className={classes.yearRadioGroup}
            >
              { reportingYears
                .map((y) => (
                  <FormControlLabel
                    key={y}
                    value={y}
                    control={<Radio color="primary" size="large" classes={{ root: classes.radioRoot }} className={classes.radioScaled} />}
                    label={(
                      <Typography
                        variant="body1"
                        className={activeYear === y ? classes.yearOptionLabelActive : classes.yearOptionLabel}
                      >
                        {y}
                      </Typography>
                    )}
                  />
                ))}
            </RadioGroup>
          </FormControl>
        )}
      { idAnalysis.products?.length > 0
        && (
          <>
            <Typography className={classes.boldText}>Validation</Typography>
            <ProgressBar
              value={idAnalysis.metPercentages.criteriaMet}
              year={idAnalysis.year}
            />
            { idAnalysis.metPercentages?.criteriaMet < 100
        && (
          <Typography variant="body1" color="textSecondary" className={classes.preWrapText}>
            Note: the selected product
            {listings?.length !== 1 ? 's' : ''}
            {' '}
            must meet 100% of the Base Criteria.
            {' '}
          </Typography>
        )}
          </>
        )}
      { (idAnalysis.missingAnd?.length > 0 || idAnalysis.missingOr?.length > 0)
        && (
          <>
            <div className={classes.missingLists}>
              { idAnalysis.missingAnd?.length > 0
                && (
                  <div>
                    <Typography variant="body2" className={classes.boldText}>Please select a product or products that contain the following criteria:</Typography>
                    <List id="missing-and">
                      { idAnalysis.missingAnd.map((criterion) => <ListItem key={criterion}><Typography variant="body2">{ criterion }</Typography></ListItem>)}
                    </List>
                  </div>
                )}
              { idAnalysis.missingOr?.length > 0
                && (
                  <div>
                    <Typography variant="body2" className={classes.boldText}>
                      { idAnalysis.missingAnd.length > 0 && 'In addition, products' }
                      { idAnalysis.missingAnd.length === 0 && 'Please select a product' }
                      {' '}
                      with at least 1 criteria from the following group
                      { idAnalysis.missingOr.length > 1 && 's' }
                    </Typography>
                    <List id="missing-or">
                      { idAnalysis.missingOr.map((criteria) => <ListItem key={criteria.join(',')}><Typography variant="body2">{ criteria.join(', ') }</Typography></ListItem>)}
                    </List>
                  </div>
                )}
            </div>
          </>
        )}
      <Divider />
      <Typography className={classes.boldText}>Product Selected</Typography>
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
      { (isFetching || isLoading || isDownloading) && <CircularProgress id="cms-id-processing" size={20} /> }
      <Divider />
      <div className={classes.buttonContainer}>
        { !idAnalysis.ehrCertificationId
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
        { idAnalysis.ehrCertificationId
          && (
            <Button
              fullWidth
              color="primary"
              variant="contained"
              id="download-cert-id"
              onClick={downloadPdf}
              endIcon={<CloudDownloadIcon />}
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
            variant="outlined"
            id="remove-listings"
            onClick={removeAll}
            endIcon={<DeleteIcon />}
            className={classes.deleteButtonOutlined}
          >
            Remove All
          </Button>
        </div>
      </div>
      <Box mt={6} mb={2} id="cms-widget-disclaimer" display="flex" flexDirection="column" className={classes.disclaimerContainer} alignItems="center">
        <Typography className={classes.centeredWrappedText} variant="body2" color="textSecondary">
          {' '}
          For assistance, view the
          {' '}
          <ChplLink
            href={`${domainIsOn ? 'https://www.astp.hhs.gov' : 'https://www.healthit.gov'}/sites/default/files/policy/chpl_public_user_guide.pdf`}
            text="CHPL Public User Guide"
            analytics={{ event: 'Open CHPL Public User Guide', category: 'CMS Widget' }}
            external={false}
            inline
          />
          {' '}
          or
          {' '}
          <ChplLink
            href={`${domainIsOn ? 'https://www.astp.hhs.gov' : 'https://www.healthit.gov'}/topic/certification-ehrs/2015-edition-test-method/2015-edition-cures-update-base-electronic-health-record-definition`}
            text="Base Criteria"
            analytics={{ event: 'Open Base Criteria', category: 'CMS Widget' }}
            external={false}
            inline
          />
          .
        </Typography>
        <Typography className={classes.centeredWrappedText} variant="body2" color="textSecondary">
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
      </Box>
    </CardContent>

  );
}

export default ChplCmsDisplay;
