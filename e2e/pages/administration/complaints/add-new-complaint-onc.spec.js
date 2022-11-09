import LoginComponent from '../../../components/login/login.po';
import ComplaintsComponent from '../../../components/surveillance/complaints/complaints.po';
import { open } from '../../../utilities/hooks.async';

let login;
let complaintsComponent;

beforeEach(async () => {
  login = new LoginComponent();
  complaintsComponent = new ComplaintsComponent();
  await open('#/resources/overview');
});

describe('managing complaints as a ROLE_ONC user', () => {
  beforeEach(async () => {
    await login.logIn('onc');
    await open('#/surveillance/complaints');
    await (browser.waitUntil(async () => complaintsComponent.hasResults()));
  });

  afterEach(async () => {
    await login.logOut();
  });

  it('should not see add new complaint button', async () => {
    await expect(await complaintsComponent.newComplaintButton.isDisplayed()).toBe(false);
  });
});
