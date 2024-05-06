class ToastComponent {
  constructor() {
    this.container = '#toast-container';
    this.title = '.toast-title';
    this.message = '.toast-message>div';
  }

  get toastTitle() {
    return $(this.title);
  }

  get toastContainer() {
    return $(this.container);
  }

  get toastMessage() {
    return $(this.message);
  }

  async clearAllToast() {
    if (await $(this.container) && (await (await $(this.container)).$$(this.message))) {
      let codemod_placeholder_1462 = await (await $(this.container)).$$(this.message);

      for (const toast of codemod_placeholder_1462) {
        await toast.click();
      }
    }
  }
}

export default ToastComponent;
