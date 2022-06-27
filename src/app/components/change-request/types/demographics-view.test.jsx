import React from 'react';
import {
  cleanup, render, screen, within,
} from '@testing-library/react';
import '@testing-library/jest-dom';

import ChplChangeRequestDemographicsView from './demographics-view';

let rerender;

const mock = {
  changeRequest: {
    developer: {
      contact: {
        fullName: 'initial name',
        title: 'initial title',
        email: 'initial email',
        phoneNumber: 'initial phone number',
      },
      address: {
        line1: 'initial line 1',
        line2: 'initial line 2',
        city: 'initial city',
        state: 'initial state',
        zipcode: 'initial zip code',
        country: 'initial country',
      },
      website: 'http://initial.com',
    },
    details: {
      contact: {
        fullName: 'final name',
        title: 'final title',
        email: 'final email',
        phoneNumber: 'final phone number',
      },
      address: {
        line1: 'final line 1',
        line2: 'final line 2',
        city: 'final city',
        state: 'final state',
        zipcode: 'final zip code',
        country: 'final country',
      },
      website: 'http://final.com',
    },
  },
};

describe('the ChplChangeRequestDemographicsView component', () => {
  beforeEach(async () => {
    rerender = render(
      <ChplChangeRequestDemographicsView
        changeRequest={mock.changeRequest}
      />,
    ).rerender;
  });

  afterEach(() => {
    cleanup();
  });

  it('should exist', () => {
    expect(screen).not.toBe(null);
  });

  it('should have sections for current and submitted demographics', () => {
    expect(screen.getByText('Current demographics')).not.toBe(null);
    expect(screen.getByText('Submitted demographics')).not.toBe(null);
  });

  it('should display current demographics', () => {
    const current = within(screen.getByText('Current demographics').parentElement);
    expect(current.getByText(/Self-Developer/)).toHaveTextContent('Self-Developer: No');
    expect(current.getByText(/Full Name/)).toHaveTextContent('Full Name: initial name');
    expect(current.getByText(/Title/)).toHaveTextContent('Title: initial title');
    expect(current.getByText(/Email/)).toHaveTextContent('Email: initial email');
    expect(current.getByText(/Phone/)).toHaveTextContent('Phone: initial phone');
    expect(current.getByText(/Address:/)).toHaveTextContent('Address: initial line 1');
    expect(current.getByText(/Line 2/)).toHaveTextContent('Line 2: initial line 2');
    expect(current.getByText(/City/)).toHaveTextContent('City: initial city');
    expect(current.getByText(/State/)).toHaveTextContent('State: initial state');
    expect(current.getByText(/Zip/)).toHaveTextContent('Zip: initial zip code');
    expect(current.getByText(/Country/)).toHaveTextContent('Country: initial country');
    expect(current.getByText(/Website/)).toHaveTextContent('Website: http://initial.com');
  });

  it('should display final demographics', () => {
    const final = within(screen.getByText('Submitted demographics').parentElement);
    expect(final.getByText(/Self-Developer/)).toHaveTextContent('Self-Developer: No');
    expect(final.getByText(/Full Name/)).toHaveTextContent('Full Name: final name');
    expect(final.getByText(/Title/)).toHaveTextContent('Title: final title');
    expect(final.getByText(/Email/)).toHaveTextContent('Email: final email');
    expect(final.getByText(/Phone/)).toHaveTextContent('Phone: final phone');
    expect(final.getByText(/Address:/)).toHaveTextContent('Address: final line 1');
    expect(final.getByText(/Line 2/)).toHaveTextContent('Line 2: final line 2');
    expect(final.getByText(/City/)).toHaveTextContent('City: final city');
    expect(final.getByText(/State/)).toHaveTextContent('State: final state');
    expect(final.getByText(/Zip/)).toHaveTextContent('Zip: final zip code');
    expect(final.getByText(/Country/)).toHaveTextContent('Country: final country');
    expect(final.getByText(/Website/)).toHaveTextContent('Website: http://final.com');
  });

  describe('with "self-developer yes"', () => {
    beforeEach(async () => {
      const modified = {
        ...mock.changeRequest,
        developer: {
          ...mock.changeRequest.developer,
          selfDeveloper: true,
        },
        details: {
          ...mock.changeRequest.details,
          selfDeveloper: true,
        },
      };
      rerender(
        <ChplChangeRequestDemographicsView
          changeRequest={modified}
        />,
      );
    });

    it('should display "yes"', () => {
      const current = within(screen.getByText('Current demographics').parentElement);
      const final = within(screen.getByText('Submitted demographics').parentElement);
      expect(current.getByText(/Self-Developer/)).toHaveTextContent('Self-Developer: Yes');
      expect(final.getByText(/Self-Developer/)).toHaveTextContent('Self-Developer: Yes');
    });
  });
});
