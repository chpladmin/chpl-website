import React, { useEffect, useState } from 'react';
import { element } from 'prop-types';

import { useFetchEnvironment, useFetchFlags } from 'api/flags';
import { FlagContext } from 'shared/contexts';

function FlagWrapper({ children }) {
  const { data } = useFetchFlags();
  const { data: isProductionData, isLoading, isSuccess } = useFetchEnvironment();
  const [isProduction, setIsProduction] = useState(true);
  const [flags, setFlags] = useState({});

  useEffect(() => {
    setFlags(data);
  }, [data]);

  useEffect(() => {
    if (isLoading || !isSuccess) { return; }
    let headerValue = '';
    // Local environments send the header key in all lower case
    // but other environments send the header key capitalized
//    if (isProductionData.headers.Environment) {
//      headerValue = isProductionData.headers.Environment;
//    } else if (isProductionData.headers.environment) {
      headerValue = isProductionData.headers.environment;
//    }
    setIsProduction((headerValue.toUpperCase() === 'PRODUCTION'));
  }, [isProductionData, isLoading, isSuccess]);

  const isOn = (flag) => flags?.length > 0 && flags.find((f) => f.key === flag)?.active;

  const demographicChangeRequestIsOn = isOn('demographic-change-request');
  const domainIsOn = isOn('domain');
  const insightsConnectionIsOn = isOn('insights-connection');
  const insightsDisplayIsOn = isOn('insights-display');
  const rwtAiIntegrationIsOn = isOn('rwt-ai-integration');
  const rwtChangeRequestIsOn = isOn('rwt-change-request');
  const sbulChangeRequestIsOn = isOn('sbul-change-request');

  const flagState = {
    isProduction,
    demographicChangeRequestIsOn,
    domainIsOn,
    insightsConnectionIsOn,
    insightsDisplayIsOn,
    rwtAiIntegrationIsOn,
    rwtChangeRequestIsOn,
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
