import ComplaintsPage from './complaints.po';
import LoginComponent from '../../../components/login/login.po';
import Hooks from '../../../utilities/hooks';

let page;
let hooks;
let login;

beforeEach(async () => {
  page = new ComplaintsPage();
  login = new LoginComponent();
  hooks = new Hooks();
  await hooks.open('#/resources/overview');
});

describe('when logged in as an ADMIN', () => {
  beforeEach(() => {
    login.logIn('admin');
  });

  afterEach(() => {
    login.logOut();
  });

  describe('when on the Complaints page', () => {
    beforeEach(async () => {
      await hooks.open('#/surveillance/complaints');
    });

    describe('after it\'s loaded', () => {
      beforeEach(() => {
        browser.waitUntil(() => page.getComplaints().length > 0);
      });

      it('should have table headers in a defined order', () => {
        const expectedHeaders = ['ONC-ACB', 'Status', 'Received Date', 'ONC-ACB Complaint ID', 'ONC Complaint ID', 'Complainant Type', ''];
        const actualHeaders = page.getComplaintsTableHeaders();
        expect(actualHeaders.length).toBe(expectedHeaders.length, 'Found incorrect number of headers');
        actualHeaders.forEach((header, idx) => {
          expect(header.getText()).toContain(expectedHeaders[idx]);
        });
      });

      it('should have a button to download results', () => {
        const button = page.downloadResultsButton;
        expect(button.getText()).toBe('Download all complaints');
        expect(button).toBeClickable();
      });
    });
  });
});

describe('when logged in as an ACB', () => {
  beforeEach(() => {
    login.logIn('drummond');
  });

  afterEach(() => {
    login.logOut();
  });

  describe('when on the Complaints page', () => {
    beforeEach(async () => {
      await hooks.open('#/surveillance/complaints');
    });

    describe('after it\'s loaded', () => {
      beforeEach(() => {
        browser.waitUntil(() => page.getComplaints().length > 0);
      });

      it('should not have a button to download results', () => {
        const button = page.downloadResultsButton;
        expect(button.isExisting()).toBe(false);
      });
    });
  });
});
