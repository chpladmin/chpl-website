const elements = {
  cancel: '#action-bar-cancel',
  save: '#action-bar-save',
  errorMessages: '.action-bar__error-messages',
};

class ActionBarComponent {
  constructor () { }

  cancel () {
    $(elements.cancel).click();
  }

  save () {
    $(elements.save).click();
  }

  get errorMessages () {
    return $(elements.errorMessages);
  }
}

export default ActionBarComponent;
