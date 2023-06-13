import LoginComponent from '../../../components/login/login.po';
import ComplaintsComponent from '../../../components/surveillance/complaints/complaints.po';
import ActionBarComponent from '../../../components/action-bar/action-bar.async.po';
import { open } from '../../../utilities/hooks.async';

let login;
let action;
let complaintsComponent;
const ACB_ID_IDX = 3;

beforeEach(async () => {
  login = new LoginComponent();
  complaintsComponent = new ComplaintsComponent();
  action = new ActionBarComponent();
  await open('#/resources/overview');
});

describe('managing complaints as a ROLE_ADMIN user', () => {
  beforeEach(async () => {
    await login.logIn('admin');
    await open('#/surveillance/complaints');
    await (browser.waitUntil(async () => complaintsComponent.hasResults()));
  });

  afterEach(async () => {
    if (action.errors.length > 0) {
      await action.closeMessages();
    }
    await login.logOut();
  });

  it('should be able to add new complaint for any ONC-ACB, including retired ONC-ACBs', async () => {
    const timestamp = Date.now();
    const fields = {
      body: 'Surescripts LLC (Retired)',
      receivedDate: ['23', 'Jun', 'Tab', '2021'],
      acbId: `Test - ${timestamp}`,
      type: 'Patient',
      summary: `Test Summary - ${timestamp}`,
    };
    await complaintsComponent.addNewComplaint();
    await complaintsComponent.set(fields);
    await complaintsComponent.saveComplaint();
    await (browser.waitUntil(async () => complaintsComponent.hasResults()));
    await complaintsComponent.setFilterFromRetiredList('certificationBodies', 'Surescripts_LLC');
    await complaintsComponent.searchFilter(fields.acbId);
    const complaint = (await complaintsComponent.getTableComplaints())[0];
    await expect(await (await complaintsComponent.getComplaintCell(complaint, ACB_ID_IDX)).getText()).toBe(fields.acbId);
  });
});
