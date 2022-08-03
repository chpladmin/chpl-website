import LoginComponent from '../../login/login.po';
import { open } from '../../../utilities/hooks.async';

import ComplaintsComponent from './complaints.po';

let login;
let complaintsComponent;

beforeEach(async () => {
  complaintsComponent = new ComplaintsComponent();
  login = new LoginComponent();
  await open('#/resources/overview');
});

describe('the complaints component', () => {
  describe('when logged in as an ADMIN', () => {
    beforeEach(async () => {
      await login.logIn('admin');
      await open('#/surveillance/complaints');
      await (browser.waitUntil(async () => complaintsComponent.hasResults()));
    });

    afterEach(async () => {
      await login.logOut();
    });

    it('should have table headers in a defined order', async () => {
      const expectedHeaders = ['ONC-ACB', 'Status', 'Received Date', 'ONC-ACB Complaint ID', 'ONC Complaint ID', 'Complainant Type', 'Actions'];
      const actualHeaders = (await complaintsComponent.getHeaders()).map(async (header) => header.getText());
      await expect(actualHeaders.length).toBe(expectedHeaders.length, 'Found incorrect number of headers');
      await expectedHeaders.forEach(async (exp, idx) => expect((await actualHeaders[idx]).includes(exp)).toBe(true));
    });

    it('should have a button to download results', async () => {
      const button = await complaintsComponent.downloadResultsButton;
      await expect(/Download all complaints/i.test(await button.getText())).toBe(true);
    });
  });

  describe('when logged in as ROLE_ACB', () => {
    beforeEach(async () => {
      await login.logIn('drummond');
      await open('#/surveillance/complaints');
      await (browser.waitUntil(async () => complaintsComponent.hasResults()));
    });

    afterEach(async () => {
      await login.logOut();
    });

    it('should not have a button to download results', async () => {
      const button = await complaintsComponent.downloadResultsButton;
      await expect(await button.isExisting()).toBe(false);
    });

    describe('when searching complaints', () => {
      it('should only show the complaint that has that ONC-ACB Complaint ID', async () => {
        const SEARCH_TERM = 'SC-000093';
        const RES_IDX = 3;
        await complaintsComponent.searchFilter(SEARCH_TERM);
        await complaintsComponent.waitForUpdatedTableRowCount();
        const complaints = (await complaintsComponent.getTableComplaints());
        await expect(await (await complaintsComponent.getComplaintCell(complaints[0], RES_IDX)).getText()).toBe(SEARCH_TERM);
      });

      it('should only show the complaint that has that ONC Complaint ID', async () => {
        const SEARCH_TERM = 'HIC-2669';
        const RES_IDX = 4;
        await complaintsComponent.searchFilter(SEARCH_TERM);
        await complaintsComponent.waitForUpdatedTableRowCount();
        const complaints = (await complaintsComponent.getTableComplaints());
        await expect(await (await complaintsComponent.getComplaintCell(complaints[0], RES_IDX)).getText()).toBe(SEARCH_TERM);
      });

      it('should only show the complaint that has that Associated Certified Product', async () => {
        const SEARCH_TERM = '15.04.04.1221.Soar.15.00.1.180611';
        await complaintsComponent.searchFilter(SEARCH_TERM);
        await complaintsComponent.waitForUpdatedTableRowCount();
        await (await complaintsComponent.viewButton).click();
        await expect(await complaintsComponent.complaintsBody()).toContain(SEARCH_TERM);
      });

      it('should only show the complaint that has that Associated Criteria', async () => {
        const SEARCH_TERM = '170.315 (a)(1)';
        await complaintsComponent.searchFilter(SEARCH_TERM);
        await complaintsComponent.waitForUpdatedTableRowCount();
        await (await complaintsComponent.viewButton).click();
        await expect(await complaintsComponent.complaintsBody()).toContain(SEARCH_TERM);
      });

      it('should only show the complaints that has all of search options used', async () => {
        await complaintsComponent.advancedSearch();
        await complaintsComponent.chooseAdvanceSearchOption('Complainant Type');
        await complaintsComponent.advanceFilterOptions('Anonymous');
        await complaintsComponent.advanceFilterOptions('Government_Entity');
        await complaintsComponent.advanceFilterOptions('Provider');
        await complaintsComponent.advanceFilterOptions('Developer');
        await complaintsComponent.advanceFilterOptions('Third__Party_Organization');
        await complaintsComponent.chooseAdvanceSearchOption('Status');
        await complaintsComponent.advanceFilterOptions('Open');
        const complaints = (await complaintsComponent.getTableComplaints());
        complaints.forEach(async (complaint) => {
          await expect(await (await complaintsComponent.getComplaintCell(complaint, 5)).getText()).toContain('Other - [Please Describe]');
          return expect(await (await complaintsComponent.getComplaintCell(complaint, 1)).getText()).toContain('CLOSED');
        });
      });
    });
  });
});
