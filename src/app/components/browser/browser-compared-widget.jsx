import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { pushPreviouslyCompared } from 'components/browser/browserInfo.slice';
import { listing as listingPropType } from 'shared/prop-types';

function ChplBrowserComparedWidget({ listing }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(pushPreviouslyCompared(listing));
  }, []);

  return null;
}

export default ChplBrowserComparedWidget;

ChplBrowserComparedWidget.propTypes = {
  listing: listingPropType.isRequired,
};
