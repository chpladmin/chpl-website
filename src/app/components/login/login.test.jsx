import React from 'react';
import { render, screen } from '@testing-library/react';

import ChplLogin from './login';

let mockLoginState;

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: (selector) => selector({ userInfo: { loginState: mockLoginState } }),
}));
jest.mock('./components/change-password', () => () => 'change password');
jest.mock('./components/force-change-password', () => () => 'force change password');
jest.mock('./components/forgot-password', () => () => 'forgot password');
jest.mock('./components/logged-in', () => () => 'logged in');
jest.mock('./components/signin', () => () => 'sign in');

describe('login panel', () => {
  it.each([
    ['CHANGEPASSWORD', 'change password'],
    ['FORCECHANGEPASSWORD', 'force change password'],
    ['FORGOTPASSWORD', 'forgot password'],
    ['LOGGEDIN', 'logged in'],
    ['SIGNIN', 'sign in'],
  ])('shows the %s step', (state, text) => {
    mockLoginState = state;
    render(<ChplLogin />);

    expect(screen.getByText(text)).toBeInTheDocument();
  });
});
