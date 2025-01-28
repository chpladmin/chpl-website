import React from 'react';
import {
  AppBar, Box, Typography, Container,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import WhiteHouseLogo from '../../assets/images/US-WhiteHouse-Logo.svg.png';
import HHSLogo from '../../assets/images/HHS-White_HiRes.png';
import USAGovLogo from '../../assets/images/USAgov_logo_2.png';
import USAGovEspLogo from '../../assets/images/Logo_USAGov_Spanish.png';

import ChplAnnouncementsDisplay from 'components/system-maintenance/announcement/announcements-display';

const useStyles = makeStyles(() => ({
  footer: {
    position: 'relative',
    backgroundColor: '#001439!important',
    padding: '16px 32px',
    borderBottom: '6px solid #000d25',
    borderTop: '1px solid #000d25',
    zIndex: 1000,
  },
  footerText: {
    color: '#fff',
  },
}));
function ChplNavigationBottom() {
  const classes = useStyles();
  return (
    <>
      <AppBar className={classes.footer} component="footer">
        <Container maxWidth="lg" disableGutters>
          <Box display="flex" justifyContent="space-between">
            <Box display="flex" flexDirection="column" gridGap={4}>
              <Typography className={classes.footerText} variant="body2">Helpful Links</Typography>
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
            <Box display="flex" flexDirection="column" gridGap={4}>
              <Typography className={classes.footerText} variant="body2">Affiliate Websites</Typography>
              <Box display="flex" alignItems="center" gridGap={16}>
                <a href="https://www.whitehouse.gov/">
                  <img src={WhiteHouseLogo} alt="Whitehouse.gov" style={{ height: '24px' }} />
                </a>
                <a href="https://www.usa.gov/">
                  <img src={USAGovLogo} alt="USA.gov" style={{ height: '24px' }} />
                </a>
                <a href="http://www.hhs.gov/">
                  <img src={HHSLogo} alt="HHS.gov" style={{ height: '24px' }} />
                </a>
                <a href="https://gobierno.usa.gov/">
                  <img src={USAGovEspLogo} alt="gobiernoUSA.gov" style={{ height: '24px' }} />
                </a>
              </Box>
            </Box>
            <Box display="flex" flexDirection="column" gridGap={4}>
              <Typography className={classes.footerText} variant="body2">Owned By</Typography>
              <Typography className={classes.footerText} variant="body1">The Assistant Secretary for Technology Policy</Typography>
            </Box>
            <ChplAnnouncementsDisplay />
          </Box>
        </Container>
      </AppBar>
    </>
  );
}

export default ChplNavigationBottom;

ChplNavigationBottom.propTypes = {
};
