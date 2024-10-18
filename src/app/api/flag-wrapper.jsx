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

  const cmsA9GracePeriodEndIsOn = isOn('cms-a9-grace-period-end');
  const demographicChangeRequestIsOn = isOn('demographic-change-request');
  const ssoIsOn = isOn('sso');
  const uploadToUpdateIsOn = isOn('upload-to-update');

  const flagState = {
    isOn,
    cmsA9GracePeriodEndIsOn,
    demographicChangeRequestIsOn,
    ssoIsOn,
    uploadToUpdateIsOn,
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
