import React from 'react';
import {
  Typography,
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';

const getStatusIcon = (status) => {
  switch (status.name) {
    case 'Active': return (<InfoIcon />);
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
