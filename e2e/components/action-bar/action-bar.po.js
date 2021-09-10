const elements = {
  cancel: '#action-bar-cancel',
  save: '#action-bar-save',
  errorMessages: '.action-bar__error-messages',
};

class ActionBarComponent {
  constructor () { }

  cancel () {
    $(elements.cancel).scrollAndClick();
  }

  save () {
    $(elements.save).scrollAndClick();
  }

  get errorMessages () {
    return $(elements.errorMessages);
  }
}

export default ActionBarComponent;
