import React, { useContext, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  FormControlLabel,
  List,
  ListItem,
  Switch,
  Typography,
  makeStyles,
} from '@material-ui/core';
import AssessmentOutlinedIcon from '@material-ui/icons/AssessmentOutlined';
import BookOutlinedIcon from '@material-ui/icons/BookOutlined';
import DoneAllOutlinedIcon from '@material-ui/icons/DoneAllOutlined';
import NotesOutlinedIcon from '@material-ui/icons/NotesOutlined';
import TouchAppOutlinedIcon from '@material-ui/icons/TouchAppOutlined';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { useSnackbar } from 'notistack';
import { useFormik } from 'formik';
import * as yup from 'yup';

import ChplCqmsEdit from './details/cqms/cqms-edit';
import ChplG1G2sEdit from './details/g1g2/g1g2s-edit';
import ChplListingInformationEdit from './details/listing-information/listing-information-edit';
import ChplSedEdit from './details/sed/edit/edit';

import { usePutListing } from 'api/listing';
import { ChplActionBar } from 'components/action-bar';
import ChplAdditionalInformation from 'components/listing/details/additional-information/additional-information';
import { ChplTextField, InternalScrollButton } from 'components/util';
import { getAngularService } from 'services/angular-react-helper';
import { ListingContext } from 'shared/contexts';
import { palette, theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  navigation: {
    backgroundColor: palette.white,
    display: 'flex',
    flexDirection: 'row',
    position: 'sticky',
    top: '0',
    zIndex: '1299',
    gap: '16px',
    borderRadius: '4px',
    overflowX: 'scroll',
    boxShadow: 'rgb(149 157 165 / 50%) 0px 4px 16px',
    border: `.5px solid ${palette.divider}`,
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      overflowX: 'hidden',
      position: 'initial',
      flexDirection: 'column',
      zIndex: '0',
    },
  },
  menuContainer: {
    display: 'flex',
    flexDirection: 'row',
    overflowX: 'visible',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      flexDirection: 'column',
    },
  },
  menuItems: {
    display: 'flex',
    padding: 0,
    justifyContent: 'space-between',
    '&.Mui-disabled': {
      color: palette.black,
      backgroundColor: palette.background,
      fontWeight: 600,
    },
  },
  content: {
    display: 'grid',
    flexDirection: 'column',
    gridTemplateColumns: '1fr',
    gridGap: '16px',
  },
  sectionHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    padding: '16px',
    backgroundColor: palette.secondary,
    borderBottom: `.5px solid ${palette.divider}`,
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  },
  sectionHeaderText: {
    fontSize: '1.5em !important',
    fontWeight: '600 !important',
  },
  leftSideContent: {
    display: 'flex',
    flexDirection: 'column',
    position: 'sticky',
    top: '0',
    gap: '16px',
    zIndex: 300,
    [theme.breakpoints.up('md')]: {
      top: '104px',
    },
  },
  reason: {
    paddingTop: '8px',
  },
  reasonCard: {
    [theme.breakpoints.down('sm')]: {
      // Styles for mobile design
      position: 'fixed',
      bottom: '64px',
      left: 0,
      width: '100%',
      boxShadow: '0 -4px 8px rgb(149 157 165 / 30%)',
    },
    [theme.breakpoints.up('md')]: {
      // Styles for desktop design
      position: 'relative',
    },
  },
});

const validationSchema = yup.object({
  reason: yup.string(),
});

function ChplListingEdit() {
  const $state = getAngularService('$state');
  const { listing } = useContext(ListingContext);
  const { enqueueSnackbar } = useSnackbar();
  const [acknowledgeWarnings, setAcknowledgeWarnings] = useState(false);
  const [acknowledgeBusinessErrors, setAcknowledgeBusinessErrors] = useState(false);
  const [messages, setMessages] = useState({
    businessErrors: new Set(),
    dataErrors: new Set(),
    warnings: new Set(),
  });
  const [seeAllCqms, setSeeAllCqms] = useState(true);
  const putListing = usePutListing();
  const classes = useStyles();
  let formik;

  const getErrors = () => [...messages.businessErrors].concat([...messages.dataErrors]);

  const getWarnings = () => [...messages.warnings];

  const save = () => {
    const payload = {
      listing,
      reason: formik.values.reason,
      acknowledgeWarnings,
      acknowledgeBusinessErrors,
    };
    putListing.mutate(payload, {
      onSuccess: (response) => {
        enqueueSnackbar('Listing Updated', {
          variant: 'success',
        });
        if (response.headers['chpl-id-changed']) {
          enqueueSnackbar('Your activity caused a CHPL Product Number to change', {
            variant: 'success',
          });
        }
        setTimeout(() => $state.go('listing'), 5000);
      },
      onError: (error) => {
        setMessages({
          businessErrors: new Set(error.response.data.businessErrorMessages ?? []),
          dataErrors: new Set(error.response.data.dataErrorMessages ?? []),
          warnings: new Set(error.response.data.warningMessages ?? []),
        });
      },
    });
  };

  const handleDispatch = (action) => {
    switch (action) {
      case 'cancel':
        $state.go('listing');
        break;
      case 'save':
        save();
        break;
      case 'toggleWarningAcknowledgement':
        setAcknowledgeWarnings((prev) => !prev);
        break;
      case 'toggleErrorAcknowledgement':
        setAcknowledgeBusinessErrors((prev) => !prev);
        break;
        // no default
    }
  };

  formik = useFormik({
    initialValues: {
      reason: '',
    },
    validationSchema,
  });

  if (!listing) { return null; }

  return (
    <>
      <div className={classes.leftSideContent}>
        <div className={classes.navigation}>
          <Box className={classes.menuContainer}>
            <Box
              className={classes.menuItems}
            >
              <InternalScrollButton
                id="listingInformation"
                analytics={{ event: 'Jump to Listing Section', category: 'Navigation', label: 'Listing Information' }}
              >
                Listing Information
                <NotesOutlinedIcon className={classes.iconSpacing} />
              </InternalScrollButton>
            </Box>
            <Box
              className={classes.menuItems}
            >
              <InternalScrollButton
                id="certificationCriteria"
                analytics={{ event: 'Jump to Listing Section', category: 'Navigation', label: 'Certification Criteria' }}
              >
                Certification Criteria
                <BookOutlinedIcon className={classes.iconSpacing} />
              </InternalScrollButton>
            </Box>
            <Box
              className={classes.menuItems}
            >
              <InternalScrollButton
                id="clinicalQualityMeasures"
                analytics={{ event: 'Jump to Listing Section', category: 'Navigation', label: 'Clinical Quality Measures' }}
              >
                Clinical Quality Measures
                <DoneAllOutlinedIcon className={classes.iconSpacing} />
              </InternalScrollButton>
            </Box>
            { (listing.edition === null || listing.edition.name !== '2011')
              && (
                <Box
                  className={classes.menuItems}
                >
                  <InternalScrollButton
                    id="sed"
                    analytics={{ event: 'Jump to Listing Section', category: 'Navigation', label: 'Safety Enhanced Design' }}
                  >
                    Safety Enhanced Design (SED)
                    <TouchAppOutlinedIcon className={classes.iconSpacing} />
                  </InternalScrollButton>
                </Box>
              )}
            { (listing.edition === null || listing.edition.name === '2015')
              && (
                <Box
                  className={classes.menuItems}
                >
                  <InternalScrollButton
                    id="g1g2Measures"
                    analytics={{ event: 'Jump to Listing Section', category: 'Navigation', label: 'G1/G2 Measures' }}
                  >
                    G1/G2 Measures
                    <AssessmentOutlinedIcon className={classes.iconSpacing} />
                  </InternalScrollButton>
                </Box>
              )}
            <Box
              className={classes.menuItems}
            >
              <InternalScrollButton
                id="additional"
                analytics={{ event: 'Jump to Listing Section', category: 'Navigation', label: 'Additional Information' }}
              >
                Additional Information
                <InfoOutlinedIcon className={classes.iconSpacing} />
              </InternalScrollButton>
            </Box>
          </Box>
        </div>
        <Card className={classes.reasonCard}>
          <CardContent>
            <ChplTextField
              id="reason"
              name="reason"
              label="Reason"
              value={formik.values.reason}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.productCode && !!formik.errors.productCode}
              helperText={formik.touched.productCode && formik.errors.productCode}
            />
            <Typography className={classes.reason} variant="body2" gutterBottom><strong>If changes are made in any of the following ways, a Reason for Change is required:</strong></Typography>
            <List dense>
              <ListItem>Clinical Quality Measure Removed</ListItem>
              <ListItem>Certification Criteria Removed</ListItem>
              <ListItem>Editing of a non-active Certified Product</ListItem>
              <ListItem>Certification Status Changed from anything to &quot;Active&quot;</ListItem>
            </List>
          </CardContent>
        </Card>
      </div>
      <div className={classes.content}>
        <Card>
          <span className="anchor-element">
            <span id="listingInformation" className="page-anchor" />
          </span>
          <Box className={classes.sectionHeader}>
            <Typography className={classes.sectionHeaderText} variant="h2">Listing Information</Typography>
          </Box>
          <CardContent>
            <ChplListingInformationEdit />
          </CardContent>
        </Card>
        <Card>
          <span className="anchor-element">
            <span id="clinicalQualityMeasures" className="page-anchor" />
          </span>
          <Box className={classes.sectionHeader}>
            <Typography className={classes.sectionHeaderText} variant="h2">Clinical Quality Measures</Typography>
            <div>
              <FormControlLabel
                control={(
                  <Switch
                    id="see-all-cqms"
                    name="seeAllCqms"
                    color="primary"
                    checked={seeAllCqms}
                    onChange={() => setSeeAllCqms(!seeAllCqms)}
                  />
                )}
                label="See all CQMs"
              />
              (
              {listing.cqmResults.filter((cqm) => (cqm.success || cqm.successVersions?.length > 0)).length}
              {' '}
              found)
            </div>
          </Box>
          <CardContent>
            <ChplCqmsEdit
              viewAll={seeAllCqms}
            />
          </CardContent>
        </Card>
        { (listing.edition === null || listing.edition.name !== '2011')
          && (
            <Card>
              <span className="anchor-element">
                <span id="sed" className="page-anchor" />
              </span>
              <Box className={classes.sectionHeader}>
                <Typography className={classes.sectionHeaderText} variant="h2">Safety Enhanced Design (SED)</Typography>
              </Box>
              <CardContent>
                <ChplSedEdit />
              </CardContent>
            </Card>
          )}
        { (listing.edition === null || listing.edition.name === '2015')
          && (
            <Card>
              <span className="anchor-element">
                <span id="g1g2Measures" className="page-anchor" />
              </span>
              <Box className={classes.sectionHeader}>
                <Typography className={classes.sectionHeaderText} variant="h2">G1/G2 Measures</Typography>
              </Box>
              <CardContent>
                <ChplG1G2sEdit />
              </CardContent>
            </Card>
          )}
        <Card>
          <span className="anchor-element">
            <span id="additional" className="page-anchor" />
          </span>
          <Box className={classes.sectionHeader}>
            <Typography className={classes.sectionHeaderText} variant="h2">Additional Information</Typography>
          </Box>
          <CardContent>
            <ChplAdditionalInformation
              listing={listing}
            />
          </CardContent>
        </Card>
      </div>
      <ChplActionBar
        dispatch={handleDispatch}
        errors={getErrors()}
        warnings={getWarnings()}
        showErrorAcknowledgement={messages.businessErrors.size > 0 && messages.dataErrors.size === 0}
        showWarningAcknowledgement={messages.warnings.size > 0}
      />
    </>
  );
}

export default ChplListingEdit;

ChplListingEdit.propTypes = {
};
