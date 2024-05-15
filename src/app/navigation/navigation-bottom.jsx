import React from 'react';

import ChplAnnouncementsDisplay from 'components/announcement/announcements-display';

function ChplNavigationBottom() {
  return (
    <footer>
      <nav className="navbar navbar-default navbar-fixed-bottom">
        <div className="container-fluid">
          <p className="navbar-left nav-text spaced-out">
            <a href="#/search">Home</a>
            {' | '}
            <a href="http://www.hhs.gov/privacy.html">Privacy Policy</a>
            {' | '}
            <a href="http://www.hhs.gov/disclaimer.html">Disclaimer</a>
            {' | '}
            <a href="https://www.whitehouse.gov/">White House</a>
            {' | '}
            <a href="http://www.hhs.gov/">HHS</a>
            {' | '}
            <a href="https://www.usa.gov/">USA.gov</a>
            {' | '}
            <a href="http://www.hhs.gov/plugins.html">Viewers &amp; Players</a>
            {' | '}
            <a href="https://gobierno.usa.gov/">GobiernoUSA.gov</a>
          </p>
          <div className="navbar-nav navbar-right">
            <ChplAnnouncementsDisplay />
          </div>
        </div>
      </nav>
    </footer>
  );
}

export default ChplNavigationBottom;

ChplNavigationBottom.propTypes = {
};
