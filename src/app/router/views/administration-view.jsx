import React from 'react';
import { makeStyles } from '@material-ui/core';
import { UIView } from '@uirouter/react';

import ChplLoginPage from 'pages/administration/login/login-wrapper';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    minHeight: 0,
  },
});

// /administration with no child state active shows the login page. That came
// from the default content of the AngularJS template's <ui-view>, and UIView
// renders its children the same way. The id="main-content" landmark is the
// skip-link target and has to stay on the shell.
function AdministrationView() {
  const classes = useStyles();

  return (
    <div className={classes.container} id="main-content" tabIndex={-1}>
      <UIView>
        <ChplLoginPage />
      </UIView>
    </div>
  );
}

export default AdministrationView;
