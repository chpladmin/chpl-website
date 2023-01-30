import React from 'react';
import {
  cleanup, render, screen, waitFor, within,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { when } from 'jest-when';

import * as angularReactHelper from '../../../services/angular-react-helper';

import ChplResourcesDownload from './download';

const ApiMock = 'API';

const analyticsMock = {
  eventTrack: jest.fn(() => {}),
};

const authServiceMock = {
  getApiKey: jest.fn(() => 'key'),
  getToken: jest.fn(() => 'token'),
  hasAnyRole: jest.fn(() => false),
};

angularReactHelper.getAngularService = jest.fn();
when(angularReactHelper.getAngularService).calledWith('API').mockReturnValue(ApiMock);
when(angularReactHelper.getAngularService).calledWith('$analytics').mockReturnValue(analyticsMock);
when(angularReactHelper.getAngularService).calledWith('authService').mockReturnValue(authServiceMock);

describe('the ChplResourcesDownload page', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(async () => {
    render(
      <ChplResourcesDownload />,
    );
  });

  describe('when rendering', () => {
    it('should not show the restricted Surveillance item', async () => {
      const item = screen.queryByText(/Surveillance (Basic):/i);

      await waitFor(() => {
        expect(item).toBe(null);
      });
    });

    it('should show appropriate list items', async () => {
      const items = screen.getAllByRole('listitem');

      await waitFor(() => {
        expect(items.length).toBe(11);
      });
    });
  });

  describe('when selecting a file', () => {
    it('should track analytics on the download file', async () => {
      userEvent.click(screen.getByRole('button', { name: /Select a collection to download/i }));
      userEvent.click(within(screen.getByRole('listbox')).getByText('2011 edition products (xml)'));
      userEvent.click(screen.getByRole('button', { name: /Data File/i }));

      await waitFor(() => {
        expect(analyticsMock.eventTrack).toHaveBeenCalledWith('Download CHPL', { category: 'Download CHPL', label: '2011 XML' });
      });
    });

    it('should track analytics on the definition file', async () => {
      userEvent.click(screen.getByRole('button', { name: /Select a collection to download/i }));
      userEvent.click(within(screen.getByRole('listbox')).getByText('2011 edition products (xml)'));
      userEvent.click(screen.getByRole('button', { name: /Definition File/i }));

      await waitFor(() => {
        expect(analyticsMock.eventTrack).toHaveBeenCalledWith('Download CHPL Definition', { category: 'Download CHPL', label: '2011 XML' });
      });
    });

    it('should track the default file analytics if nothing was selected', async () => {
      analyticsMock.eventTrack.mockClear();
      userEvent.click(screen.getByRole('button', { name: /Data File/i }));

      await waitFor(() => {
        expect(analyticsMock.eventTrack).toHaveBeenCalledWith('Download CHPL', { category: 'Download CHPL', label: '2015 XML' });
      });
    });
  });
});
