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
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    backgroundColor:"#f2f2f2",
    paddingTop: "16px",
    paddingBottom: "128px",
    marginBottom:"-128px",
  },
});

function ChplStyleGuide() {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <ThemeProvider theme={defaultTheme}>
      <div>
        <Container>
        <Typography variant="h1">Default Material UI</Typography>
        <Elements />
        </Container>
      </div>  
      <div>
        <Container>
        <Typography variant="h1">CHPL Material UI</Typography>
        <ThemeProvider theme={theme}>
        <Elements />
        </ThemeProvider>
        </Container>
      </div>
      </ThemeProvider>
    </div>
  );
}

export default ChplStyleGuide;
