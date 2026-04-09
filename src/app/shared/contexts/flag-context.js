import { createContext } from 'react';

const FlagContext = createContext({
  demographicChangeRequestIsOn: false,
  insightsConnectionIsOn: false,
  insightsDisplayIsOn: false,
  rwtAiIntegrationIsOn: false,
  rwtChangeRequestIsOn: false,
  sbulChangeRequestIsOn: false,
});
FlagContext.displayName = 'ff4j-flags';

export default FlagContext;
