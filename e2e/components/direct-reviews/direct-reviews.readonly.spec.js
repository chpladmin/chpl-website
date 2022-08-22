import DevelopersPage from '../../pages/organizations/developers/developers.po';
import Hooks from '../../utilities/hooks';

import DirectReviewsComponent from './direct-reviews.po';

let component;
let hooks;
let page;

beforeEach(async () => {
  page = new DevelopersPage();
  component = new DirectReviewsComponent();
  hooks = new Hooks();
  await hooks.open('#/organizations/developers');
});

describe('the Direct Reviews component', () => {
  describe('for Radysans, Inc', () => {
    beforeEach(() => {
      page.selectDeveloper('Radysans, Inc');
    });

    it('should indicate the absence of DRs', () => {
      expect(component.getDirectReviews().getText()).toContain('No Direct Reviews have been conducted');
    });

    it('should indicate the "freshness" of the data', () => {
      expect(component.getDirectReviews().getText()).toContain('Current as of');
    });
  });
});
