import React from 'react';
import {
  Box,
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';

import WhiteHouseLogo from '../../assets/images/US-WhiteHouse-Logo.svg.png';
import HHSLogo from '../../assets/images/HHS-White_HiRes.png';
import USAGovLogo from '../../assets/images/USAgov_logo_2.png';
import USAGovEspLogo from '../../assets/images/Logo_USAGov_Spanish.png';

import { palette, theme } from 'themes';

const useStyles = makeStyles({
  footer: {
    position: 'sticky',
    width: '100%',
    backgroundColor: `${palette.navBackground} !important`,
    padding: '4px 32px',
    borderTop: '1px solid #000d25',
    zIndex: 999,
    left: 0,
    right: 0,
    bottom: 0,
    top: 'auto',
    [theme.breakpoints.down('sm')]: {
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
    [theme.breakpoints.up('lg')]: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: '4px',
      justifyContent: 'space-between',
    },
  },
  footerText: {
    color: '#fff',
    '&:hover': {
      color: '#fff',
    },
  },
});
function ChplNavigationBottom() {
  const classes = useStyles();

  return (
    <Box className={classes.footer}>
      <Container maxWidth="lg" disableGutters>
        <Box className={classes.footerContentContainer}>
          <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'center', md: 'baseline' }} gridGap={4} >
            <Typography className={classes.footerText} variant="body1">Helpful Links</Typography>
            <Box color="#fff" display="flex" gridGap={2}>
              <a className={classes.footerText} href="#/search">Home</a>
              {' | '}
              <a className={classes.footerText} href="http://www.hhs.gov/privacy.html">Privacy Policy</a>
              {' | '}
              <a className={classes.footerText} href="http://www.hhs.gov/disclaimer.html">Disclaimer</a>
              {' | '}
              <a className={classes.footerText} href="http://www.hhs.gov/plugins.html">Viewers &amp; Players</a>
            </Box>
          </Box>
          <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'center', md: 'baseline' }} gridGap={4}>
            <Typography className={classes.footerText} variant="body1">Affiliate Websites</Typography>
            <Box display="flex" alignItems="center" gridGap={16}>
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
          <Box display="flex" alignItems="center" textAlign={{xs: 'center', md: 'left' }} flexDirection={{ xs: 'column', md: 'row' }} gridGap={4}>
            <Typography className={classes.footerText} variant="body1">Owned by the Office of the National Coordinator for Health Information Technology</Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default ChplNavigationBottom;

ChplNavigationBottom.propTypes = {
};
