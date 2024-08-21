import React, { useState } from 'react';
import {
  Button,
  Card,
  Dialog,
  DialogContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  makeStyles,
} from '@material-ui/core';
import { Visibility } from '@material-ui/icons';
import { arrayOf, object } from 'prop-types';

import { ChplDialogTitle } from 'components/util';
import { eventTrack } from 'services/analytics.service';

const useStyles = makeStyles({
  legendTitle: {
    fontSize: '1.25em',
  },
  rowHeader: {
    color: '#156dac',
    fontWeight: 'bold',
  },
});

function ChplSedTaskParticipantsView(props) {
  const [open, setOpen] = useState(false);
  const participants = props.participants.sort((a, b) => { // eslint-disable-line react/destructuring-assignment
    if (a.occupation !== b.occupation) { return a.occupation < b.occupation ? -1 : 1; }
    if (a.educationType.name !== b.educationType.name) { return a.educationType.name < b.educationType.name ? -1 : 1; }
    if (a.productExperienceMonths !== b.productExperienceMonths) { return a.productExperienceMonths - b.productExperienceMonths; }
    if (a.professionalExperienceMonths !== b.professionalExperienceMonths) { return a.professionalExperienceMonths - b.professionalExperienceMonths; }
    if (a.computerExperienceMonths !== b.computerExperienceMonths) { return a.computerExperienceMonths - b.computerExperienceMonths; }
    return 0;
  });
  const classes = useStyles();

  const handleClickOpen = () => {
    eventTrack({
      event: 'View SED Participant Details',
      category: 'Listing Details',
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        id="view-participant-details"
        color="primary"
        variant="outlined"
        onClick={handleClickOpen}
        endIcon={<Visibility />}
      >
        View Participant Details
      </Button>
      <Dialog
        onClose={handleClose}
        aria-labelledby="participant-details-title"
        open={open}
        maxWidth="lg"
      >
        <ChplDialogTitle
          id="participant-details-title"
          onClose={handleClose}
          className={classes.legendTitle}
        >
          SED Participants
        </ChplDialogTitle>
        <DialogContent dividers>
          <Card>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Occupation</TableCell>
                    <TableCell>Education Type</TableCell>
                    <TableCell>Product Experience (Months)</TableCell>
                    <TableCell>Professional Experience (Months)</TableCell>
                    <TableCell>Computer Experience (Months)</TableCell>
                    <TableCell>Age (Years)</TableCell>
                    <TableCell>Gender</TableCell>
                    <TableCell>Assistive Technology Needs</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  { participants.map((participant) => (
                    <TableRow key={participant.friendlyId}>
                      <TableCell size="small">{ participant.occupation }</TableCell>
                      <TableCell size="small">{ participant.educationType.name }</TableCell>
                      <TableCell size="small">{ participant.productExperienceMonths }</TableCell>
                      <TableCell size="small">{ participant.professionalExperienceMonths }</TableCell>
                      <TableCell size="small">{ participant.computerExperienceMonths }</TableCell>
                      <TableCell size="small">{ participant.age.name }</TableCell>
                      <TableCell size="small">{ participant.gender }</TableCell>
                      <TableCell size="small">{ participant.assistiveTechnologyNeeds }</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ChplSedTaskParticipantsView;

ChplSedTaskParticipantsView.propTypes = {
  participants: arrayOf(object).isRequired, // eslint-disable-line react/forbid-prop-types
};
