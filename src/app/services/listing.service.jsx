import React from 'react';
import {
  IconButton,
  Typography,
} from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import ErrorIcon from '@material-ui/icons/Error';
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';
import CancelIcon from '@material-ui/icons/Cancel';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import StopIcon from '@material-ui/icons/Stop';

import { ChplTooltip } from 'components/util';
import { palette } from 'themes';

const getFullButton = (text, icon) => (
  <ChplTooltip title={text}>
    <IconButton>
      { icon }
    </IconButton>
  </ChplTooltip>
);

const getStatusIcon = (status) => {
  switch (status.name) {
    case 'Active': return getFullButton(status.name, <CheckCircleIcon htmlColor={palette.active} />);
    case 'Suspended by ONC': return getFullButton(status.name, <IndeterminateCheckBoxIcon htmlColor={palette.warning} />);
    case 'Suspended by ONC-ACB': return getFullButton(status.name, <RemoveCircleIcon htmlColor={palette.warning} />);
    case 'Terminated by ONC': return getFullButton(status.name, <CancelPresentationIcon color="error" />);
    case 'Withdrawn by Developer Under Surveillance/Review': return getFullButton(status.name, <ErrorIcon color="error" />);
    case 'Withdrawn by ONC-ACB': return getFullButton(status.name, <CancelIcon color="error" />);
    case 'Withdrawn by Developer': return getFullButton(status.name, <StopIcon />);
    case 'Retired': return getFullButton(status.name, <AccountBalanceIcon />);
    default: return (<Typography>{ status.name }</Typography>);
  }
};

export {
  getStatusIcon, // eslint-disable-line import/prefer-default-export
};
