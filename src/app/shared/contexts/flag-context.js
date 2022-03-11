import { createContext } from 'react';

const FlagContext = createContext({
  isOn: () => {},
});
FlagContext.displayName = 'ff4j-flags';

export default FlagContext;
