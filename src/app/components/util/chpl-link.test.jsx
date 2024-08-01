import React from 'react';
import {
  cleanup, render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';

import ChplLink from './chpl-link';

import * as angularReactHelper from 'services/angular-react-helper';

angularReactHelper.getAngularService = jest.fn();

describe('the ChplLink component', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders a link', async () => {
    const href = 'http://www.example.com';
    render(
      <ChplLink
        href={href}
      />,
    );
    await waitFor(() => {
      expect(screen.getByText(href)).toBeInTheDocument();
      expect(screen.getByText(href).closest('a')).toHaveAttribute('href', href);
      expect(screen.getByText('Web Site Disclaimers')).toBeInTheDocument();
      expect(screen.getByText('Web Site Disclaimers').closest('a')).toHaveAttribute('href', 'http://www.hhs.gov/disclaimer.html');
    });
  });

  it('renders a secure link', async () => {
    const href = 'https://www.example.com';
    render(
      <ChplLink
        href={href}
      />,
    );
    await waitFor(() => {
      expect(screen.getByText(href)).toBeInTheDocument();
      expect(screen.getByText(href).closest('a')).toHaveAttribute('href', href);
    });
  });

  it('prefixes an href with http if it doesn\'t have a prefix', async () => {
    const href = 'www.example.com';
    render(
      <ChplLink
        href={href}
      />,
    );
    await waitFor(() => {
      expect(screen.getByText(href)).toBeInTheDocument();
      expect(screen.getByText(href).closest('a')).toHaveAttribute('href', `http://${href}`);
    });
  });

  it('uses text if provided', async () => {
    const href = 'http://www.example.com';
    const text = 'Example.com';
    render(
      <ChplLink
        href={href}
        text={text}
      />,
    );
    await waitFor(() => {
      expect(screen.getByText(text)).toBeInTheDocument();
      expect(screen.getByText(text).closest('a')).toHaveAttribute('href', href);
    });
  });
});
