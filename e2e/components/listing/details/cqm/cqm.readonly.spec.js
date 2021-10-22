import ListingPage from '../../../../pages/listing/listing.po';
import Hooks from '../../../../utilities/hooks';
import CqmComponent from './cqm.po';

let cqm;
let hooks;
let page;

beforeEach(async () => {
  page = new ListingPage();
  hooks = new Hooks();
  cqm = new CqmComponent();
});

describe('the 2015 listing page', () => {
  beforeEach(async () => {
    hooks.open('#/listing/9833');
    hooks.waitForSpinnerToDisappear();
    cqm.cqmHeader.scrollIntoView();
    cqm.expandCqm();
  });

  it('should show attested CQMs', () => {
    expect(cqm.cqmCount()).toBeGreaterThan(10);
  });

  describe('when clicked on see all cqms', () => {
    beforeEach(async () => {
      page.seeAll.click();
    });

    it('should display all cqms', () => {
      expect(cqm.cqmCount()).toBe(102);
    });
  });
});

describe('the 2014 listing page', () => {
  beforeEach(async () => {
    hooks.open('#/listing/8490');
    hooks.waitForSpinnerToAppear();
    hooks.waitForSpinnerToDisappear();
    cqm.cqmHeader.scrollIntoView();
    cqm.expandCqm();
  });

  it('should show attested CQMs', () => {
    expect(cqm.cqmCount()).toBeGreaterThan(8);
  });

  describe('when clicked on see all cqms', () => {
    beforeEach(async () => {
      page.seeAll.click();
    });

    it('should display all cqms', () => {
      expect(cqm.cqmCount()).toBe(102);
    });
  });
});
