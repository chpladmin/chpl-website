import { createContext } from 'react';

const FlagContext = createContext({
  cmsA9GracePeriodEndIsOn: false,
  demographicChangeRequestIsOn: false,
  insightsIsOn: false,
  ssoIsOn: false,
  uploadToUpdateIsOn: false,
});
FlagContext.displayName = 'ff4j-flags';

export default FlagContext;
