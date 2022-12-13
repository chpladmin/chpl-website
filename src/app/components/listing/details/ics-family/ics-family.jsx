import React, { useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
  FormControlLabel,
  List,
  ListSubheader,
  Popover,
  Switch,
  Typography,
  makeStyles,
} from '@material-ui/core';
import CytoscapeComponent from 'react-cytoscapejs';

function ChplIcsFamily() {
    const elements = [
       { data: { id: 'one', label: 'Node 1' }, position: { x: 0, y: 0 } },
       { data: { id: 'two', label: 'Node 2' }, position: { x: 100, y: 0 } },
       { data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' } }
    ];

  return (
    <> element
      <CytoscapeComponent elements={elements} style={ { width: '600px', height: '600px' } } />
    </>
  );
}

export default ChplIcsFamily;

ChplIcsFamily.propTypes = {
};
