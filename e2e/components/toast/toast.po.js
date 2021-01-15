const elements = {
    container: '#toast-container',
    title: '.toast-title',
};

class ToastComponent {
    constructor () { }

    clearAllToast () {
        $(elements.container).$$('div').forEach(toast => toast.click());
    }

    get title () {
        return $(elements.title);
    }

    get toastContainer () {
        return $(elements.container);
    }
}

export default ToastComponent;
