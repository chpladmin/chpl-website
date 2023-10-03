import React, { useContext, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  List,
  ListItem,
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

import ChplListingInformationEdit from './details/listing-information/listing-information-edit';

import { usePutListing } from 'api/listing';
import { ChplActionBar } from 'components/action-bar';
import ChplAdditionalInformation from 'components/listing/details/additional-information/additional-information';
import { ChplTextField, InternalScrollButton } from 'components/util';
import { getAngularService } from 'services/angular-react-helper';
import { ListingContext, UserContext } from 'shared/contexts';
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
    padding: '8px',
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
});

const validationSchema = yup.object({
  reason: yup.string(),
});

function ChplListingEdit() {
  const $state = getAngularService('$state');
  const { hasAnyRole } = useContext(UserContext);
  const { listing } = useContext(ListingContext);
  const { enqueueSnackbar } = useSnackbar();
  const [acknowledgeWarnings, setAcknowledgeWarnings] = useState(false);
  const [acknowledgeBusinessErrors, setAcknowledgeBusinessErrors] = useState(false);
  const [errors, setErrors] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [seeAllCqms, setSeeAllCqms] = useState(false);
  const [seeAllCriteria, setSeeAllCriteria] = useState(false);
  const [showErrorAcknowledgement, setShowErrorAcknowledgement] = useState(false);
  const [showWarningAcknowledgement, setShowWarningAcknowledgement] = useState(false);
  const putListing = usePutListing();
  const classes = useStyles();
  let formik;

  const save = () => {
    const payload = {
      listing,
      reason: formik.values.reason,
      acknowledgeWarnings,
      acknowledgeBusinessErrors,
    };
    console.log('saving', payload);
    /*
    putListing.mutate(payload, {
      onSuccess: () => {
        enqueueSnackbar('Listing Updated', {
          variant: 'success',
        });
        $state.go('listing');
      },
      onError: (error) => {
        setErrors(error.response.data.errorMessages);
      },
    });
    */
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
        setAcknowledgeErrors((prev) => !prev);
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
          <Box>
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
            If changes are made in any of the following ways, a Reason for Change is required:
            <List>
              <ListItem>Clinical Quality Measure Removed</ListItem>
              <ListItem>Certification Criteria Removed</ListItem>
              <ListItem>Editing of a 2011 Edition Certified Product</ListItem>
              <ListItem>Editing of a 2014 Edition Certified Product</ListItem>
              <ListItem>Certification Status Changed from anything to "Active"</ListItem>
            </List>
          </Box>
        </div>
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
        errors={errors}
        warnings={warnings}
        showErrorAcknowledgement={showErrorAcknowledgement}
        showWarningAcknowledgement={showWarningAcknowledgement}
      />
    </>
  );
}

export default ChplListingEdit;

ChplListingEdit.propTypes = {
};
