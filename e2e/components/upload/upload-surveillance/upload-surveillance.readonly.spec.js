import LoginComponent from '../../login/login.sync.po';
import Hooks from '../../../utilities/hooks';

import UploadSurveillanceComponent from './upload-surveillance.po';

let hooks;
let loginComponent;
let uploadSurveillanceComponent;

beforeEach(async () => {
  uploadSurveillanceComponent = new UploadSurveillanceComponent();
  loginComponent = new LoginComponent();
  hooks = new Hooks();
  await hooks.open('#/surveillance/upload');
});

afterEach(() => {
  loginComponent.logOut();
});

describe('when on administration upload page as ONC', () => {
  beforeEach(() => {
    loginComponent.logIn('onc');
    hooks.waitForSpinnerToDisappear();
  });

  it('can\'t see surveillance upload section', () => {
    expect(uploadSurveillanceComponent.root.isDisplayed()).toBe(false);
  });
});

describe('when on administration upload page as admin', () => {
  beforeEach(() => {
    loginComponent.logIn('admin');
    hooks.waitForSpinnerToDisappear();
  });

  it('can see surveillance upload section', () => {
    expect(uploadSurveillanceComponent.root.isDisplayed()).toBe(true);
  });
});

describe('when on administration upload page as ACB', () => {
  beforeEach(() => {
    loginComponent.logIn('drummond');
    hooks.waitForSpinnerToDisappear();
  });

  it('can see surveillance upload section', () => {
    expect(uploadSurveillanceComponent.root.isDisplayed()).toBe(true);
  });
});
