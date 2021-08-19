import React from 'react';
import {
  ThemeProvider,
  Container,
  createMuiTheme,
  makeStyles,
  Typography,
} from '@material-ui/core';

import Elements from './elements';
import theme from '../../../themes/theme';

const defaultTheme = createMuiTheme({});

const useStyles = makeStyles({
  Chplcontainer: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    backgroundColor:"#f2f2f2",
    padding: "32px",
    marginBottom:"-128px",
  },
});

function ChplStyleGuide() {
  const classes = useStyles();
  
  return (
    <div className={classes.Chplcontainer}>
      <ThemeProvider theme={defaultTheme}>
      <div>
        <Typography variant="h1">CHPL Material UI</Typography>
        <ThemeProvider theme={theme}>
        <Elements />
        </ThemeProvider>
      </div>
      <div>
        <Typography variant="h1">Default Material UI</Typography>
        <Elements />
      </div>  
      </ThemeProvider>
    </div>
  );
}

export default ChplStyleGuide;