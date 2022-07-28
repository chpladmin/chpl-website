import LoginComponent from '../../login/login.po';
import {
  open, getTableRows, getTableHeaders, getCellValue,
} from '../../../utilities/hooks.async';

import ComplaintsComponent from './complaints.po';

let login;
let complaintsComponent;

beforeEach(async () => {
  complaintsComponent = new ComplaintsComponent();
  login = new LoginComponent();
  await open('#/surveillance/complaints');
});

describe('when logged in as an ADMIN', () => {
  beforeEach(async () => {
    await login.logIn('admin');
  });

  afterEach(async () => {
    await login.logOut();
  });

  describe('when on the Complaints page', () => {
    describe('after it\'s loaded', () => {
      beforeEach(async () => {
        await browser.waitUntil(async () => (await getTableRows()).length > 0);
      });

      it('should have table headers in a defined order', async () => {
        const expectedHeaders = ['ONC-ACB', 'Status', 'Received Date', 'ONC-ACB Complaint ID', 'ONC Complaint ID', 'Complainant Type', ''];
        const actualHeaders = await getTableHeaders();
        await expect(actualHeaders.length).toBe(expectedHeaders.length, 'Found incorrect number of headers');
        for (const [idx, header] of actualHeaders.entries()) {
          await expect(await header.getText()).toContain(expectedHeaders[idx]);
        }
      });

      it('should have a button to download results', async () => {
        const button = await complaintsComponent.downloadResultsButton;
        await expect(await button.getText()).toBe('Download all complaints');
      });
    });
  });
});

describe('when logged in as an ACB', () => {
  const FIRST_ROW = '1';
  beforeEach(async () => {
    await login.logIn('drummond');
  });

  afterEach(async () => {
    await login.logOut();
  });

  describe('when on the Complaints page', () => {
    describe('after it\'s loaded', () => {
      beforeEach(async () => {
        await browser.waitUntil(async () => (await getTableRows()).length > 0);
      });

      it('should not have a button to download results', async () => {
        const button = await complaintsComponent.downloadResultsButton;
        await expect(await button.isExisting()).toBe(false);
      });

      describe('when searching complaints by ONC-ACB Complaint ID, or Associated Criteria', () => {
        it('should only show the complaint that has that ONC-ACB Complaint ID', async () => {
          const oncAcbComplaintID = 'SC-000093';
          const oncAcbComplaintIdIdx = '4';
          await complaintsComponent.searchFilter(oncAcbComplaintID);
          await complaintsComponent.waitForUpdatedTableRowCount();
          await expect(await (await getCellValue(FIRST_ROW, oncAcbComplaintIdIdx))).toBe(oncAcbComplaintID);
        });
      });

      describe('when searching complaints by ONC Complaint ID', () => {
        it('should only show the complaint that has that ONC Complaint ID', async () => {
          const oncComplaintID = 'HIC-2669';
          const oncComplaintIdIdx = '5';
          await complaintsComponent.searchFilter(oncComplaintID);
          await complaintsComponent.waitForUpdatedTableRowCount();
          await expect(await getCellValue(FIRST_ROW, oncComplaintIdIdx)).toBe(oncComplaintID);
        });
      });

      describe('when searching complaints by Associated Certified Product', () => {
        it('should only show the complaint that has that Associated Certified Product', async () => {
          const chplID = '15.04.04.1221.Soar.15.00.1.180611';
          await complaintsComponent.searchFilter(chplID);
          await complaintsComponent.waitForUpdatedTableRowCount();
          await (await complaintsComponent.viewButton).click();
          await expect(await complaintsComponent.complaintsBody()).toContain(chplID);
        });
      });

      describe('when searching complaints by Associated Criteria', () => {
        it('should only show the complaint that has that Associated Criteria', async () => {
          const criteria = '170.315 (a)(1)';
          await complaintsComponent.searchFilter(criteria);
          await complaintsComponent.waitForUpdatedTableRowCount();
          await (await complaintsComponent.viewButton).click();
          await expect(await complaintsComponent.complaintsBody()).toContain(criteria);
        });
      });

      describe('when searching complaints by multiple advanced search options', () => {
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
          for (let i = 1; i < (await getTableRows()).length; i += 1) {
            await expect(['Other - [Please Describe]', 'Patient']).toContain(await (getCellValue(i, 6)));
            await expect(await getCellValue(i, 2)).toBe('CLOSED');
          }
        });
      });
    });
  });
});
