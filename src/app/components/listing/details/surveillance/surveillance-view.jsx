import React, { useState } from 'react';
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
import surveillance from '../../../../shared/prop-types/surveillance';
import theme from '../../../../themes/theme';

const useStyles = makeStyles(() => ({
  iconSpacing: {
    marginLeft: '4px',
  },
  unindentedData: {
    marginLeft: '-25px',
  },
}));

function ChplSurveillanceView(props) {
  const surv = useState(props.surveillance)[0];

  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <TableContainer component={Paper}>
        <Table aria-label="Surveillance Table">
          <TableHead>
            <TableRow>
              <TableCell
                style={{ width: '33%' }}
              >
                Attribute
              </TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow key="additionalSoftware">
              <TableCell component="th" scope="row">
                Date Surveillance Began
                <ChplTooltip title="The date surveillance was initiated">
                  <InfoOutlinedIcon
                    className={classes.iconSpacing}
                  />
                </ChplTooltip>
              </TableCell>
              <TableCell>{ surv.startDate }</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </ThemeProvider>
  );
}

export default ChplSurveillanceView;

ChplSurveillanceView.propTypes = {
  surveillance: surveillance.isRequired,
};
