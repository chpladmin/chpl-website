import CorrectiveActionPage from './corrective-action.po';
import Hooks from '../../../utilities/hooks';

let hooks, page;

describe('the Corrective Action collection page', () => {
  beforeEach(async () => {
    page = new CorrectiveActionPage();
    hooks = new Hooks();
    await hooks.open('#/collections/corrective-action');
  });

  describe('after it\'s loaded', () => {
    beforeEach(() => {
      hooks.waitForSpinnerToDisappear();
    });

    it('should have body text', () => {
      expect(page.bodyText.getText()).toBe('This is a list of all health IT products for which a non-conformity has been recorded. A certified product is non-conforming if, at any time, an ONC-Authorized Certification Body (ONC-ACB) or ONC determines that the product does not comply with a requirement of certification. Non-conformities reported as part of surveillance are noted as "Surveillance NCs", while non-conformities identified though an ONC Direct Review are noted as "Direct Review NCs". Not all non-conformities affect a product\'s functionality, and the existence of a non-conformity does not by itself mean that a product is "defective." Developers of certified products are required to notify customers of non-conformities and must take approved corrective actions to address such non-conformities in a timely and effective manner. Detailed information about non-conformities, and associated corrective action plans, can be accessed below by clicking on the product\'s CHPL ID.\nPlease note that by default, only listings that are active or suspended are shown in the search results.');
    });

    it('should have table headers in a defined order', () => {
      let expectedHeaders = ['Edition', 'Developer', 'Product', 'Version', 'CHPL ID','ONC-ACB', '# Open Surveillance NCs', '# Closed Surveillance NCs', '# Open Direct Review NCs', '# Closed Direct Review NCs'];
      let actualHeaders = page.getListingTableHeaders();
      expect(actualHeaders.length).toBe(expectedHeaders.length, 'Found incorrect number of headers');
      actualHeaders.forEach((header, idx) => {
        expect(header.getText()).toBe(expectedHeaders[idx]);
      });
    });
  });
});
