class ActionBarComponent {
  constructor() {
    this.elements = {
      cancel: '#action-bar-cancel',
      save: '#action-bar-save',
      errorMessages: '.action-bar__error-messages',
      no: '//*[text()="No"]',
      yes: '//*[text()="Yes"]',
      delete: '#action-bar-delete',
    };
  }

  get errorMessages() {
    return $(this.elements.errorMessages);
  }

  get deleteButton() {
    return $(this.elements.delete);
  }

  get saveButton() {
    return $(this.elements.save);
  }

  async cancel() {
    await (await $(this.elements.cancel)).click();
  }

  async save() {
    await (await $(this.elements.save)).click();
  }

  async yes() {
    await (await $(this.elements.yes)).click();
  }

  async no() {
    await (await $(this.elements.no)).click();
  }

  async delete() {
    await (await $(this.elements.delete)).click();
  }
}

export default ActionBarComponent;
