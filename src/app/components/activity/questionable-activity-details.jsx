import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Dialog,
  DialogContent,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InfoIcon from '@material-ui/icons/Info';
import { object } from 'prop-types';

import { useFetchActivity } from 'api/activity';
import { ChplDialogTitle, ChplTooltip } from 'components/util';
import { compareDeveloper } from 'pages/reports/developers/developers.service';
import { compareListing } from 'pages/listing/history/listings.service';
import { compareProduct } from 'pages/reports/products/products.service';
import { compareVersion } from 'pages/reports/versions/versions.service';
import { getDisplayDateFormat } from 'services/date-util';

const useStyles = makeStyles({
  legendTitle: {
    fontSize: '1.25em',
  },
  rowHeader: {
    color: '#156dac',
    fontWeight: 'bold',
  },
});

const getDisplay = (title, value, fullWidth = false) => {
  if (!value) { return null; }
  return (
    <Box width={fullWidth ? '100%' : '48%'} alignItems={fullWidth ? 'flex-start' : 'center'} gridGap="8px" display="flex" justifyContent="space-between">
      <Box display="flex" flexDirection="column" width="100%">
        <Typography variant="subtitle1">
          {title}
        </Typography>
        <Typography>
          {value}
        </Typography>
      </Box>
    </Box>
  );
};

function ChplQuestionableActivityDetails({ activity }) {
  const [details, setDetails] = useState(undefined);
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const { data, isError, isLoading } = useFetchActivity({
    id: activity.activityId,
    isEnabled: open,
  });

  useEffect(() => {
    if (isLoading) { return; }
    if (isError || !data) {
      setDetails(undefined);
      return;
    }
    switch (activity.triggerLevel) {
      case 'Certification Criteria':
      case 'Listing':
        if (data.originalData) {
          setDetails(compareListing(data?.originalData, data?.newData)
            .map((item) => `<li>${item}</li>`)
            .join(''));
        }
        break;
      case 'Developer':
        setDetails(compareDeveloper(data?.originalData, data?.newData)
          .map((item) => `<li>${item}</li>`)
          .join(''));
        break;
      case 'Product':
        setDetails(compareProduct(data?.originalData, data?.newData)
          .map((item) => `<li>${item}</li>`)
          .join(''));
        break;
      case 'Version':
        setDetails(compareVersion(data?.originalData, data?.newData)
          .map((item) => `<li>${item}</li>`)
          .join(''));
        break;
        // no default
    }
  }, [isError, isLoading]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <ChplTooltip title="Activity Details">
        <Button
          id={`view-activity-details-${activity.id}`}
          aria-label="Open Activity Details dialog"
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
        aria-labelledby={`activity-details-${activity.id}-title`}
        open={open}
        maxWidth="sm"
      >
        <ChplDialogTitle
          id={`activity-details-${activity.id}-title`}
          onClose={handleClose}
          className={classes.legendTitle}
        >
          Questionable Activity Details
        </ChplDialogTitle>
        <DialogContent dividers>
          <Box pb={4} display="flex" gridGap="8px" flexWrap="wrap" flexDirection="row" justifyContent="space-between">
            {getDisplay('Trigger Level', activity.triggerLevel)}
            {getDisplay('Trigger Name', activity.triggerName)}
            {getDisplay('Activity Date', getDisplayDateFormat(activity.activityDate))}
            {getDisplay('Acting User', activity.username)}
            {getDisplay('Developer', activity.developerName)}
            {getDisplay('Product', activity.productName)}
            {getDisplay('Version', activity.versionName)}
            {getDisplay('CHPL Product Number', activity.chplProductNumber)}
            {getDisplay('ONC-ACB', activity.acbName)}
            {getDisplay('Description', activity.description)}
            {getDisplay('Certification Status', activity.certificationStatusName)}
            {getDisplay('Certification Status Change Reason', activity.certificationStatusChangeReason, true)}
            {getDisplay('Reason', activity.reason, true)}
          </Box>
          { activity.activityId && details?.length > 0
            && (
              <Accordion variant="outlined">
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography
                    variant="subtitle2"
                  >
                    Activity Details
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ul dangerouslySetInnerHTML={{ __html: details }} />
                </AccordionDetails>
              </Accordion>
            )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ChplQuestionableActivityDetails;

ChplQuestionableActivityDetails.propTypes = {
  activity: object.isRequired,
};
