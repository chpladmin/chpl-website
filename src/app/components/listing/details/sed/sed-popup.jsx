import React, { useEffect, useState } from 'react';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  makeStyles,
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import { number } from 'prop-types';

import { useFetchListing } from 'api/listing';
import { ChplDialogTitle } from 'components/util';
import ChplSed from 'components/listing/details/sed/sed';
import { ListingContext } from 'shared/contexts';

const useStyles = makeStyles({
  title: {
    fontSize: '1.25em',
  },
});

function ChplSedPopup({ id }) {
  const [listing, setListing] = useState(undefined);
  const [open, setOpen] = useState(false);
  const { data, isLoading, isSuccess } = useFetchListing({ id, enabled: open });
  const classes = useStyles();

  useEffect(() => {
    if (isLoading || !isSuccess) {
      return;
    }
    setListing(data);
  }, [data, isLoading, isSuccess]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const listingState = {
    listing,
  };

  return (
    <>
      <Button
        color="primary"
        variant="contained"
        size="small"
        id={`view-details-${id}`}
        onClick={handleClickOpen}
        endIcon={<InfoIcon />}
      >
        View
      </Button>
      <Dialog
        onClose={handleClose}
        aria-labelledby="sed-title"
        open={open}
        maxWidth="md"
      >
        <ChplDialogTitle
          id="sed-title"
          onClose={handleClose}
          className={classes.title}
        >
          SED Details
        </ChplDialogTitle>
        <DialogContent dividers>
          { listing
            && (
              <ListingContext.Provider value={listingState}>
                <ChplSed
                  listing={listing}
                />
              </ListingContext.Provider>
            )}
          { !listing
            && (
              <CircularProgress />
            )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ChplSedPopup;

ChplSedPopup.propTypes = {
  id: number.isRequired,
};
