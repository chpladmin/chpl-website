const elements = {
    container: '#toast-container',
    title: '.toast-title',
};

class ToastComponent {
    constructor () { }

    clearAllToast () {
        $(elements.container).$$('div').forEach(toast => toast.click());
    }

    get toastTitle () {
        return $(elements.title);
    }

    get toastContainer () {
        return $(elements.container);
    }
}

export default ToastComponent;
