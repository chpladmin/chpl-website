class ActionBarComponent {
  constructor() {
    this.elements = {
      cancel: '#action-bar-cancel',
      save: '#action-bar-save',
      errorMessages: '.action-bar__error-messages',
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
    await $(this.elements.cancel).click();
  }

  async save() {
    await $(this.elements.save).click();
  }

  async yes() {
    await $(this.elements.yes).click();
  }

  async delete() {
    await $(this.elements.delete).click();
  }
}

export default ActionBarComponent;
