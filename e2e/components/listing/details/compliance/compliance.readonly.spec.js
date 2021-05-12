import ListingPage from '../../../../pages/listing/listing.po';
import Hooks from '../../../../utilities/hooks';
import ComplianceComponent from './compliance.po';

let hooks, page, compliance;

describe('the Listing page', () => {
  beforeEach(async() => {
    page = new ListingPage();
    hooks = new Hooks();
    compliance = new ComplianceComponent();
    hooks.open('#/listing/9833');
    await hooks.waitForSpinnerToDisappear();
    });

    it('should display surveillance and Direct review activities under compliance activity', () => {
      compliance.complianceHeader.scrollIntoView();
      compliance.expandCompliance();
      browser.waitUntil(() => compliance.surveillanceHeader.isDisplayed())
      expect(compliance.surveillanceHeader.isDisplayed()).toBe(true);
      expect(compliance.drHeader.isDisplayed()).toBe(true);
    });

    it('should display surveillance activities', () => {
      compliance.complianceHeader.scrollIntoView();
      compliance.expandCompliance();
      compliance.expandSurveillance();
      expect(compliance.survActivity.isDisplayed()).toBe(true);
    });  
});
