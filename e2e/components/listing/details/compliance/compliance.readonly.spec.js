import Hooks from '../../../../utilities/hooks';
import ComplianceComponent from './compliance.po';

let compliance;
let hooks;

beforeEach(() => {
  hooks = new Hooks();
  compliance = new ComplianceComponent();
});
describe('the 2015 listing page', () => {
  beforeEach(() => {
    hooks.open('#/listing/9833');
    hooks.waitForSpinnerToDisappear();
  });

  describe('when expanding compliance activities', () => {
    beforeEach(() => {
      compliance.complianceHeader.scrollIntoView();
      compliance.expandCompliance();
    });

    it('should display surveillance and direct review activities under compliance activity', () => {
      browser.waitUntil(() => compliance.surveillanceHeader.isDisplayed());
      expect(compliance.surveillanceHeader.isDisplayed()).toBe(true);
      expect(compliance.drHeader.isDisplayed()).toBe(true);
    });

    it('should display surveillance activities when expanding surveillance activities', () => {
      compliance.expandSurveillance();
      expect(compliance.survActivity.isDisplayed()).toBe(true);
    });
  });
});
describe('the 2014 listing page', () => {
  beforeEach(() => {
    hooks.open('#/listing/4445');
    hooks.waitForSpinnerToAppear();
    hooks.waitForSpinnerToDisappear();
  });

  describe('when expanding compliance activities', () => {
    beforeEach(() => {
      compliance.complianceHeader.scrollIntoView();
      compliance.expandCompliance();
    });

    it('should display surveillance and direct review activities under compliance activity', () => {
      browser.waitUntil(() => compliance.surveillanceHeader.isDisplayed());
      compliance.surveillanceHeader.scrollIntoView();
      expect(compliance.surveillanceHeader.isDisplayed()).toBe(true);
      expect(compliance.drHeader.isDisplayed()).toBe(true);
    });

    it('should display surveillance activities when expanding surveillance activities', () => {
      compliance.expandSurveillance();
      expect(compliance.survActivity.isDisplayed()).toBe(true);
    });
  });
});
