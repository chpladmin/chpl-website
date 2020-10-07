const elements = {
    cancel: '#action-bar-cancel',
    save: '#action-bar-save',
};

class ActionBarComponent {
    constructor () { }

    cancel () {
        $(elements.cancel).click();
    }

    save () {
        $(elements.save).click();
    }
}

export default ActionBarComponent;
