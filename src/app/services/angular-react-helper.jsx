import React from 'react';
import ReactDOM from 'react-dom';

const toBindings = propTypes => {
  const bindings = {};
  Object.keys(propTypes).forEach(key => bindings[key] = '<');
  return bindings;
};

const toProps = (propTypes, ctrl) => {
  const props = {};
  Object.keys(propTypes).forEach(key => props[key] = ctrl[key]);
  return props;
};

const reactToAngularComponent = Component => {
  const propTypes = Component.propTypes || {};
  return {
    bindings: toBindings(propTypes),
    controller: function ($element) {
      'ngInject';
      this.$onChanges = () => {
        const props = toProps(propTypes, this);
        ReactDOM.render(<Component {...props} />, $element[0]);
      };
      this.$onDestroy = () => {
        ReactDOM.unmountComponentAtNode($element[0]);
      };
    },
  };
};

const getAngularService = name => {
  const injector = angular.element(document.body).injector();
  if (!injector || !injector.get) {
    throw new Error(`Couldn't find angular injector to get "${name}" service`);
  }

  const service = injector.get(name);
  if (!service) {
    throw new Error(`Couldn't find "${name}" angular service`);
  }

  return service;
};

export {getAngularService, reactToAngularComponent};
u
