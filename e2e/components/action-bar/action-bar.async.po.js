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
    await $(this.elements.save).click();
  }

  async delete() {
    await $(this.elements.delete).click();
  }

  async closeMessages() {
    await $(this.elements.closeMessages).click();
  }

  get errors() {
    return $$(this.elements.errors);
  }

  get warnings() {
    return $$(this.elements.warnings);
  }

  async waitForMessages() {
    await $(this.elements.messages).waitForDisplayed();
  }
}

export default ActionBarComponent;
