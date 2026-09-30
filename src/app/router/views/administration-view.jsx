import React from 'react';
import { UIView } from '@uirouter/react';

import ChplLoginPage from 'pages/administration/login/login-wrapper';

// /administration with no child state active shows the login page. That came
// from the default content of the AngularJS template's <ui-view>, and UIView
// renders its children the same way. The id="main-content" landmark is the
// skip-link target and has to stay on the shell.
function AdministrationView() {
  return (
    <div id="main-content" tabIndex={-1}>
      <UIView>
        <ChplLoginPage />
      </UIView>
    </div>
  );
}

export default AdministrationView;
