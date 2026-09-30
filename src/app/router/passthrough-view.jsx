import React from 'react';
import { UIView } from '@uirouter/react';

// A parent state only renders its children if it declares a component that
// contains a <UIView/>; a parent with no component renders nothing at all.
// This is the replacement for the AngularJS `template: '<ui-view/>'` states.
function PassthroughView() {
  return <UIView />;
}

export default PassthroughView;
