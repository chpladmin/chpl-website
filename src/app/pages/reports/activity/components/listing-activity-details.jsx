import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InfoIcon from '@material-ui/icons/Info';
import { object } from 'prop-types';

import { ChplDialogTitle, ChplTooltip } from 'components/util';
import { compareListing } from 'pages/listing/history/listings.service';

const useStyles = makeStyles({
  legendTitle: {
    fontSize: '1.25em',
  },
});

function ChplListingActivityDetails({ activity }) {
  const [details, setDetails] = useState(undefined);
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    switch (activity.concept) {
      case 'CERTIFIED_PRODUCT':
        if (activity.before) {
          setDetails(compareListing(JSON.parse(activity?.before), JSON.parse(activity?.after))
                     .map((item) => `<li>${item}</li>`)
                     .join(''));
        }
        break;
      default:
          setDetails('TBD');
    };
  }, [activity]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <ChplTooltip title="Listing Activity Details">
        <Button
          id={`view-listing-activity-details-${activity.id}`}
          aria-label="Open Listing Activity Details dialog"
          color="secondary"
          variant="contained"
          onClick={handleClickOpen}
          endIcon={<InfoIcon />}
        >
          Details
        </Button>
      </ChplTooltip>
      <Dialog
        onClose={handleClose}
        aria-labelledby={`listing-activity-details-${activity.id}-title`}
        open={open}
        maxWidth="sm"
      >
        <ChplDialogTitle
          id={`listing-activity-details-${activity.id}-title`}
          onClose={handleClose}
          className={classes.legendTitle}
        >
          Listing Activity Details
        </ChplDialogTitle>
        <DialogContent dividers>
          { details?.length > 0
            && (
              <ul dangerouslySetInnerHTML={{ __html: details }} />
            )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ChplListingActivityDetails;

ChplListingActivityDetails.propTypes = {
  activity: object.isRequired,
};
