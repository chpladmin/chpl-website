import React from 'react';
import {
  IconButton,
  Typography,
} from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CancelIcon from '@mui/icons-material/Cancel';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import StopIcon from '@mui/icons-material/Stop';

import { ChplTooltip } from 'components/util';
import { palette } from 'themes';

const getFullButton = (text, icon) => (
  <ChplTooltip title={`Certification Status: ${text}`}>
    <IconButton style={{ padding: 0 }} disableFocusRipple disableRipple size="large">
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
