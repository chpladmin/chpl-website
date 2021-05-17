import React from 'react';
import {
  render, cleanup, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { when } from 'jest-when';

import * as angularReactHelper from '../../../../../services/angular-react-helper';
import ChplTestStandardsEdit from './test-standards-edit';

const hocMock = {
  onChange: jest.fn(),
};

describe('the ChplTestStandardsEdit component', () => {
  afterEach(() => {
    cleanup();
  });

  describe('when rendering for the first time', () => {
    beforeEach(async () => {
      render(
        <ChplTestStandardsEdit
          testStandards={[]}
          options={[]}
          onChange={hocMock.onChange}
        />);
    });

    it('should enable the Add Item button', async () => {
      const addItemButton = screen.getByRole('button', { name: /Add item/i });

      await waitFor(() => expect(addItemButton).toBeEnabled());
    });

    it.skip('should not have any values initially', async () => {
      const nameOrganization = screen.getByLabelText(/Name or Organization/i);
      const email = screen.getByLabelText(/Email/i);

      await waitFor(() => {
        expect(nameOrganization).toHaveValue('');
        expect(email).toHaveValue('');
      });
    });

    it.skip('should not have any error messages', async () => {
      const nameOrganization = screen.getByLabelText(/Name or Organization/i);
      const email = screen.getByLabelText(/Email/i);

      await waitFor(() => {
        expect(nameOrganization).toHaveAttribute('aria-invalid', 'false');
        expect(email).toHaveAttribute('aria-invalid', 'false');
      });
    });
  });

  describe.skip('when entering valid information', () => {
    beforeEach(async () => {
      render(<ChplApiKeyRegistration />);
    });

    it('should not have any invalid fields', async () => {
      const nameOrganization = screen.getByLabelText(/Name or Organization/i);
      const email = screen.getByLabelText(/Email/i);

      userEvent.type(nameOrganization, 'MyOrg');
      userEvent.tab();
      userEvent.type(email, 'abc@company.com');
      userEvent.tab();

      await waitFor(() => {
        expect(email).toBeValid();
        expect(nameOrganization).toBeValid();
      });
    });

    it('should enable the Register button', async () => {
      const nameOrganization = screen.getByLabelText(/Name or Organization/i);
      const email = screen.getByLabelText(/Email/i);
      const registerButton = screen.getByRole('button', { name: /Register/i });

      userEvent.type(nameOrganization, 'MyOrg');
      userEvent.tab();
      userEvent.type(email, 'abc@company.com');
      userEvent.tab();

      await waitFor(() => expect(registerButton).toBeEnabled());
    });

    describe('when the Register button is clicked', () => {
      it('should call the networkService.requestApiKey method', async () => {
        const nameOrganization = screen.getByLabelText(/Name or Organization/i);
        const email = screen.getByLabelText(/Email/i);
        const registerButton = screen.getByRole('button', { name: /Register/i });

        userEvent.type(nameOrganization, 'MyOrg');
        userEvent.tab();
        userEvent.type(email, 'abc@company.com');
        userEvent.tab();
        userEvent.click(registerButton);

        await waitFor(() => expect(networkServiceMock.requestApiKey).toHaveBeenCalled());
      });
    });
  });

  describe.skip('when entering invalid data', () => {
    beforeEach(async () => {
      render(<ChplApiKeyRegistration />);
    });

    it('should display Name or Organization as invalid when not entered', async () => {
      const nameOrganization = screen.getByLabelText(/Name or Organization/i);

      userEvent.click(nameOrganization);
      userEvent.tab();

      await waitFor(() => expect(nameOrganization).toBeInvalid());
    });

    it('should display Email as invalid when not entered', async () => {
      const email = screen.getByLabelText(/Email/i);

      userEvent.click(email);
      userEvent.tab();

      await waitFor(() => expect(email).toBeInvalid());
    });

    it('should display Email as invalid when not not a vaild format', async () => {
      const email = screen.getByLabelText(/Email/i);

      userEvent.type(email, 'abc');
      userEvent.tab();

      await waitFor(() => expect(email).toBeInvalid());
    });
  });

  describe.skip('when a response is received from API', () => {
    it('should display a toaster indicating success when the response is success', async () => {
      render(<ChplApiKeyRegistration />);

      const nameOrganization = screen.getByLabelText(/Name or Organization/i);
      const email = screen.getByLabelText(/Email/i);
      const registerButton = screen.getByRole('button', { name: /Register/i });

      userEvent.type(nameOrganization, 'MyOrg');
      userEvent.tab();
      userEvent.type(email, 'abc@company.com');
      userEvent.tab();
      userEvent.click(registerButton);

      await waitFor(() => {
        expect(toasterMock.pop).toHaveBeenCalledWith({
          type: 'success',
          body: 'To confirm your email address, an email was sent to: abc@company.com  Please follow the instructions in the email to obtain your API key.',
        });
      });
    });

    it('should reset the form', async () => {
      render(<ChplApiKeyRegistration />);

      const nameOrganization = screen.getByLabelText(/Name or Organization/i);
      const email = screen.getByLabelText(/Email/i);
      const registerButton = screen.getByRole('button', { name: /Register/i });

      userEvent.type(nameOrganization, 'MyOrg');
      userEvent.tab();
      userEvent.type(email, 'abc@company.com');
      userEvent.tab();
      userEvent.click(registerButton);

      await waitFor(() => {
        expect(nameOrganization).toHaveValue('');
        expect(email).toHaveValue('');
      });
    });

    it('should display a toaster indicating failure of API call', async () => {
      // Overwrite the existing mock to return an rejected Promise
      when(angularReactHelper.getAngularService).calledWith('networkService').mockReturnValue(networkServiceFailureMock);

      render(<ChplApiKeyRegistration />);

      const nameOrganization = screen.getByLabelText(/Name or Organization/i);
      const email = screen.getByLabelText(/Email/i);
      const registerButton = screen.getByRole('button', { name: /Register/i });

      userEvent.type(nameOrganization, 'MyOrg');
      userEvent.tab();
      userEvent.type(email, 'abc@company.com');
      userEvent.tab();
      userEvent.click(registerButton);

      await waitFor(() => {
        expect(toasterMock.pop).toHaveBeenCalledWith({
          type: 'error',
          body: 'ErrorMessage to display',
        });
      });
    });
  });
});
