import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import ChplRegisterUser from './register-user';

import { usePostAuthorizeUser, usePostCreateInvitedUser } from 'api/users';
import { goToState } from 'services/navigation.service';
import { UserContext } from 'shared/contexts';

const mockEnqueueSnackbar = jest.fn();

jest.mock('api/users', () => ({
  usePostAuthorizeUser: jest.fn(),
  usePostCreateInvitedUser: jest.fn(),
}));
jest.mock('notistack', () => ({
  useSnackbar: () => ({ enqueueSnackbar: mockEnqueueSnackbar }),
}));
jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
}));
jest.mock('services/analytics.service', () => ({
  eventTrack: jest.fn(),
}));
jest.mock('services/navigation.service', () => ({
  goToState: jest.fn(),
}));
jest.mock('components/login/login', () => function ChplLogin() {
  const mockReact = jest.requireActual('react');
  return mockReact.createElement('div', { 'data-testid': 'login' });
});
jest.mock('components/registration/user-create', () => function ChplUserCreate({ dispatch }) {
  const mockReact = jest.requireActual('react');
  return mockReact.createElement('button', {
    type: 'button',
    onClick: () => dispatch('create', { fullName: 'New User' }),
  }, 'Create account');
});

const HASH = 'invitation-hash';

const anonymous = { hasAnyRole: () => false };
const developerUser = { hasAnyRole: (roles) => roles.includes('chpl-developer') };

const renderView = (user = anonymous) => render(
  <UserContext.Provider value={user}>
    <ChplRegisterUser hash={HASH} />
  </UserContext.Provider>,
);

describe('user registration', () => {
  let authorize;
  let createInvited;

  beforeEach(() => {
    jest.clearAllMocks();
    authorize = jest.fn();
    createInvited = jest.fn();
    usePostAuthorizeUser.mockReturnValue({ mutate: authorize });
    usePostCreateInvitedUser.mockReturnValue({ mutate: createInvited });
  });

  describe('creating an account', () => {
    it('sends the invitation hash with the new user', () => {
      renderView();
      fireEvent.click(screen.getByRole('button', { name: 'Create account' }));

      expect(createInvited).toHaveBeenCalledWith({ hash: HASH, user: { fullName: 'New User' } }, expect.anything());
    });

    it('goes to the main page once the account is created', () => {
      createInvited.mockImplementation((packet, { onSuccess }) => onSuccess());
      renderView();
      fireEvent.click(screen.getByRole('button', { name: 'Create account' }));

      expect(mockEnqueueSnackbar).toHaveBeenCalledWith(expect.stringContaining('Your account has been created'), { variant: 'success' });
      expect(goToState).toHaveBeenCalledWith('search');
    });

    it('stays on the form and reports the error when the account cannot be created', () => {
      createInvited.mockImplementation((packet, { onError }) => onError({ response: { data: { error: 'Invitation expired' } } }));
      renderView();
      fireEvent.click(screen.getByRole('button', { name: 'Create account' }));

      expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Invitation expired', { variant: 'error' });
      expect(goToState).not.toHaveBeenCalled();
      expect(screen.getByRole('button', { name: 'Create account' })).toBeInTheDocument();
    });
  });

  describe('an existing, logged in user', () => {
    it('is authorized with the invitation on arrival, then goes to administration', () => {
      authorize.mockImplementation((hash, { onSuccess }) => onSuccess({ data: {} }));
      renderView(developerUser);

      expect(authorize).toHaveBeenCalledWith(HASH, expect.anything());
      expect(goToState).toHaveBeenCalledWith('administration');
    });
  });

  it('does not authorize an anonymous user on arrival', () => {
    renderView();

    expect(authorize).not.toHaveBeenCalled();
  });
});
