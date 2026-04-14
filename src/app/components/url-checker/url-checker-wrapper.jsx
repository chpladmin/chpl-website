import React, { useState } from 'react';
import { element } from 'prop-types';

import UrlCheckerContext from './url-checker-context';

function UrlCheckerWrapper({ children }) {
  const [url, setUrl] = useState('');

  const urlState = {
    url,
    setUrl,
  };

  return (
    <UrlCheckerContext.Provider value={urlState}>
      {children}
    </UrlCheckerContext.Provider>
  );
}

export default UrlCheckerWrapper;

UrlCheckerWrapper.propTypes = {
  children: element.isRequired,
};
