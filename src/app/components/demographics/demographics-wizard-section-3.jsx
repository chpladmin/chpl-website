import React, { useContext } from 'react';
import {
  Box, Card, CardContent, Container, Typography,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarsIcon from '@mui/icons-material/Stars';

import { DeveloperContext } from 'shared/contexts';
import { palette, utilStyles } from 'themes';

const styles = {
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
    left: '6px',
    transform: 'rotate(-15deg)',
  },
  sparkleTopRight: {
    top: '40px',
    right: '-8px',
    transform: 'rotate(20deg)',
  },
  sparkleBottom: {
    bottom: '-5px',
    right: '47px',
    transform: 'rotate(4deg)',
  },
  congratulationsText: {
    textAlign: 'center',
    color: palette.primaryDark,
    fontWeight: 600,
  },
};

function ChplDemographicsWizardSection3() {
  const { developer } = useContext(DeveloperContext);

  return (
    <Container sx={styles.fixFooterSpacing} maxWidth="md">
      <Typography gutterBottom variant="h2" sx={styles.fullWidthGridRow}>
        Section 3 &mdash; Confirmation
      </Typography>
      <Card>
        <CardContent sx={styles.cardContent}>
          <Box sx={styles.confirmationGraphic} aria-hidden>
            <StarsIcon sx={{ ...styles.sparkleBase, ...styles.sparkleTopLeft }} />
            <StarsIcon sx={{ ...styles.sparkleBase, ...styles.sparkleTopRight }} />
            <StarsIcon sx={{ ...styles.sparkleBase, ...styles.sparkleBottom }} />
            <Box sx={styles.confirmationGraphicCore}>
              <CheckCircleIcon sx={styles.confirmationGraphicIcon} />
            </Box>
          </Box>
          <Typography variant="body1" align="center">
            Thank you for submitting a change to your demographics information. An email confirmation has been sent to the registered CHPL users associated with
            {' '}
            {developer.name}
            . Please direct any inquiries regarding your submission to your ONC-Authorized Certification Body.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}

export default ChplDemographicsWizardSection3;

ChplDemographicsWizardSection3.propTypes = {
};
