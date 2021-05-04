import LoginComponent from '../../../../components/login/login.po';
import BackgroundPage from './background.po';
import Hooks from '../../../../utilities/hooks';

let background, hooks, loginComponent;

beforeEach(async () => {
  loginComponent = new LoginComponent();
  background = new BackgroundPage();
  hooks = new Hooks();
  await hooks.open('#/search');
});

describe('when an ONC-Staff user is logged in', () => {
  beforeEach(() => {
    loginComponent.logIn('oncstaff');
    hooks.open('#/administration/jobs/background');
  });

  it('should see the right set of background jobs', () => {
    const expected = ['MUU Upload','Surveillance Upload'];
    assert.equal(background.backgroundJobRows.length,expected.length);
    // get the existing jobs into a de-duplicated array of jobs
    let rows = [...new Set(background.backgroundJobRows.map(row => row.getText()))];
    // for each of the expected jobs
    expected.forEach(exp => {
      // count how many existing jobs start with the expected job's name (the page object is actually getting the text for the row. A better option would be to get just the text for the cell, but given that page object, this is at least asserting that we're close to the right text)
      let found = rows.filter(row => row.startsWith(exp)).length;
      expect(found).toBe(1, 'did not find expected job: "' + exp + '"');
    });
  });
});
