class ActionBarComponent {
  constructor() {
    this.elements = {
      save: '#action-bar-save',
      delete: '#action-bar-delete',
      messages: '#action-bar-messages',
      errors: '#action-bar-errors > ul > li',
      warnings: '#action-bar-warnings > ul > li',
      closeMessages: '#action-bar-messages-close',
    };
  }

  async save() {
    await (await $(this.elements.save)).click();
  }

  async delete() {
    await (await $(this.elements.delete)).click();
  }

  async closeMessages() {
    await (await $(this.elements.closeMessages)).click();
  }

  get errors() {
    return $$(this.elements.errors);
  }

  get warnings() {
    return $$(this.elements.warnings);
  }

  async waitForMessages() {
    await (await $(this.elements.messages)).waitForDisplayed();
  }
}

export default ActionBarComponent;
