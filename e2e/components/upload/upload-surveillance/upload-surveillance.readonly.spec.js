import UploadSurveillanceComponent from './upload-surveillance.po';
import LoginComponent from '../../login/login.po';
import Hooks from '../../../utilities/hooks';

let hooks, loginComponent, uploadSurveillanceComponent;

beforeEach(async () => {
  uploadSurveillanceComponent = new UploadSurveillanceComponent();
  loginComponent = new LoginComponent();
  hooks = new Hooks();
  await hooks.open('#/surveillance/upload');
});

describe('when on administration upload page as ONC', () => {

  beforeEach(function () {
    loginComponent.logIn('onc');
    hooks.waitForSpinnerToDisappear();
  });

  it('can\'t see surveillance upload section', () => {
    expect(uploadSurveillanceComponent.root.isDisplayed()).toBe(false);
  });
});
