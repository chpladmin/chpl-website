import ComplaintsComponent from './complaints.po';
import LoginComponent from '../../../components/login/login.po';
import Hooks from '../../../utilities/hooks';

let component, hooks, login;

beforeEach(async () => {
  component = new ComplaintsComponent();
  login = new LoginComponent();
  hooks = new Hooks();
  await hooks.open('#/resources/overview');
});

describe('when logged in as an ADMIN', () => {
  beforeEach(() => {
    login.logIn('admin');
    login.logoutButton.waitForDisplayed();
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
        browser.waitUntil(() => component.getComplaints().length > 0);
      });

      it('should have table headers in a defined order', () => {
        let expectedHeaders = ['ONC-ACB', 'Status', 'Received Date', 'ONC-ACB Complaint Id', 'ONC Complaint Id', 'Complainant Type', 'Actions'];
        let actualHeaders = component.getComplaintsTableHeaders();
        expect(actualHeaders.length).toBe(expectedHeaders.length, 'Found incorrect number of headers');
        actualHeaders.forEach((header, idx) => {
          expect(header.getText()).toBe(expectedHeaders[idx]);
        });
      });

      it('should have a button to download results', () => {
        let button = component.downloadResultsButton;
        expect(button.getText()).toBe('Download 50 displayed results');
        expect(button).toBeClickable();
      });
    });
  });
});

describe('when logged in as an ACB', () => {
  beforeEach(() => {
    login.logIn('drummond');
    login.logoutButton.waitForDisplayed();
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
        browser.waitUntil(() => component.getComplaints().length > 0);
      });

      it('should not have a button to download results', () => {
        let button = component.downloadResultsButton;
        expect(button.isExisting()).toBe(false);
      });
    });
  });
});
