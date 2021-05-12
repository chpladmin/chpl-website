import ListingPage from '../../../../pages/listing/listing.po';
import Hooks from '../../../../utilities/hooks';
import CqmComponent from './cqm.po';

let cqm; let hooks; let
  page;

describe('the Listing page', () => {
  beforeEach(async () => {
    page = new ListingPage();
    hooks = new Hooks();
    cqm = new CqmComponent();
    hooks.open('#/listing/9833');
    await hooks.waitForSpinnerToDisappear();
  });

  it('should show attested CQMs', () => {
    cqm.cqmHeader.scrollIntoView();
    cqm.expandCqm();
    expect(cqm.cqmCount()).toBe(17);
  });

  describe('when clicked on see all cqms', () => {
    beforeEach(async () => {
      page.seeAll.scrollAndClick();
    });

    it('should display all cqms', () => {
      cqm.cqmHeader.scrollIntoView();
      cqm.expandCqm();
      expect(criteria.criteriaCount()).toBe(100);
    });
  });
});
