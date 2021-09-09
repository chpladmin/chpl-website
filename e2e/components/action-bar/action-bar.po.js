class ActionBarComponent {
  constructor () {
    this.elements = {
      cancel: '#action-bar-cancel',
      save: '#action-bar-save',
      errorMessages: '.action-bar__error-messages',
      yes: '//*[text()="Yes"]',
      delete: '#action-bar-delete',
    };
   }

  cancel () {
    $(this.elements.cancel).click();
  }

  save () {
    $(this.elements.save).click();
  }

  get errorMessages () {
    return $(this.elements.errorMessages);
  }

  get deleteButton () {
    return $(this.elements.delete);
  }

  get saveButton () {
    return $(this.elements.save);
  }

  yes (){
    $(this.elements.yes).click();
  }

  delete () {
    $(this.elements.delete).click();
  }
}

export default ActionBarComponent;
