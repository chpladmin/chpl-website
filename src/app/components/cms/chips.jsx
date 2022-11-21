import React, { useEffect, useState } from 'react';
import {
  Button,
  Chip,
  FormControlLabel,
  Switch,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { arrayOf, func, string } from 'prop-types';

import { getAngularService } from 'services/angular-react-helper';
import theme from 'themes/theme';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    padding: '16px 32px',
    gap: '8px',
    backgroundColor: '#fafdff',
    borderBottom: '1px solid #bbb',
    boxShadow: 'rgba(149, 157, 165, 0.1) 8px 0 8px',
    flexWrap: 'wrap',
    flexFlow: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    [theme.breakpoints.up('md')]: {
      flexFlow: 'row',
      flexWrap: 'wrap',
    },
  },
}));

function ChplChips(props) {
  const { cmsIds, dispatch } = props;
  const $analytics = getAngularService('$analytics');
  const classes = useStyles();

  const removeChip = (cmsId) => {
    dispatch({ action: 'remove', payload: cmsId});
  };

  return (
    <span className={classes.container} id="chips">
      { cmsIds
        .sort((a, b) => (a < b ? -1 : 1))
        .map((id) => (
          <Chip
            key={id}
            label={id}
            onDelete={() => removeChip(id)}
            color="primary"
            variant="outlined"
          />
      ))}
    </span>
  );
}

export default ChplChips;

ChplChips.propTypes = {
  cmsIds: arrayOf(string).isRequired,
  dispatch: func.isRequired,
};
