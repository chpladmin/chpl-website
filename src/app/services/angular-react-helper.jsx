import React from 'react';
import { createRoot } from 'react-dom/client';

const toBindings = (propTypes) => {
  const bindings = {};
  Object.keys(propTypes).forEach((key) => bindings[key] = '<');
  return bindings;
};

const toProps = (propTypes, ctrl) => {
  const props = {};
  Object.keys(propTypes).forEach((key) => props[key] = ctrl[key]);
  return props;
};

const reactToAngularComponent = (Component) => {
  const propTypes = Component.propTypes || {};
  return {
    bindings: toBindings(propTypes),
    controller($element) {
      'ngInject';

      const root = createRoot($element[0]);
      this.$onChanges = () => {
        const props = toProps(propTypes, this);
        root.render(<Component {...props} />);
      };
      this.$onDestroy = () => {
        root.unmount();
      };
    },
  };
};

const getAngularService = (name) => {
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

export { getAngularService, reactToAngularComponent };
