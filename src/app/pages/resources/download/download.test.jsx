import React from 'react';
import {
  cleanup, render, screen, waitFor, within,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { when } from 'jest-when';

import ChplResourcesDownload from './download';

import { eventTrack } from 'services/analytics.service';
import * as angularReactHelper from 'services/angular-react-helper';

const ApiMock = 'API';

const authServiceMock = {
  getApiKey: jest.fn(() => 'key'),
  getToken: jest.fn(() => 'token'),
  hasAnyRole: jest.fn(() => false),
};

angularReactHelper.getAngularService = jest.fn();
when(angularReactHelper.getAngularService).calledWith('API').mockReturnValue(ApiMock);
when(angularReactHelper.getAngularService).calledWith('authService').mockReturnValue(authServiceMock);

jest.mock('services/analytics.service', () => ({
  eventTrack: jest.fn(() => {}),
}));

let jsDomOpen;

describe('the ChplResourcesDownload page', () => {
  afterEach(() => {
    window.open = jsDomOpen;
    cleanup();
  });

  beforeEach(async () => {
    window.open = () => {};
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
        expect(items.length).toBe(9);
      });
    });
  });

  describe('when selecting a file', () => {
    it('should track analytics on the download file', async () => {
      eventTrack.mockClear();
      userEvent.click(screen.getByRole('button', { name: /Select a collection to download/i }));
      userEvent.click(within(screen.getByRole('listbox')).getByText('Inactive products summary'));
      userEvent.click(screen.getByRole('button', { name: /Data File/i }));

      await waitFor(() => {
        expect(eventTrack).toHaveBeenCalledWith({
          event: 'Download CHPL Data File',
          category: 'Download the CHPL',
          label: 'Inactive products',
        });
      });
    });

    it('should track analytics on the definition file', async () => {
      eventTrack.mockClear();
      userEvent.click(screen.getByRole('button', { name: /Select a collection to download/i }));
      userEvent.click(within(screen.getByRole('listbox')).getByText('Inactive products summary'));
      userEvent.click(screen.getByRole('button', { name: /Definition File/i }));

      await waitFor(() => {
        expect(eventTrack).toHaveBeenCalledWith({
          event: 'Download CHPL Definition File',
          category: 'Download the CHPL',
          label: 'Inactive products',
        });
      });
    });

    it('should track the default file analytics if nothing was selected', async () => {
      eventTrack.mockClear();
      userEvent.click(screen.getByRole('button', { name: /Data File/i }));

      await waitFor(() => {
        expect(eventTrack).toHaveBeenCalledWith({
          event: 'Download CHPL Data File',
          category: 'Download the CHPL',
          label: 'Active products',
        });
      });
    });
  });
});
