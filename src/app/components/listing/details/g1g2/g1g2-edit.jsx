import React, { useContext, useState } from 'react';
import {
  Chip,
  CircularProgress,
  MenuItem,
  Switch,
  TableCell,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';

import { ChplTextField } from 'components/util';
import { ListingContext } from 'shared/contexts';
import { utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  chips: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '4px',
    marginTop: '4px',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gridGap: '16px',
    alignItems: 'flex-start',
    width: '100%',
  },
  fullWidth: {
    width: '100%',
  },
  versionColumn: {
    width: '216px',
  },
});

function ChplG1G2Edit() {
  const { listing, setListing } = useContext(ListingContext);
  const [measure, setMeasure] = useState({});
  const classes = useStyles();

  const add = (v) => {
    setListing({
      ...listing,
      measures: listing.measures
        .concat({
          measure,
        }),
    });
  };

  if (!listing) {
    return (
      <CircularProgress />
    );
  }

  return (
    <Typography>adding</Typography>
  );
}

export default ChplG1G2Edit;

ChplG1G2Edit.propTypes = {
};
