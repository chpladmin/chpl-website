import { open } from '../../../utilities/hooks';
import ToastComponent from '../../../components/toast/toast.po';

import ApiPage from './api.po';

let page;
let toast;

describe('the CHPL API page', () => {
  beforeEach(async () => {
    page = new ApiPage();
    toast = new ToastComponent();
    await open('#/resources/api');
  });

  it('should have a title', async () => {
    await expect(await page.getTitle()).toBe('CHPL API');
  });

  it('should have body text', async () => {
    await expect(await page.getBodyText()).toContain('Entire collection of a set of certified products, including all data elements. The file is in a JSON format, and the definition of that structure can be found in the "Schemas" section of the "Certified Health IT Product Listing API" documentation.');
  });
});
