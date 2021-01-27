import React from 'react';
import ReactDOM from 'react-dom';

const reactToAngularComponent = (Component) => {
    return {
        controller: function ($element) {
            'ngInject';
            this.$onInit = () => {
                ReactDOM.render(<Component/>, $element[0]);
            };
            this.$onDestroy = () => {
                ReactDOM.unmountComponentAtNode($element[0]);
            };
        },
    };
};

export { reactToAngularComponent };
