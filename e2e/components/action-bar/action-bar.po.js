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

  save() {
    $(this.elements.save).click();
  }

  delete() {
    $(this.elements.delete).click();
  }

  closeMessages() {
    $(this.elements.closeMessages).click();
  }

  get errors() {
    return $$(this.elements.errors);
  }

  get warnings() {
    return $$(this.elements.warnings);
  }

  waitForMessages() {
    $(this.elements.messages).waitForDisplayed();
  }
}

export default ActionBarComponent;
