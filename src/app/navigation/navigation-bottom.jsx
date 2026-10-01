import React from 'react';
import { Box, Container, Typography } from '@mui/material';

import WhiteHouseLogo from '../../assets/images/US-WhiteHouse-Logo.svg.png';
import HHSLogo from '../../assets/images/HHS-White_HiRes.png';
import USAGovLogo from '../../assets/images/USAgov_logo_2.png';
import USAGovEspLogo from '../../assets/images/Logo_USAGov_Spanish.png';

import { palette, theme } from 'themes';

const styles = {
  footer: {
    position: 'sticky',
    flexShrink: 0,
    width: '100%',
    backgroundColor: `${palette.navBackground} !important`,
    padding: '4px 32px',
    borderTop: `1px solid ${palette.navDivider}`,
    zIndex: 999,
    left: 0,
    right: 0,
    bottom: 0,
    top: 'auto',
    [theme.breakpoints.down('md')]: {
      position: 'relative',
      marginTop: 0,
    },
  },
  footerContentContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '4px',
    gap: '8px',
    alignItems: 'center',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: '4px',
      justifyContent: 'space-between',
    },
  },
  footerText: {
    color: palette.white,
    '&:hover': {
      color: palette.white,
    },
  },
};
function ChplNavigationBottom() {
  return (
    <Box sx={styles.footer}>
      <Container maxWidth="lg" disableGutters>
        <Box sx={styles.footerContentContainer}>
          <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'center', md: 'baseline' }} gap="4px">
            <Typography sx={styles.footerText} variant="body1">Helpful Links</Typography>
            <Box color={palette.white} display="flex" gap="2px">
              <Box component="a" sx={styles.footerText} href="#/search">Home</Box>
              {' | '}
              <Box component="a" sx={styles.footerText} href="http://www.hhs.gov/privacy.html">Privacy Policy</Box>
              {' | '}
              <Box component="a" sx={styles.footerText} href="http://www.hhs.gov/disclaimer.html">Disclaimer</Box>
              {' | '}
              <Box component="a" sx={styles.footerText} href="http://www.hhs.gov/plugins.html">Viewers &amp; Players</Box>
            </Box>
          </Box>
          <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'center', md: 'baseline' }} gap="4px">
            <Typography sx={styles.footerText} variant="body1">Affiliate Websites</Typography>
            <Box display="flex" alignItems="center" gap="16px">
              <a href="https://www.whitehouse.gov/">
                <img src={WhiteHouseLogo} alt="Whitehouse.gov logo" style={{ height: '24px' }} />
              </a>
              <a href="https://www.usa.gov/">
                <img src={USAGovLogo} alt="USA.gov logo" style={{ height: '24px' }} />
              </a>
              <a href="http://www.hhs.gov/">
                <img src={HHSLogo} alt="HHS.gov logo" style={{ height: '24px' }} />
              </a>
              <a href="https://gobierno.usa.gov/">
                <img src={USAGovEspLogo} alt="gobiernoUSA.gov logo" style={{ height: '24px' }} />
              </a>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" textAlign={{ xs: 'center', md: 'left' }} flexDirection={{ xs: 'column', md: 'row' }} gap="4px">
            <Typography sx={styles.footerText} variant="body1">Owned by the Office of the National Coordinator for Health Information Technology</Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default ChplNavigationBottom;

ChplNavigationBottom.propTypes = {
};
