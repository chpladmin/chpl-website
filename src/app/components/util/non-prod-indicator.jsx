import React, { useContext } from 'react';
import {
  Toolbar,
  Typography,
  makeStyles,
} from '@material-ui/core';

import { FlagContext } from 'shared/contexts';

const useStyles = makeStyles({
  toolBar: {
    minHeight: '25px',
    backgroundColor: '#c44f65',
    width: '100%',
    color: '#ffffff',
  },
});

function ChplNonProdIndicator() {
  const { isProduction } = useContext(FlagContext);
  const classes = useStyles();

  if (isProduction) {
    return null;
  }

  return (
    <Toolbar className={classes.toolBar} id="non-prod-indicator">
      <Typography variant="body2" noWrap>
        {
          Array.from({ length: 15 }, (_, idx) => (
            <span key={idx}>
              TEST ENVIRONMENT – DO NOT USE
              <b> | </b>
            </span>
          ))
        }
      </Typography>
    </Toolbar>
  );
}

export default ChplNonProdIndicator;

ChplNonProdIndicator.propTypes = {
};
