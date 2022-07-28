import ComplaintsComponent from './complaints.po';
import LoginComponent from '../../login/login.sync.po';
import Hooks from '../../../utilities/hooks';

let hooks;
let login;
let complaintsComponent;

beforeEach(async () => {
  complaintsComponent = new ComplaintsComponent();
  login = new LoginComponent();
  hooks = new Hooks();
  await hooks.open('#/surveillance/complaints');
});

describe('when logged in as an ADMIN', () => {
  beforeEach(() => {
    login.logIn('admin');
  });

  afterEach(() => {
    login.logOut();
  });

  describe('when on the Complaints page', () => {

    describe('after it\'s loaded', () => {
      beforeEach(() => {
        browser.waitUntil(() => hooks.getTableRows().length > 0);
      });

      it('should have table headers in a defined order', () => {
        const expectedHeaders = ['ONC-ACB', 'Status', 'Received Date', 'ONC-ACB Complaint ID', 'ONC Complaint ID', 'Complainant Type', ''];
        const actualHeaders = hooks.getTableHeaders();
        expect(actualHeaders.length).toBe(expectedHeaders.length, 'Found incorrect number of headers');
        actualHeaders.forEach((header, idx) => {
          expect(header.getText()).toContain(expectedHeaders[idx]);
        });
      });

      it('should have a button to download results', () => {
        const button = complaintsComponent.downloadResultsButton;
        expect(button.getText()).toBe('Download all complaints');
        expect(button).toBeClickable();
      });
    });
  });
});

describe('when logged in as an ACB', () => {
  const FIRST_ROW = '1';
  beforeEach(() => {
    login.logIn('drummond');
  });

  afterEach(() => {
    login.logOut();
  });

  describe('when on the Complaints page', () => {

    describe('after it\'s loaded', () => {
      beforeEach(() => {
        browser.waitUntil(() => hooks.getTableRows().length > 0);
      });

      it('should not have a button to download results', () => {
        const button = complaintsComponent.downloadResultsButton;
        expect(button.isExisting()).toBe(false);
      });

      describe('when searching complaints by ONC-ACB Complaint ID, or Associated Criteria', () => {
        
        it('should only show the complaint that has that ONC-ACB Complaint ID', () => {
          const oncAcbComplaintID = 'SC-000093';
          const oncAcbComplaintID_IDX = '4';
          complaintsComponent.searchFilter(oncAcbComplaintID);
          complaintsComponent.waitForUpdatedTableRowCount();
          expect(hooks.getCellValue(FIRST_ROW, oncAcbComplaintID_IDX)).toBe(oncAcbComplaintID);
        });
      });

      describe('when searching complaints by ONC Complaint ID', () => {
        
        it('should only show the complaint that has that ONC Complaint ID', () => {
          const oncComplaintID = 'HIC-2669';
          const oncComplaintID_IDX = '5';
          complaintsComponent.searchFilter(oncComplaintID);
          complaintsComponent.waitForUpdatedTableRowCount();
          expect(hooks.getCellValue(FIRST_ROW, oncComplaintID_IDX)).toBe(oncComplaintID);
        });
      });

      describe('when searching complaints by Associated Certified Product', () => {
        
        it('should only show the complaint that has that Associated Certified Product', () => {
          const chplID = '15.04.04.1221.Soar.15.00.1.180611';
          complaintsComponent.searchFilter(chplID);
          complaintsComponent.waitForUpdatedTableRowCount();
          complaintsComponent.viewButton.click();
          expect(complaintsComponent.complaintsBody()).toContain(chplID);
        });
      });

      describe('when searching complaints by Associated Criteria', () => {
      
          it('should only show the complaint that has that Associated Criteria', () => {
            const criteria = '170.315 (a)(1)';
            complaintsComponent.searchFilter(criteria);
            complaintsComponent.waitForUpdatedTableRowCount();
            complaintsComponent.viewButton.click();
            expect(complaintsComponent.complaintsBody()).toContain(criteria);
          });
      });

      describe('when searching complaints by multiple advanced search options', () => {

        it('should only show the complaints that has all of search options used', () => {
          complaintsComponent.advancedSearch();
          complaintsComponent.chooseAdvanceSearchOption('Complainant Type');
          complaintsComponent.advanceFilterOptions('Anonymous');
          complaintsComponent.advanceFilterOptions('Government_Entity');
          complaintsComponent.advanceFilterOptions('Provider');
          complaintsComponent.advanceFilterOptions('Developer');
          complaintsComponent.advanceFilterOptions('Third__Party_Organization');
          complaintsComponent.chooseAdvanceSearchOption('Status')
          complaintsComponent.advanceFilterOptions('Open');
          for(let i=1; i< hooks.getTableRows().length; i++){
            expect(['Other - [Please Describe]' , 'Patient']).toContain (hooks.getCellValue(i,6));
            expect(hooks.getCellValue(i,2)).toBe('CLOSED');
          }
        });
      });
    });
  });
});
