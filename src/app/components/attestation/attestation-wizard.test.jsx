import React from 'react';
import {
  cleanup, render, screen,
} from '@testing-library/react';
import { when } from 'jest-when';
import '@testing-library/jest-dom';

import ChplAttestationWizard from './attestation-wizard';

import * as angularReactHelper from 'services/angular-react-helper';

const $stateMock = {
  go: jest.fn(),
};
angularReactHelper.getAngularService = jest.fn();
when(angularReactHelper.getAngularService).calledWith('$state').mockReturnValue($stateMock);

const developerMock = {
};
const dispatchMock = jest.fn();
const periodMock = {
  periodStart: 'start',
  periodEnd: 'end',
};

jest.mock('./attestation-progress', () => ({
  __esModule: true,
  default: function attestationProgress() {
    return (
      <button onClick={() => {}} type="button">mock</button>
    );
    // TODO: figure out how to mock the buttons in this component to trigger the "handleProgressDispatch" function in the unit under test
  },
}));

describe('the ChplAttestationWizard component', () => {
  beforeEach(async () => {
    render(
      <ChplAttestationWizard
        attestationResponses={[]}
        developer={developerMock}
        dispatch={dispatchMock}
        form={{}}
        period={periodMock}
      />,
    );
  });

  afterEach(() => {
    cleanup();
  });

  it('should have a header', () => {
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Section 1 — Introduction');
  });
});
