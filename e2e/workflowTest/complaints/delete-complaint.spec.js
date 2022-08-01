import LoginComponent from '../../components/login/login.po';
import ComplaintsComponent from '../../components/surveillance/complaints/complaints.po';
import ActionBarComponent from '../../components/action-bar/action-bar.async.po';
import {
  open,
  waitForSpinnerToAppear,
  waitForSpinnerToDisappear,
} from '../../utilities/hooks.async';

let login;
let complaintsComponent;
let action;

beforeEach(async () => {
  login = new LoginComponent();
  complaintsComponent = new ComplaintsComponent();
  action = new ActionBarComponent();
  await open('#/surveillance/complaints');
  await waitForSpinnerToDisappear();
});

describe('As a ROLE_ACB user', () => {
  beforeEach(async () => {
    await login.logIn('drummond');
  });

  afterEach(async () => {
    await login.logOut();
  });

  it('should be able to delete complaint', async () => {
    const timestamp = (new Date()).getTime();
    const fields = {
      body: 'Drummond Group',
      receivedDate: '06/23/2021',
      acbId: `Test - ${timestamp}`,
      type: 'Developer',
      summary: `Test Summary - ${timestamp}`,
    };
    await complaintsComponent.addNewComplaint();
    await waitForSpinnerToDisappear();
    await complaintsComponent.set(fields);
    await complaintsComponent.saveComplaint();
    await waitForSpinnerToAppear();
    await waitForSpinnerToDisappear();
    await complaintsComponent.editComplaint(fields.acbId);
    await action.delete();
    await browser.keys('Enter');  // Not able to click on Yes on this window pop up
    await waitForSpinnerToAppear();
    await waitForSpinnerToDisappear();
    await (await complaintsComponent.filter).setValue(fields.acbId);
    await expect(await complaintsComponent.hasNoResults()).toBe(true);
  });
});
