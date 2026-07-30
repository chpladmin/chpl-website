import React from 'react';
import { node } from 'prop-types';

import { useLocalStorage as useStorage } from 'services/storage.service';
import { BrowserContext } from 'shared/contexts';

function BrowserWrapper({ children }) {
  const [previouslyCompared, setPreviouslyCompared] = useStorage('ngStorage-previouslyCompared', []);
  const [previouslyViewed, setPreviouslyViewed] = useStorage('ngStorage-previouslyViewed', []);

  const addToCompared = (listing) => {
    setPreviouslyCompared((prev) => [
      listing.id,
      ...prev.filter((id) => id !== listing.id),
    ].slice(0, 20));
  };

  const addToViewed = (listing) => {
    setPreviouslyViewed((prev) => [
      listing.id,
      ...prev.filter((id) => id !== listing.id),
    ].slice(0, 20));
  };

  const getPreviouslyCompared = () => previouslyCompared ?? [];

  const getPreviouslyViewed = () => previouslyViewed ?? [];

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
