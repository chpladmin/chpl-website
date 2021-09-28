import Hooks from '../../../../utilities/hooks';
import AdditionalComponent from './additional.po';

let additional;
let hooks;

beforeEach(() => {
  hooks = new Hooks();
  additional = new AdditionalComponent();
});

afterEach(() => {
  if (additional.icsRelationshipModal.isDisplayed()) {
    additional.closeModal();
    browser.waitUntil(() => !additional.icsRelationshipModal.isDisplayed());
  }
});

describe('the 2015 listing page for listing with ICS value false', () => {
  beforeEach(() => {
    hooks.open('#/listing/9833');
    hooks.waitForSpinnerToAppear();
    hooks.waitForSpinnerToDisappear();
  });

  it('should not display ICS relationship button under additional information', () => {
    additional.additionalHeader.scrollIntoView();
    additional.expandAdditional();
    expect(additional.icsButton.isDisplayed()).toBe(false);
  });
});

describe('the 2015 listing page for listing with ICS value true', () => {
  beforeEach(() => {
    hooks.open('#/listing/10540');
    hooks.waitForSpinnerToAppear();
    hooks.waitForSpinnerToDisappear();
  });

  describe('when expanding additional information', () => {
    beforeEach(() => {
      additional.additionalHeader.scrollIntoView();
      additional.expandAdditional();
    });

    it('should display ICS relationship button under additional information', () => {
      browser.waitUntil(() => additional.icsButton.isDisplayed());
      expect(additional.icsButton.isDisplayed()).toBe(true);
    });

    describe('when clicking on ICS relationship button', () => {
      it('should display ICS relationship modal and compare button after clicking on ICS relationship button', () => {
        additional.icsButton.click();
        browser.waitUntil(() => additional.icsRelationshipModal.isDisplayed());
        expect(additional.icsRelationshipModal.isDisplayed()).toBe(true);
        expect(additional.compareButton.isDisplayed()).toBe(true);
      });
    });
  });
});

describe('the 2014 listing page', () => {
  beforeEach(() => {
    hooks.open('#/listing/8867');
    hooks.waitForSpinnerToAppear();
    hooks.waitForSpinnerToDisappear();
  });

  describe('when expanding additional information', () => {
    beforeEach(() => {
      additional.additionalHeader.scrollIntoView();
      additional.expandAdditional();
    });

    it('should not display ICS relationship button under additional information', () => {
      expect(additional.icsButton.isDisplayed()).toBe(false);
    });

    it('should display test results summary under additional information', () => {
      expect(additional.testResultsSummary.isDisplayed()).toBe(true);
    });
  });
});
