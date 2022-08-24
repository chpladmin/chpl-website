import LoginComponent from '../../components/login/login.po';
import ComplaintsComponent from '../../components/surveillance/complaints/complaints.po';
import ActionBarComponent from '../../components/action-bar/action-bar.async.po';
import { open } from '../../utilities/hooks.async';

let login;
let complaintsComponent;
let action;

describe('when deleting complaints', () => {
  beforeEach(async () => {
    login = new LoginComponent();
    complaintsComponent = new ComplaintsComponent();
    action = new ActionBarComponent();
    await open('#/resources/overview');
  });

  describe('as a ROLE_ACB user', () => {
    beforeEach(async () => {
      await login.logIn('drummond');
      await open('#/surveillance/complaints');
      await (browser.waitUntil(async () => complaintsComponent.hasResults()));
    });

    afterEach(async () => {
      await login.logOut();
    });

    it('should be able to delete complaints', async () => {
      const timestamp = Date.now();
      const fields = {
        body: 'Drummond Group',
        receivedDate: ['23', 'Jun', 'Tab', '2021'],
        acbId: `Test - ${timestamp}`,
        type: 'Developer',
        summary: `Test Summary - ${timestamp}`,
      };
      await complaintsComponent.addNewComplaint();
      await complaintsComponent.set(fields);
      await complaintsComponent.saveComplaint();
      await (browser.waitUntil(async () => complaintsComponent.hasResults()));
      await complaintsComponent.editComplaint(fields.acbId);
      await action.delete();
      await browser.keys('Enter');
      await (browser.waitUntil(async () => complaintsComponent.hasResults()));
      await (await complaintsComponent.filter).setValue(fields.acbId);
      await (browser.waitUntil(async () => !(await complaintsComponent.hasResults())));
      await expect(await complaintsComponent.hasResults()).toBe(false);
    });
  });
});
