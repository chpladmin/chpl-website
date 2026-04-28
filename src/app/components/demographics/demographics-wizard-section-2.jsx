import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Checkbox,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import WarningIcon from '@material-ui/icons/Warning';
import { array, func, object } from 'prop-types';

import { palette } from 'themes';

const useStyles = makeStyles({
  fixFooterSpacing: {
    minHeight: 'calc(100vh - 450px)',
  },
  nonCaps: {
    textTransform: 'none',
  },
  questionParagraph: {
    marginBottom: '8px',
  },
  radioGroup: {
    textTransform: 'none',
  },
  warningBox: {
    padding: '16px',
    backgroundColor: '#fdfde7',
    border: '1px solid #afafaf',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'row',
    marginTop: '4px',
    marginBottom: '16px',
    gridGap: '16px',
    alignItems: 'center',
  },
  emptyStateContainer: {
    display: 'grid',
    rowGap: '12px',
    justifyItems: 'center',
    padding: '8px 0',
  },
  emptyStateGraphic: {
    position: 'relative',
    width: '124px',
    height: '124px',
    borderRadius: '50%',
    margin: '0 auto',
    background: `linear-gradient(145deg, ${palette.warningLight}, ${palette.white})`,
    boxShadow: '0 8px 18px rgb(156 159 12 / 22%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateGraphicCore: {
    width: '86px',
    height: '86px',
    borderRadius: '50%',
    backgroundColor: palette.white,
    border: `2px solid ${palette.warning}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateGraphicIcon: {
    color: palette.warning,
    fontSize: '46px',
  },
  alertBase: {
    position: 'absolute',
    color: palette.warningDark,
    fontSize: '18px',
  },
  alertTopLeft: {
    top: '6px',
    left: '10px',
    transform: 'rotate(-15deg)',
  },
  alertTopRight: {
    top: '40px',
    right: '-8px',
    transform: 'rotate(20deg)',
  },
  alertBottom: {
    bottom: '-5px',
    right: '47px',
    transform: 'rotate(4deg)',
  },
  emptyStateMessage: {
    textAlign: 'center',
    maxWidth: '520px',
  },
});

function ChplDemographicsWizardSection2({ dispatch }) {
  const classes = useStyles();

  const toggle = (listing) => {
    dispatch(listing.id);
  };

  return (
    <Container className={classes.fixFooterSpacing} maxWidth="md">
      <Box className={classes.demographicsSectionContainer}> { /* no class  */ }
        <Typography gutterBottom component="h2" variant="h3">
          Section 2 &mdash; Listings
        </Typography>
      </Box>
    </Container>
  );
}

export default ChplDemographicsWizardSection2;

ChplDemographicsWizardSection2.propTypes = {
  dispatch: func.isRequired,
};
