import React, { useState, useEffect } from 'react';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';

import { ChplTooltip } from '../../../util/chpl-tooltip';
import { getAngularService } from '.';
import requirement from '../../../../shared/prop-types/requirement';
import theme from '../../../../themes/theme';

const useStyles = makeStyles(() => ({
  iconSpacing: {
    marginLeft: '4px',
  },
  unindentedData: {
    marginLeft: '-25px',
  },
}));

function ChplNonconformityView(props) {
  const DateUtil = getAngularService('DateUtil');
  const requirement = useState(props.requirement)[0];
  const dateFormat = 'MMM d, y';

  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <TableContainer component={Paper}>

      </TableContainer>
    </ThemeProvider>
  );
}

export default ChplNonconformityView;

ChplNonconformityView.propTypes = {
  requirement: requirement.isRequired,
};
