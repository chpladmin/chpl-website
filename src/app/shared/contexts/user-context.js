import { createContext } from 'react';

const UserContext = createContext({
  hasAnyRole: () => false,
  hasAuthorityOn: () => false,
});
UserContext.displayName = 'user-information';

export default UserContext;
