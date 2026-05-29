import React from 'react';
import {
  IconButton,
  Typography,
} from '@material-ui/core';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import CancelIcon from '@material-ui/icons/Cancel';
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import StopIcon from '@material-ui/icons/Stop';

import { ChplTooltip } from 'components/util';
import { palette } from 'themes';

const getFullButton = (text, icon) => (
  <ChplTooltip title={`Certification Status: ${text}`}>
    <IconButton disableRipple>
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
    case 'Withdrawn by Developer': return getFullButton(status.name, <StopIcon color="disabled" />);
    case 'Retired': return getFullButton(status.name, <AccountBalanceIcon color="disabled" />);
    default: return (<Typography>{ status.name }</Typography>);
  }
};

const isListingActive = (listing) => ['Active', 'Suspended by ONC', 'Suspended by ONC-ACB'].includes(listing.currentStatus?.status?.name);

export {
  getStatusIcon,
  isListingActive,
};
