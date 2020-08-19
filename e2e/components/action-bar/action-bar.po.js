const elements = {
    save: '#action-bar-save',
}

class ActionBarComponent {
    constructor () { }

    save () {
        $(elements.save).click();
    }
}

export default ActionBarComponent;
