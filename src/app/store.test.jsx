// The store is created when its module loads, so each test seeds localStorage
// and then loads a fresh copy of it.
const loadStore = (persisted) => {
  localStorage.setItem('chplState', JSON.stringify(persisted));
  let store;
  jest.isolateModules(() => {
    store = require('./store').default; // eslint-disable-line global-require
  });
  return store;
};

const user = { fullName: 'Signed In User' };

describe('store', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('keeps a persisted login state', () => {
    const store = loadStore({ userInfo: { loginState: 'LOGGEDIN', user } });

    expect(store.getState().userInfo).toEqual({ loginState: 'LOGGEDIN', user });
  });

  // older builds stored the forgot password page's reset step as the global login state
  describe('with a reset step left over from an older build', () => {
    it('signs in an anonymous user', () => {
      const store = loadStore({ userInfo: { loginState: 'RESETFORGOTTENPASSWORD' } });

      expect(store.getState().userInfo.loginState).toBe('SIGNIN');
    });

    it('keeps a signed in user signed in', () => {
      const store = loadStore({ userInfo: { loginState: 'RESETFORGOTTENPASSWORD', user } });

      expect(store.getState().userInfo).toEqual({ loginState: 'LOGGEDIN', user });
    });

    it('writes the settled state back', () => {
      loadStore({ userInfo: { loginState: 'RESETFORGOTTENPASSWORD' } });

      expect(JSON.parse(localStorage.getItem('chplState')).userInfo.loginState).toBe('SIGNIN');
    });
  });
});
