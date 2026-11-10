import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import ChplForgotPassword from './forgot-password';

import { goToState } from 'services/navigation.service';

const mockReduxDispatch = jest.fn();

jest.mock('react-redux', () => ({
  useDispatch: () => mockReduxDispatch,
}));
jest.mock('services/navigation.service', () => ({
  goToState: jest.fn(),
}));
jest.mock('components/login/components/reset-forgotten-password', () => function ChplResetForgottenPassword({ onReset = () => {}, uuid }) {
  const mockReact = jest.requireActual('react');
  return mockReact.createElement('div', { 'data-testid': 'reset', 'data-uuid': uuid }, [
    mockReact.createElement('button', { key: 'reset', type: 'button', onClick: onReset }, 'Reset'),
  ]);
});
jest.mock('components/login/login', () => function ChplLogin({ dispatch = () => {} }) {
  const mockReact = jest.requireActual('react');
  return mockReact.createElement('div', { 'data-testid': 'login' }, [
    mockReact.createElement('button', { key: 'in', type: 'button', onClick: () => dispatch('loggedIn') }, 'Log in'),
    mockReact.createElement('button', { key: 'force', type: 'button', onClick: () => dispatch('forceChangePassword') }, 'Force change'),
  ]);
});

const UUID = 'reset-token';

const resetAndShowSignIn = () => {
  render(<ChplForgotPassword uuid={UUID} />);
  fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
};

describe('forgot password page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('opens on the reset form with the token from the link', () => {
    render(<ChplForgotPassword uuid={UUID} />);

    expect(screen.getByTestId('reset')).toHaveAttribute('data-uuid', UUID);
    expect(screen.queryByTestId('login')).not.toBeInTheDocument();
    expect(goToState).not.toHaveBeenCalled();
  });

  // the global login state also drives the header login panel, so the page must not take it over
  it('leaves the global login state alone', () => {
    render(<ChplForgotPassword uuid={UUID} />);

    expect(mockReduxDispatch).not.toHaveBeenCalled();
  });

  it('shows the standard page header', () => {
    render(<ChplForgotPassword uuid={UUID} />);

    expect(screen.getByRole('heading', { level: 1, name: 'Forgot Password' })).toBeInTheDocument();
  });

  it('hands off to sign in once the password is reset', () => {
    resetAndShowSignIn();

    expect(screen.getByTestId('login')).toBeInTheDocument();
    expect(screen.queryByTestId('reset')).not.toBeInTheDocument();
  });

  it('titles the sign in step as a login rather than a forgotten password', () => {
    resetAndShowSignIn();

    expect(screen.getByRole('heading', { level: 1, name: 'Administrator Login' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 1, name: 'Forgot Password' })).not.toBeInTheDocument();
  });

  it('goes to the home page once the user signs in after resetting', () => {
    resetAndShowSignIn();
    fireEvent.click(screen.getByRole('button', { name: 'Log in' }));

    expect(goToState).toHaveBeenCalledWith('search');
  });

  it('stays on the page for steps that are not a completed sign in', () => {
    resetAndShowSignIn();
    fireEvent.click(screen.getByRole('button', { name: 'Force change' }));

    expect(goToState).not.toHaveBeenCalled();
  });
});
