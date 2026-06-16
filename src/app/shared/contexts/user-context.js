import { createContext } from 'react';

const UserContext = createContext({
  enqueueSnackbar: () => { console.log('snackbar'); },
  hasAnyRole: () => false,
  hasAuthorityOn: () => false,
  loginWidgetState: 'SIGNIN',
  setLoginWidgetState: () => {},
  setUser: () => {},
  user: {},
});
UserContext.displayName = 'user-information';

export default UserContext;
