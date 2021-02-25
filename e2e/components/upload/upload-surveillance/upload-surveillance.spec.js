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

describe('when uploading a surveillance activity as ONC-ACB', () => {
  beforeEach(function () {
    loginComponent.logInWithEmail('acb');
  });

  afterEach(function () {
    loginComponent.logOut();
  });

  it('can upload valid file format of surveillance activity file', () => {
    uploadSurveillanceComponent.uploadSurveillance('../../../resources/surveillance/SAQA1.csv');
    assert.include(uploadSurveillanceComponent.surveillanceUploadText.getText(),'was uploaded successfully.', 'File has uploaded successfully');
  });

  it('can\'t upload invalid file format of surveillance activity file', () => {
    uploadSurveillanceComponent.uploadSurveillance('../../../resources/surveillance/SurveillanceInvalid.csv');
    assert.include(uploadSurveillanceComponent.surveillanceUploadText.getText(),'was not uploaded successfully.', 'File has not uploaded successfully');
  });
});
