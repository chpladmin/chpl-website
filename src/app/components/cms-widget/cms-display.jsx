import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Typography,
  makeStyles,
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import CloseIcon from '@material-ui/icons/Close';
import CloudDownloadOutlinedIcon from '@material-ui/icons/CloudDownloadOutlined';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import DeleteIcon from '@material-ui/icons/Delete';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import { func, objectOf, string } from 'prop-types';

import ChplCmsDisplayProgressBar from './cms-display-progress-bar';
import createPdf from './cms-pdf';

import { useFetchCmsIdAnalysis, useFetchCmsIdPdf, usePostCreateCmsId } from 'api/cms';
import { ChplEllipsis, ChplLink } from 'components/util';
import { eventTrack } from 'services/analytics.service';
import { CmsContext, CompareContext, FlagContext } from 'shared/contexts';
import { palette, utilStyles } from 'themes';

function ChplCmsEmptyStateIcon() {
  return (
    <svg width="72" height="72" viewBox="0 0 64 64" fill="none" aria-hidden="true" focusable="false">
      <circle cx="32" cy="32" r="30" fill={palette.secondary} />
      <rect x="18" y="14" width="28" height="36" rx="4" fill={palette.white} stroke={palette.primary} strokeWidth="2" />
      <line x1="24" y1="24" x2="40" y2="24" stroke={palette.grey} strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="30" x2="40" y2="30" stroke={palette.grey} strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="36" x2="34" y2="36" stroke={palette.grey} strokeWidth="2" strokeLinecap="round" />
      <circle cx="40" cy="42" r="9" fill={palette.primary} />
      <path d="M36 42l3 3 6-6" stroke={palette.white} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function ChplCmsWidgetHelpFooter({ classes }) {
  return (
    <div className={classes.widgetHelpFooter}>
      <Typography variant="body2" color="textPrimary">
        For assistance, view the
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
          href="https://www.healthit.gov/topic/certification-ehrs/2015-edition-test-method/2015-edition-cures-update-base-electronic-health-record-definition"
          text="Base Criteria"
          analytics={{ event: 'Open Base Criteria', category: 'CMS Widget' }}
          external={false}
          inline
        />
        .
      </Typography>
      <Typography variant="caption" color="textPrimary">
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
    </div>
  );
}

ChplCmsWidgetHelpFooter.propTypes = {
  classes: objectOf(string).isRequired,
};

const useStyles = makeStyles({
  ...utilStyles,
  stickyWidgetHeader: {
    position: 'sticky',
    top: '24px',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    backgroundColor: palette.white,
    marginLeft: '-8px',
    marginRight: '-8px',
    marginBottom: '16px',
    padding: '4px 4px 4px 8px',
    borderBottom: `1px solid ${palette.divider}`,
  },
  sectionLabelFontWeight800: {
    fontWeight: '800 !important',
  },
  centeredWrappedBodyText: {
    textAlign: 'center',
    textWrap: 'wrap',
  },
  preserveWhitespacePreWrapText: {
    whiteSpace: 'pre-wrap',
  },
  errorAsteriskTextColor: {
    color: palette.error,
  },
  buttonContainer: {
    marginTop: '8px',
    gap: '6px',
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
    position: 'relative',
  },
  mainCardContent: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
  },
  widgetHelpFooter: {
    marginTop: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '4px',
    paddingTop: '8px',
  },
  emptyStateBody: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    gap: '8px',
    padding: '16px 8px',
  },
  loadingOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '100%',
    height: '40px',
    width: '40px',
    border: `1px solid ${palette.white}`,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.24)',
    pointerEvents: 'none',
    zIndex: 1,
  },
  chipContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '4px',
    marginTop: '8px',
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
  userNote: {
    backgroundColor: palette.secondary,
    border: `1px solid ${palette.primary}`,
    padding: '4px',
    borderRadius: '8px',
    marginTop: '4px',
    marginBottom: '4px',
  },
  yearSelector: {
    width: '100%',
    padding: '8px 16px',
    borderRadius: '0px 0px 8px 8px',
    backgroundColor: palette.greyLight,
    marginTop: '-8px',
    marginBottom: '8px',
  },
  yearSelectorLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: '16px',
  },
  yearLabel: {
    fontWeight: '900 !important',
    marginBottom: 0,
    whiteSpace: 'nowrap',
  },
  yearRadioGroup: {
    gap: '8px',
  },
  reportingYearOptionFontWeight600WhenActive: {
    fontWeight: '600 !important',
  },
  reportingYearOptionFontWeight400WhenInactive: {
    fontWeight: '400 !important',
  },
  reportingYearRadioUsesActivePaletteColor: {
    color: palette.active,
  },
  reportingYearRadioScale150WithRightSpacing: {
    transform: 'scale(1.5)',
    marginRight: '4px',
  },
});

function ChplCmsDisplay({ onClose }) {
  const { listings, removeListing, setIsOpen } = useContext(CmsContext);
  const {
    listings: compareListings,
    addListing: addCompareListing,
    removeListing: removeCompareListing,
    setIsOpen: setCompareIsOpen,
  } = useContext(CompareContext);
  const { cmsDisabledIsOn } = useContext(FlagContext);
  const [activeYear, setActiveYear] = useState('');
  const [idAnalysis, setIdAnalysis] = useState({});
  const [isDownloading, setIsDownloading] = useState(false);
  const [reportingYears, setReportingYears] = useState([]);
  const {
    data,
    isFetching,
    isLoading: isLoadingAnalysis,
    isSuccess,
  } = useFetchCmsIdAnalysis(listings);
  const { data: pdfData, isFetching: pdfIsFetching, isSuccess: pdfIsSuccess } = useFetchCmsIdPdf(idAnalysis.ehrCertificationId, isDownloading);
  const { mutate, isLoading: isCreatingCmsId } = usePostCreateCmsId();
  const classes = useStyles({ progressValue: idAnalysis?.metPercentages?.criteriaMet });

  useEffect(() => {
    if (isFetching || !isSuccess) { return; }
    setReportingYears(data.map((a) => a.year));
    if (activeYear === '') {
      setIdAnalysis(data[0]);
      setActiveYear(data[0].year);
    } else {
      setIdAnalysis(data.find((d) => d.year === activeYear));
    }
  }, [data, isFetching, isSuccess]);

  useEffect(() => {
    if (pdfIsFetching || !pdfIsSuccess) { return; }
    createPdf(pdfData);
    setIsDownloading(false);
  }, [pdfData, pdfIsFetching, pdfIsSuccess]);

  const compareAll = () => {
    eventTrack({
      event: 'Compare Listings',
      category: 'CMS Widget',
    });
    compareListings.forEach((l) => removeCompareListing(l));
    listings.forEach((l) => addCompareListing(l));
    setIsOpen(false);
    setCompareIsOpen(true);
  };

  const copyToClipboard = () => {
    eventTrack({
      event: 'Copy EHR Certification ID to Clipboard',
      category: 'CMS Widget',
    });
    navigator.clipboard.writeText(idAnalysis.ehrCertificationId);
  };

  const createCertId = async () => {
    eventTrack({
      event: 'Get EHR Certification ID',
      category: 'CMS Widget',
    });
    await mutate({ idAnalysis }, {
      onSuccess: (response) => {
        setIdAnalysis(response.data);
      },
    });
  };

  const downloadPdf = () => {
    eventTrack({
      event: 'Download EHR Certification ID PDF',
      category: 'CMS Widget',
    });
    setIsDownloading(true);
  };

  const handleYearSelection = (e) => {
    setActiveYear(e);
    setIdAnalysis(data.find((d) => d.year === e));
  };

  const removeAll = () => {
    eventTrack({
      event: 'Remove all Listings',
      category: 'CMS Widget',
    });
    listings.forEach((l) => removeListing(l));
  };

  if (cmsDisabledIsOn) {
    return (
      <CardContent className={`${classes.cardcontentPadding} ${classes.mainCardContent}`}>
        <div className={classes.stickyWidgetHeader}>
          <Typography variant="h2">
            CMS Certification ID Creator
          </Typography>
          <IconButton aria-label="Close widget" onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </div>
        <Typography>
          Access to the CMS ID Creator has been paused. Please check back periodically for updates.
        </Typography>
        <ChplCmsWidgetHelpFooter classes={classes} />
      </CardContent>
    );
  }

  if (!listings || listings.length === 0) {
    return (
      <CardContent className={`${classes.cardcontentPadding} ${classes.mainCardContent}`}>
        <div className={classes.stickyWidgetHeader}>
          <Typography variant="h2">
            CMS Certification ID Creator
          </Typography>
          <IconButton aria-label="Close widget" onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </div>
        <div className={classes.emptyStateBody}>
          <ChplCmsEmptyStateIcon />
          <Typography variant="h6"><strong>No products selected.</strong></Typography>
          <Box className={classes.userNote}>
            <Typography variant="body2" color="textSecondary">
              Note: the selected products must meet 100% of the Base Criteria.
            </Typography>
          </Box>
        </div>
        <ChplCmsWidgetHelpFooter classes={classes} />
      </CardContent>
    );
  }

  return (
    <CardContent className={`${classes.cardcontentPadding} ${classes.mainCardContent}`}>
      <div className={classes.stickyWidgetHeader}>
        <Typography variant="h2">
          CMS Certification ID Creator
        </Typography>
        <IconButton aria-label="Close widget" onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </div>
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
                size="small"
              >
                <FileCopyOutlinedIcon />
              </IconButton>
            </div>
            <Typography gutterBottom className={classes.preserveWhitespacePreWrapText} variant="body2">
              <span className={classes.errorAsteriskTextColor}>*</span>
              {' '}
              Additional certification criteria may need to be added in order to meet submission requirements for Medicaid and Medicare programs.
            </Typography>
            <Divider />
          </>
        )}
      { isLoadingAnalysis
        && (
          <FormControl className={`${classes.yearSelector} ${classes.yearSelectorLayout}`}>
            <Skeleton variant="text" width="100%" height={32} />
          </FormControl>
        )}
      { !isLoadingAnalysis && reportingYears.length > 1
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
                    control={<Radio color="primary" classes={{ root: classes.reportingYearRadioUsesActivePaletteColor }} className={classes.reportingYearRadioScale150WithRightSpacing} />}
                    label={(
                      <Typography
                        variant="body1"
                        className={activeYear === y ? classes.reportingYearOptionFontWeight600WhenActive : classes.reportingYearOptionFontWeight400WhenInactive}
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
          <Box style={{ marginTop: '8px'}}>
            <Typography className={classes.sectionLabelFontWeight800}>Validation</Typography>
          </Box>
            <ChplCmsDisplayProgressBar
              value={idAnalysis.metPercentages?.criteriaMet}
              year={idAnalysis.year}
            />
            { idAnalysis.metPercentages?.criteriaMet < 100
              && (
              <Box className={classes.userNote}>
                <Typography variant="body2" >
                  Note: the selected product
                  {listings?.length !== 1 ? 's' : ''}
                  {' '}
                  must meet 100% of the Base Criteria for the specified year.
                </Typography>
              </Box>
              )}
          </>
        )}
      { (idAnalysis.missingAnd?.length > 0 || idAnalysis.missingOr?.length > 0 || idAnalysis.missingUpToDate?.length > 0)
        && (
          <>
            <div className={classes.missingLists}>
              { idAnalysis.missingAnd?.length > 0
                && (
                  <div>
                    <Typography variant="body2" className={classes.sectionLabelFontWeight800}>Please select a product or products that contain the following criteria:</Typography>
                    <List id="missing-and">
                      { idAnalysis.missingAnd.map((criterion) => <ListItem key={criterion}><Typography variant="body2">{ criterion }</Typography></ListItem>)}
                    </List>
                  </div>
                )}
              { idAnalysis.missingOr?.length > 0
                && (
                  <div>
                    <Typography variant="body2" className={classes.sectionLabelFontWeight800}>
                      { idAnalysis.missingAnd.length > 0 && 'In addition, products' }
                      { idAnalysis.missingAnd.length === 0 && 'Please select a product' }
                      {' '}
                      with at least 1 criteria from the following group
                      { idAnalysis.missingOr.length > 1 && 's' }
                      :
                    </Typography>
                    <List id="missing-or">
                      { idAnalysis.missingOr.map((criteria) => <ListItem key={criteria.join(',')}><Typography variant="body2">{ criteria.join(', ') }</Typography></ListItem>)}
                    </List>
                  </div>
                )}
              { idAnalysis.missingUpToDate?.length > 0
                && (
                  <div>
                    <Typography variant="body2" className={classes.sectionLabelFontWeight800}>
                      { (idAnalysis.missingAnd.length > 0 || idAnalysis.missingOr.length > 0) && 'In addition, a product or products' }
                      { idAnalysis.missingAnd.length === 0 && idAnalysis.missingOr.length === 0 && 'Please select a product or products' }
                      {' '}
                      that contain the following up to date criteria:
                    </Typography>
                    <List id="missing-up-to-date">
                      { idAnalysis.missingUpToDate.map((criterion) => <ListItem key={criterion}><Typography variant="body2">{ criterion }</Typography></ListItem>)}
                    </List>
                  </div>
                )}
            </div>
          </>
        )}
      <Divider />
      <Typography className={classes.sectionLabelFontWeight800}>Product Selected</Typography>
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
      { (isFetching || isCreatingCmsId || isDownloading)
        && (
          <div className={classes.loadingOverlay}>
            <CircularProgress id="cms-id-processing" size={40} />
          </div>
        )}
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
              endIcon={<CloudDownloadOutlinedIcon />}
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
      <ChplCmsWidgetHelpFooter classes={classes} />
    </CardContent>
  );
}

export default ChplCmsDisplay;

ChplCmsDisplay.propTypes = {
  onClose: func.isRequired,
};
