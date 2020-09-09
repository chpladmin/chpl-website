const elements = {
    container: '#toast-container',
};

class ToastComponent {
    constructor () { }

    clearAllToast () {
        $(elements.container).$$('div').forEach(toast => toast.click());
    }
}

export default ToastComponent;
