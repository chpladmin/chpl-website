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

  const isOn = (flag) => flags?.length > 0 && flags.find((f) => f.key === flag)?.active;

  const cmsA9GracePeriodEndIsOn = isOn('cms-a9-grace-period-end');
  const demographicChangeRequestIsOn = isOn('demographic-change-request');
  const domainIsOn = isOn('domain');
  const insightsIsOn = isOn('insights');
  const sbulChangeRequestIsOn = isOn('sbul-change-request');

  const flagState = {
    cmsA9GracePeriodEndIsOn,
    demographicChangeRequestIsOn,
    domainIsOn,
    insightsIsOn,
    sbulChangeRequestIsOn,
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
