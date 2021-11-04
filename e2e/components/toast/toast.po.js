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

  clearAllToast() {
    if ($(this.container) && $(this.container).$$(this.message)) {
      $(this.container).$$(this.message).forEach((toast) => toast.click());
    }
  }
}

export default ToastComponent;
