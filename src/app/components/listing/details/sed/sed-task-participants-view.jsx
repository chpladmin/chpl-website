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
import InfoIcon from '@material-ui/icons/Info';
import { arrayOf, object } from 'prop-types';

import { ChplDialogTitle } from 'components/util';

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
    if (a.educationTypeName !== b.educationTypeName) { return a.educationTypeName < b.educationTypeName ? -1 : 1; }
    if (a.productExperienceMonths !== b.productExperienceMonths) { return a.productExperienceMonths - b.productExperienceMonths; }
    if (a.professionalExperienceMonths !== b.professionalExperienceMonths) { return a.professionalExperienceMonths - b.professionalExperienceMonths; }
    if (a.computerExperienceMonths !== b.computerExperienceMonths) { return a.computerExperienceMonths - b.computerExperienceMonths; }
    return 0;
  });
  const classes = useStyles();

  const handleClickOpen = () => {
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
        endIcon={<InfoIcon />}
      >
        View Participant Details
      </Button>
      <Dialog
        onClose={handleClose}
        aria-labelledby="participant-details-title"
        open={open}
        maxWidth="md"
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
                    <TableRow key={participant.id}>
                      <TableCell>{ participant.occupation }</TableCell>
                      <TableCell>{ participant.educationTypeName }</TableCell>
                      <TableCell>{ participant.productExperienceMonths }</TableCell>
                      <TableCell>{ participant.professionalExperienceMonths }</TableCell>
                      <TableCell>{ participant.computerExperienceMonths }</TableCell>
                      <TableCell>{ participant.ageRange }</TableCell>
                      <TableCell>{ participant.gender }</TableCell>
                      <TableCell>{ participant.assistiveTechnologyNeeds }</TableCell>
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
