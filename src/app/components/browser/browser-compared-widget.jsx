import { useContext, useEffect } from 'react';

import { BrowserContext } from 'shared/contexts';
import { listing as listingPropType } from 'shared/prop-types';

function ChplBrowserComparedWidget(props) {
  const { listing } = props;
  const { addToCompared } = useContext(BrowserContext);

  useEffect(() => {
    addToCompared(listing);
  }, []);

  return null;
}

export default ChplBrowserComparedWidget;

ChplBrowserComparedWidget.propTypes = {
  listing: listingPropType.isRequired,
};
