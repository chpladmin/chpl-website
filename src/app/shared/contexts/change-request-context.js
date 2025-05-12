import { createContext } from 'react';

const ChangeRequestContext = createContext({
  details: {},
  setDetails: () => {},
});
ChangeRequestContext.displayName = 'cr-context';

export default ChangeRequestContext;
