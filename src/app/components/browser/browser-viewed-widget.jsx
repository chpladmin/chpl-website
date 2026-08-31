import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { pushPreviouslyViewed } from 'components/browser/browserInfo.slice';
import { listing as listingPropType } from 'shared/prop-types';

function ChplBrowserViewedWidget({ listing }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(pushPreviouslyViewed(listing));
  }, []);

  return null;
}

export default ChplBrowserViewedWidget;

ChplBrowserViewedWidget.propTypes = {
  listing: listingPropType.isRequired,
};
