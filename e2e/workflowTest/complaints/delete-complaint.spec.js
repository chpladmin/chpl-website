import LoginComponent from '../../components/login/login.po';
import Hooks from '../../utilities/hooks';
import ComplaintsPage from '../../pages/surveillance/complaints/complaints.po';
import PaginationComponent from '../../components/pagination/pagination.po';
import ComplaintsComponent from '../../components/surveillance/complaints/complaints.po';

let hooks;
let login;
let page;
let pagination;
let complaints;

beforeEach(async () => {
  login = new LoginComponent();
  hooks = new Hooks();
  page = new ComplaintsPage();
  pagination = new PaginationComponent();
  complaints = new ComplaintsComponent();
  hooks.open('#/surveillance/complaints');
  await hooks.waitForSpinnerToDisappear();
});

describe('As ROLE_ACB user', () => {
  beforeEach(() => {
    login.logIn('drummond');
  });

  afterEach(() => {
    login.logOut();
  });

  it('should be able to delete complaint', () => {
    const timestamp = (new Date()).getTime();
    const fields = {
      body: 'Drummond Group',
      receivedDate: '06/23/2021',
      acbId: `Test - ${timestamp}`,
      type: 'Developer',
      summary: `Test Summary - ${timestamp}`,
    };
    page.addNewComplaint();
    hooks.waitForSpinnerToDisappear();
    complaints.set(fields);
    complaints.saveComplaint();
    hooks.waitForSpinnerToAppear();
    hooks.waitForSpinnerToDisappear();
    complaints.deleteComplaint(fields.acbId);
    hooks.waitForSpinnerToAppear();
    hooks.waitForSpinnerToDisappear();
    complaints.filter.addValue(fields.acbId);
    expect(pagination.pagination.isExisting()).toBe(false);
  });
});
