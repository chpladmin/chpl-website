import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';

import {ChplActionBar} from './action-bar.jsx';

let container = null;

describe('the ChplActionBar component', () => {
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  });

  it('renders', () => {
    act(() => {
      render(<ChplActionBar />, container);
    });
    expect(container.textContent).not.toBeUndefined();
  });

  it('should indicate there are errors', () => {
    act(() => {
      let errors = ['b', 'a'];
      render(<ChplActionBar errorMessages={errors} />, container);
    });
    expect(container.textContent.startsWith('Errors and Warnings')).toBe(true);
  });
});
