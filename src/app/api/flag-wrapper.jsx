import React, { useEffect, useState } from 'react';
import { element } from 'prop-types';

import useFetchFlags from 'api/flags';
import { FlagContext } from 'shared/contexts';

function FlagWrapper({ children }) {
  const { data } = useFetchFlags();
  const [flags, setFlags] = useState({});

  useEffect(() => {
    setFlags(data);
  }, [data]);

  const isOn = (flag) => flags?.length > 0 && flags.find((f) => f.key === flag).active;

  const flagState = {
    isOn,
  };

  return (
    <FlagContext.Provider value={flagState}>
      {children}
    </FlagContext.Provider>
  );
}

export default FlagWrapper;

FlagWrapper.propTypes = {
  children: element.isRequired,
};
