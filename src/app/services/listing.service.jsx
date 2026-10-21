import React from 'react';
import { IconButton, Typography } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CancelIcon from '@mui/icons-material/Cancel';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import StopIcon from '@mui/icons-material/Stop';

import ChplTooltip from 'components/util/chpl-tooltip';
import { compareStrings } from 'services/sort.service';
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

// The order of the certification status legend, which the status filter and every
// list of statuses follow. Names it doesn't know about go last, by name.
const certificationStatusOrder = [
  'Active',
  'Suspended by ONC',
  'Suspended by ONC-ACB',
  'Terminated by ONC',
  'Withdrawn by Developer Under Surveillance/Review',
  'Withdrawn by ONC-ACB',
  'Withdrawn by Developer',
  'Retired',
];
const getCertificationStatusOrder = (name) => (certificationStatusOrder.includes(name)
  ? certificationStatusOrder.indexOf(name)
  : certificationStatusOrder.length);

// Compares certification status names for sorting, in legend order
const compareCertificationStatuses = (a, b) => getCertificationStatusOrder(a) - getCertificationStatusOrder(b)
  || compareStrings(a, b);

const isListingActive = (listing) => ['Active', 'Suspended by ONC', 'Suspended by ONC-ACB'].includes(listing.currentStatus?.status?.name);

// Listings reach the compare widget in two shapes: search results carry `version.name`
// and `certificationDate` as a yyyy-MM-dd day, full listings carry `version.version` and
// `certificationDay` (their `certificationDate` is a timestamp).
const getVersion = (listing) => listing.version?.version ?? listing.version?.name;
const getCertificationDay = (listing) => listing.certificationDay
  ?? (typeof listing.certificationDate === 'string' ? listing.certificationDate : undefined);

// The order listings show in, shared by the compare widget and the compare page: by
// product name, then version, then earliest certification first. Dates are yyyy-MM-dd,
// which compareStrings orders chronologically.
const compareListingsForDisplay = (a, b) => compareStrings(a.product?.name, b.product?.name)
  || compareStrings(getVersion(a), getVersion(b))
  || compareStrings(getCertificationDay(a), getCertificationDay(b));

export {
  certificationStatusOrder,
  compareCertificationStatuses,
  compareListingsForDisplay,
  getStatusIcon,
  isListingActive,
};
