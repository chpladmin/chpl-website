import React from 'react';
import { when } from 'jest-when';
import {
  cleanup, render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import ChplLink from './chpl-link';

import * as angularReactHelper from 'services/angular-react-helper';

const $analyticsMock = {
  eventTrack: jest.fn(),
};
angularReactHelper.getAngularService = jest.fn();
when(angularReactHelper.getAngularService).calledWith('$analytics').mockReturnValue($analyticsMock);

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

  it('tracks basic analytics', async () => {
    const href = 'http://www.example.com';
    const analytics = {
      event: 'event',
    };
    render(
      <ChplLink
        href={href}
        analytics={analytics}
      />,
    );
    userEvent.click(screen.getByText(href));
    await waitFor(() => {
      expect($analyticsMock.eventTrack).toHaveBeenCalledWith(
        'event',
      );
    });
  });

  it('tracks category analytics', async () => {
    const href = 'http://www.example.com';
    const analytics = {
      event: 'event',
      category: 'category',
    };
    render(
      <ChplLink
        href={href}
        analytics={analytics}
      />,
    );
    userEvent.click(screen.getByText(href));
    await waitFor(() => {
      expect($analyticsMock.eventTrack).toHaveBeenCalledWith(
        'event',
        { category: 'category' },
      );
    });
  });

  it('tracks label analytics', async () => {
    const href = 'http://www.example.com';
    const analytics = {
      event: 'event',
      label: 'label',
    };
    render(
      <ChplLink
        href={href}
        analytics={analytics}
      />,
    );
    userEvent.click(screen.getByText(href));
    await waitFor(() => {
      expect($analyticsMock.eventTrack).toHaveBeenCalledWith(
        'event',
        { label: 'label' },
      );
    });
  });

  it('tracks complete analytics', async () => {
    const href = 'http://www.example.com';
    const analytics = {
      event: 'event',
      category: 'category',
      label: 'label',
    };
    render(
      <ChplLink
        href={href}
        analytics={analytics}
      />,
    );
    userEvent.click(screen.getByText(href));
    await waitFor(() => {
      expect($analyticsMock.eventTrack).toHaveBeenCalledWith(
        'event',
        { category: 'category', label: 'label' },
      );
    });
  });
});
