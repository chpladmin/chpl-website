import LoginComponent from '../../components/login/login.sync.po';
import Hooks from '../../utilities/hooks';
import PaginationComponent from '../../components/pagination/pagination.po';
import ComplaintsComponent from '../../components/surveillance/complaints/complaints.po';
import ActionBarComponent from '../../components/action-bar/action-bar.po'
let hooks;
let login;
let pagination;
let complaintsComponent;
let action;

beforeEach(async () => {
  login = new LoginComponent();
  hooks = new Hooks();
  pagination = new PaginationComponent();
  complaintsComponent = new ComplaintsComponent();
  action = new ActionBarComponent();
  hooks.open('#/surveillance/complaints');
  await hooks.waitForSpinnerToDisappear();
});

describe('As a ROLE_ACB user', () => {
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
    complaintsComponent.addNewComplaint();
    hooks.waitForSpinnerToDisappear();
    complaintsComponent.set(fields);
    complaintsComponent.saveComplaint();
    hooks.waitForSpinnerToAppear();
    hooks.waitForSpinnerToDisappear();
    complaintsComponent.editComplaint(fields.acbId);
    action.delete();
    browser.keys('Enter');  //Not able to click on Yes on this window pop up
    hooks.waitForSpinnerToAppear();
    hooks.waitForSpinnerToDisappear();
    complaintsComponent.filter.setValue(fields.acbId);
    expect(pagination.pagination.isExisting()).toBe(false);
  });
});
