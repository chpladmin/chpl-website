import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import ChplLoginPage from './login';

import { goToState } from 'services/navigation.service';

jest.mock('services/navigation.service', () => ({
  goToState: jest.fn(),
}));
jest.mock('components/login/login', () => function ChplLogin({ dispatch = () => {} }) {
  const mockReact = jest.requireActual('react');
  return mockReact.createElement('div', { 'data-testid': 'login' }, [
    mockReact.createElement('button', { key: 'in', type: 'button', onClick: () => dispatch('loggedIn') }, 'Log in'),
    mockReact.createElement('button', { key: 'force', type: 'button', onClick: () => dispatch('forceChangePassword') }, 'Force change'),
  ]);
});

const returnTo = {
  state: () => 'listing',
  params: () => ({ id: 1234 }),
  options: () => ({ location: true }),
};

describe('administrator login page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows the standard page header around the login form', () => {
    render(<ChplLoginPage returnTo={returnTo} />);

    expect(screen.getByRole('heading', { level: 1, name: 'Administrator Login' })).toBeInTheDocument();
    expect(screen.getByTestId('login')).toBeInTheDocument();
  });

  it('returns to where the user was headed once signed in, reloading it', () => {
    render(<ChplLoginPage returnTo={returnTo} />);
    fireEvent.click(screen.getByRole('button', { name: 'Log in' }));

    expect(goToState).toHaveBeenCalledWith('listing', { id: 1234 }, { location: true, reload: true });
  });

  it('goes to the home page when there is nowhere to return to', () => {
    render(<ChplLoginPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Log in' }));

    expect(goToState).toHaveBeenCalledWith('search', undefined, { reload: true });
  });

  it('stays on the page for steps that are not a completed sign in', () => {
    render(<ChplLoginPage returnTo={returnTo} />);
    fireEvent.click(screen.getByRole('button', { name: 'Force change' }));

    expect(goToState).not.toHaveBeenCalled();
  });
});
