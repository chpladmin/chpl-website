import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  makeStyles,
} from '@material-ui/core';
import { func } from 'prop-types';
import EditIcon from '@material-ui/icons/Edit';
import EventIcon from '@material-ui/icons/Event';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

import { ChplSortableHeaders, sortComparator } from 'components/util/sortable-headers';
import { BreadcrumbContext, UserContext } from 'shared/contexts';

import ChplSvapsView from './svaps-view';

const headers = [
  { property: 'citation', text: 'Regulatory Text Citation', sortable: true },
  { property: 'standard', text: 'Approved Standard Version', sortable: true },
  { property: 'criteria', text: 'Applicable Criteria' },
  { property: 'replaced', text: 'Replaced', sortable: true },
  { property: 'actions', text: 'Action', invisible: true },
];

const useStyles = makeStyles({
  container: {
    maxHeight: '64vh',
  },
  firstColumn: {
    position: 'sticky',
    left: 0,
    boxShadow: 'rgba(149, 157, 165, 0.1) 0px 4px 8px',
    backgroundColor: '#fff',
  },
  breadcrumbs: {
    textTransform: 'none',
  },
});

const resetBreadcrumbs = (append, drop, classes, dispatch) => {
  drop('standards.disabled');
  append(
    <Button
      key="standards"
      variant="text"
      className={classes.breadcrumbs}
      onClick={() => dispatch('reset')}
    >
      Standards &amp; Processes
    </Button>,
    <Button
      key="svaps.viewall.disabled"
      variant="text"
      className={classes.breadcrumbs}
      disabled
    >
      SVAP Maintenance
    </Button>,
  );
};

function ChplSvaps(props) {
  const { dispatch } = props;
  const { append, drop } = useContext(BreadcrumbContext);
  const [activeSvap, setActiveSvap] = useState(undefined);
  const [svaps, setSvaps] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    resetBreadcrumbs(append, drop, classes, dispatch);
  }, []);

  const handleDispatch = (action, payload) => {
    switch (action) {
      case 'cancel':
        setActiveSvap(undefined);
        break;
        // no default
      case 'edit':
        setActiveSvap(payload);
        break;
        // no default
    }
  };

  if (activeSvap) {
    return (
      <>
        <Button
          onClick={() => handleDispatch('cancel')}
        >
          Cancel
        </Button>
        active svap
      </>
    );
  }

  return (
    <Card>
      <CardHeader title="SVAP Maintenance" />
      <CardContent>
        <ChplSvapsView
          svaps={svaps}
          dispatch={handleDispatch}
        />
      </CardContent>
    </Card>
  );
}

export default ChplSvaps;

ChplSvaps.propTypes = {
  dispatch: func.isRequired,
};
