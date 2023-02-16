import { useContext, useEffect } from 'react';

import { BrowserContext } from 'shared/contexts';
import { listing as listingPropType } from 'shared/prop-types';

function ChplBrowserViewedWidget(props) {
  const { listing } = props;
  const { addToViewed } = useContext(BrowserContext);

  useEffect(() => {
    addToViewed(listing);
  }, []);

  return null;
}

export default ChplBrowserViewedWidget;

ChplBrowserViewedWidget.propTypes = {
  listing: listingPropType.isRequired,
};
