import React from 'react';
import { UIView } from '@uirouter/react';

// The `id="main-content"` landmark is the target of the "Skip to main content"
// link, so it has to stay on the route shell. Replaces the AngularJS
// `template: '<div id="main-content" tabindex="-1"><ui-view></ui-view></div>'`.
function MainContentView() {
  return (
    <div id="main-content" tabIndex={-1}>
      <UIView />
    </div>
  );
}

export default MainContentView;
