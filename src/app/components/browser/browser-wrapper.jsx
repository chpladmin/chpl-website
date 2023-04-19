import React from 'react';
import { node } from 'prop-types';

import { getAngularService } from 'services/angular-react-helper';
import { BrowserContext } from 'shared/contexts';

function BrowserWrapper(props) {
  const $localStorage = getAngularService('$localStorage');
  const { children } = props;

  const addToCompared = (listing) => {
    const next = [listing.id]
      .concat(($localStorage?.previouslyCompared ?? []).filter((id) => id !== listing.id))
      .slice(0, 20);
    $localStorage.previouslyCompared = next;
  };

  const addToViewed = (listing) => {
    const next = [listing.id]
      .concat(($localStorage?.previouslyViewed ?? []).filter((id) => id !== listing.id))
      .slice(0, 20);
    $localStorage.previouslyViewed = next;
  };

  const getPreviouslyCompared = () => $localStorage?.previouslyCompared ?? [];

  const getPreviouslyViewed = () => $localStorage?.previouslyViewed ?? [];

  const browserState = {
    addToCompared,
    addToViewed,
    getPreviouslyCompared,
    getPreviouslyViewed,
  };

  return (
    <BrowserContext.Provider value={browserState}>
      { children }
    </BrowserContext.Provider>
  );
}

export default BrowserWrapper;

BrowserWrapper.propTypes = {
  children: node.isRequired,
};
