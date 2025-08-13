import React, { useState } from 'react';
import { node } from 'prop-types';

import { ChangeRequestContext } from 'shared/contexts';

function ChangeRequestWrapper({ children }) {
  const [changeRequest, setChangeRequest] = useState(undefined);

  const changeRequestState = {
    changeRequest,
    setChangeRequest,
  };

  return (
    <ChangeRequestContext.Provider value={changeRequestState}>
      { children }
    </ChangeRequestContext.Provider>
  );
}

export default ChangeRequestWrapper;

ChangeRequestWrapper.propTypes = {
  children: node.isRequired,
};
