import React, { useContext } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import StarsIcon from '@material-ui/icons/Stars';

import { DeveloperContext } from 'shared/contexts';
import { palette, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  fixFooterSpacing: {
    minHeight: 'calc(100vh - 400px)',
  },
  cardContent: {
    display: 'grid',
    rowGap: '16px',
    padding: '24px',
  },
  confirmationGraphic: {
    position: 'relative',
    width: '124px',
    height: '124px',
    borderRadius: '50%',
    margin: '0 auto',
    background: `linear-gradient(145deg, ${palette.secondary}, ${palette.primaryLight})`,
    border: `1px solid ${palette.secondaryDark}`,
    boxShadow: '0 8px 18px rgb(21 109 172 / 18%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmationGraphicCore: {
    width: '86px',
    height: '86px',
    borderRadius: '50%',
    backgroundColor: palette.white,
    border: `2px solid ${palette.primaryLight}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmationGraphicIcon: {
    color: palette.primary,
    fontSize: '46px',
  },
  sparkleBase: {
    position: 'absolute',
    color: palette.active,
    fontSize: '18px',
  },
  sparkleTopLeft: {
    top: '10px',
    left: '10px',
    transform: 'rotate(-15deg)',
  },
  sparkleTopRight: {
    top: '14px',
    right: '12px',
    transform: 'rotate(20deg)',
  },
  sparkleBottom: {
    bottom: '8px',
    right: '20px',
    transform: 'rotate(-10deg)',
  },
  congratulationsText: {
    textAlign: 'center',
    color: palette.primaryDark,
    fontWeight: 600,
  },
});

function ChplSbulWizardSection4() {
  const { developer } = useContext(DeveloperContext);
  const classes = useStyles();

  return (
    <Container className={classes.fixFooterSpacing} maxWidth="md">
      <Typography gutterBottom variant="h2" className={classes.fullWidthGridRow}>
        Section 4 &mdash; Confirmation
      </Typography>
      <Card>
        <CardContent className={classes.cardContent}>
          <Box className={classes.confirmationGraphic} aria-hidden>
            <StarsIcon className={`${classes.sparkleBase} ${classes.sparkleTopLeft}`} />
            <StarsIcon className={`${classes.sparkleBase} ${classes.sparkleTopRight}`} />
            <StarsIcon className={`${classes.sparkleBase} ${classes.sparkleBottom}`} />
            <Box className={classes.confirmationGraphicCore}>
              <CheckCircleIcon className={classes.confirmationGraphicIcon} />
            </Box>
          </Box>
          <Typography variant="body1" align="center">
            Thank you for submitting a change to your listing(s)’s Service Base URL List URL. An email confirmation has been sent to the registered CHPL users associated with
            {' '}
            {developer.name}
            . Please direct any inquiries regarding your submission to your ONC-Authorized Certification Body (ONC-ACB).
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}

export default ChplSbulWizardSection4;

ChplSbulWizardSection4.propTypes = {
};
