import { createContext } from 'react';

const FlagContext = createContext({
  cmsDisabledIsOn: false,
  demographicChangeRequestIsOn: false,
  hti520270101IsOn: false,
  hti5ErdIsOn: false,
  insightsConnectionIsOn: false,
  insightsDisplayIsOn: false,
  rwtChangeRequestIsOn: false,
  sbulChangeRequestIsOn: false,
});
FlagContext.displayName = 'ff4j-flags';

export default FlagContext;
