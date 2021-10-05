import { createContext } from 'react';

const UserContext = createContext({
  user: {},
  setUser: () => {},
  impersonating: false,
  setImpersonating: () => {},
});
UserContext.displayName = 'user-information';

export default UserContext;
