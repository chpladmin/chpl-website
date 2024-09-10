import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  makeStyles,
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import { object } from 'prop-types';

import { ChplDialogTitle, ChplTooltip } from 'components/util';
import { compareAcb } from 'pages/reports/acbs/acbs.service';
import { compareDeveloper } from 'pages/reports/developers/developers.service';
import { compareListing } from 'pages/listing/history/listings.service';
import { compareProduct } from 'pages/reports/products/products.service';
import { compareVersion } from 'pages/reports/versions/versions.service';

const useStyles = makeStyles({
  legendTitle: {
    fontSize: '1.25em',
  },
});

const getDetails = (activity) => {
  let compare;
  let details;
  switch (activity.concept) {
    case 'CERTIFICATION_BODY': compare = compareAcb; break;
    case 'CERTIFIED_PRODUCT': compare = compareListing; break;
    case 'DEVELOPER': compare = compareDeveloper; break;
    case 'PRODUCT': compare = compareProduct; break;
    case 'VERSION': compare = compareVersion; break;
      // no default
  }
  if (compare) {
    details = (compare(JSON.parse(activity?.before), JSON.parse(activity?.after))
      .map((item) => `<li>${item}</li>`)
      .join(''));
  } else {
    details = 'TBD';
  }
  return <ul dangerouslySetInnerHTML={{ __html: details }} />;
};

function ChplActivityDetails({ activity }) {
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (!activity.before && activity.after) {
    return (
      <>
        Created
      </>
    );
  }

  if (activity.before && !activity.after) {
    return (
      <>
        Deleted
      </>
    );
  }

  if (![
    'CERTIFICATION_BODY',
    'CERTIFIED_PRODUCT',
    'DEVELOPER',
    'PRODUCT',
    'VERSION',
  ].includes(activity.concept)) {
    return (
      <>
        Edited
      </>
    );
  }

  return (
    <>
      <ChplTooltip title="Activity Details">
        <Button
          id={`view-activity-details-${activity.concept}-${activity.id}`}
          aria-label="Open Activity Details dialog"
          color="secondary"
          variant="contained"
          onClick={handleClickOpen}
          endIcon={<InfoIcon />}
        >
          Edited
        </Button>
      </ChplTooltip>
      <Dialog
        onClose={handleClose}
        aria-labelledby={`activity-details-${activity.concept}-${activity.id}-title`}
        open={open}
        maxWidth="sm"
      >
        <ChplDialogTitle
          id={`activity-details-${activity.concept}-${activity.id}-title`}
          onClose={handleClose}
          className={classes.legendTitle}
        >
          Activity Details
        </ChplDialogTitle>
        <DialogContent dividers>
          { getDetails(activity) }
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ChplActivityDetails;

ChplActivityDetails.propTypes = {
  activity: object.isRequired,
};
