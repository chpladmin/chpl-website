import Hooks from '../../../../utilities/hooks';

import AdditionalComponent from './additional.po';

let additional;
let hooks;

describe('the Listing details "additional" panel', () => {
  beforeEach(() => {
    hooks = new Hooks();
    additional = new AdditionalComponent();
  });

  describe('for a 2015 listing page for listing with ICS value false', () => {
    it('should not display ICS relationship button under additional information', () => {
      hooks.open('#/listing/9833');
      hooks.waitForSpinnerToDisappear();
      additional.additionalHeader.scrollIntoView();
      additional.expandAdditional();
      expect(additional.additionalInformationPanel).not.toHaveTextContaining('Select a Certified Product to the right');
    });
  });

  describe('for a 2015 listing page for listing with ICS value true', () => {
    beforeEach(() => {
      hooks.open('#/listing/10540');
      hooks.waitForSpinnerToDisappear();
      additional.additionalHeader.scrollIntoView();
      additional.expandAdditional();
    });

    it('should display ICS relationship panel', () => {
      expect(additional.additionalInformationPanel).toHaveTextContaining('Select a Certified Product to the right');
      expect(additional.compareLink.isDisplayed()).toBe(true);
    });
  });

  describe('for a 2014 listing', () => {
    beforeEach(() => {
      hooks.open('#/listing/8867');
      hooks.waitForSpinnerToDisappear();
      additional.additionalHeader.scrollIntoView();
      additional.expandAdditional();
      additional.additionalHeader.scrollIntoView();
    });

    it('should not display ICS relationship button under additional information', () => {
      expect(additional.additionalInformationPanel).not.toHaveTextContaining('Select a Certified Product to the right');
    });

    it('should display test results summary under additional information', () => {
      expect(additional.testResultsSummary.isDisplayed()).toBe(true);
    });
  });
});
