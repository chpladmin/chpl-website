import React from 'react';
import {
  IconButton,
  Typography,
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';

import { ChplTooltip } from 'components/util';

const getFullButton = (text, icon) => (
  <ChplTooltip title={text}>
    <IconButton>
      { icon }
    </IconButton>
  </ChplTooltip>
);

const getStatusIcon = (status) => {
  switch (status.name) {
    case 'Active': return getFullButton(status.name, <InfoIcon />);
    case 'Suspended by ONC':
    case 'Suspended by ONC-ACB':
    case 'Terminated by ONC':
    case 'Withdrawn by Developer Under Surveillance/Review':
    case 'Withdrawn by ONC-ACB':
    case 'Withdrawn by Developer':
    case 'Retired':
    default: return (<Typography>{ status.name }</Typography>);
  }
};

export {
  getStatusIcon, // eslint-disable-line import/prefer-default-export
};
