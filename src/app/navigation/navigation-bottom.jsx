import React from 'react';
import {
  Box, Typography, Container,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import WhiteHouseLogo from '../../assets/images/US-WhiteHouse-Logo.svg.png';
import HHSLogo from '../../assets/images/HHS-White_HiRes.png';
import USAGovLogo from '../../assets/images/USAgov_logo_2.png';
import USAGovEspLogo from '../../assets/images/Logo_USAGov_Spanish.png';

import { theme } from 'themes';
import ChplAnnouncementsDisplay from 'components/system-maintenance/announcement/announcements-display';

const useStyles = makeStyles(() => ({
  footer: {
    position: 'fixed',
    width: '100%',
    backgroundColor: '#001439!important',
    padding: '4px 32px',
    borderTop: '1px solid #000d25',
    zIndex: 1000,
    left: 0,
    right: 0,
    bottom: 0,
    top: 'auto',
    marginTop: '5%',
    [theme.breakpoints.down('sm')]: {
      position: 'relative',
      marginTop: 0,
    },
  },
  footerContentContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '4px',
    [theme.breakpoints.up('xs')]: {
      flexWrap: 'wrap',
      gap: '8px',
    },
  },
  footerText: {
    color: '#fff',
    '&:hover': {
      color: '#fff',
    },
  },
}));
function ChplNavigationBottom() {
  const classes = useStyles();
  return (
    <>

      <Box className={classes.footer}>
        <ChplAnnouncementsDisplay />
        <Container maxWidth="lg" disableGutters>
          <Box className={classes.footerContentContainer}>
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
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default ChplNavigationBottom;

ChplNavigationBottom.propTypes = {
};
