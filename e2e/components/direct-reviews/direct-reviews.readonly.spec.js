import DevelopersPage from '../../pages/organizations/developers/developers.async.po';
import { open } from '../../utilities/hooks';

import DirectReviewsComponent from './direct-reviews.po';

let component;
let page;

beforeEach(async () => {
  page = new DevelopersPage();
  component = new DirectReviewsComponent();
  await open('#/organizations/developers');
});

describe('the Direct Reviews component', () => {
  describe('for Radysans, Inc', () => {
    beforeEach(async () => {
      await page.selectDeveloper('Radysans, Inc');
    });

    it('should indicate the absence of DRs', async () => {
      await expect(await (await component.getDirectReviews()).getText()).toContain('No Direct Reviews have been conducted');
    });
  });
});
