import React, { useContext, useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { object } from 'prop-types';

import { ListingContext } from 'shared/contexts';
import { palette, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  accordion: {
    borderRadius: '4px',
    display: 'grid',
    borderColor: palette.divider,
    borderWidth: '.5px',
    borderStyle: 'solid',
  },
  accordionSummary: {
    backgroundColor: `${palette.white} !important`,
    borderRadius: '4px',
    padding: '0 4px',
    borderBottom: `.5px solid ${palette.divider}`,
  },
  summaryText: {
    textTransform: 'none',
  },
  accordionDetails: {
    borderRadius: '0 0 8px 8px',
  },
  rotate: {
    transform: 'rotate(180deg)',
  },
});

function ChplSedParticipantsEdit({ task: initialTask }) {
  const { listing, setListing } = useContext(ListingContext);
  const [allParticipants, setAllParticipants] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [task, setTask] = useState(undefined);
  const classes = useStyles();

  const getIcon = () => (expanded
    ? (
      <>
        <Typography color="primary" variant="body2">Hide Participants</Typography>
        <ExpandMoreIcon color="primary" fontSize="large" className={classes.rotate} />
      </>
    )
    : (
      <>
        <Typography color="primary" variant="body2">Show Participants</Typography>
        <ExpandMoreIcon color="primary" fontSize="large" />
      </>
    ));

  useEffect(() => {
    if (!initialTask) { return; }
    setTask(initialTask);
  }, [initialTask]);

  useEffect(() => {
    if (!listing) { return; }
    setAllParticipants(listing.sed.testTasks.reduce((parts, t) => parts.concat(t.testParticipants.filter((tp) => !parts.some((p) => p.id === tp.id))), [])
      .sort((a, b) => a.id - b.id));
  }, [listing]);

  const handleAccordionChange = () => {
    setExpanded(!expanded);
  };

  const add = (participant) => {
    const updatedTask = {
      ...task,
      testParticipants: task.testParticipants.concat(participant),
    };
    const updatedListing = {
      ...listing,
      sed: {
        ...listing.sed,
        testTasks: listing.sed.testTasks.filter((t) => t.id !== task.id).concat(updatedTask), // figure out new task filtering
      },
    };
    setListing(updatedListing);
  };

  const remove = (participant) => {
    const updatedTask = {
      ...task,
      testParticipants: task.testParticipants.filter((p) => p.id !== participant.id),
    };
    const updatedListing = {
      ...listing,
      sed: {
        ...listing.sed,
        testTasks: listing.sed.testTasks.filter((t) => t.id !== task.id).concat(updatedTask), // figure out new task filtering
      },
    };
    setListing(updatedListing);
  };

  if (!task) { return null; }

  return (
    <Accordion
      className={classes.accordion}
      onChange={handleAccordionChange}
      id={`task-participants-id-${task.id}`}
    >
      <AccordionSummary
        className={classes.accordionSummary}
        expandIcon={getIcon()}
        id={`task-participants-id-${task.id}-header`}
      >
        <Typography variant="subtitle1" className={classes.summaryText}>
          { `${allParticipants.filter((participant) => task.testParticipants.some((p) => p.id === participant.id)).length} Participants Selected`}
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        className={classes.accordionDetails}
        id={`task-participants-id-${task.id}-details`}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Occupation</TableCell>
              <TableCell>Education Type</TableCell>
              <TableCell>Product Experience (Months)</TableCell>
              <TableCell>Professional Experience (Months)</TableCell>
              <TableCell>Computer Experience (Months)</TableCell>
              { /* }
                  <TableCell>Age (Years)</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Assistive Technology Needs</TableCell>
                  { */ }
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allParticipants
              .map((participant) => (
                <TableRow key={participant.id ?? participant.uniqueId}>
                  <TableCell>{ participant.occupation }</TableCell>
                  <TableCell>{ participant.educationTypeName }</TableCell>
                  <TableCell>{ participant.productExperienceMonths }</TableCell>
                  <TableCell>{ participant.professionalExperienceMonths }</TableCell>
                  <TableCell>{ participant.computerExperienceMonths }</TableCell>
                  { /* }
                     <TableCell>{ participant.ageRange }</TableCell>
                     <TableCell>{ participant.gender }</TableCell>
                     <TableCell>{ participant.assistiveTechnologyNeeds }</TableCell>
                     { */ }
                  <TableCell>
                    { task.testParticipants.some((p) => p.id === participant.id)
                      ? (
                        <Button
                          onClick={() => remove(participant)}
                        >
                          Remove
                        </Button>
                      ) : (
                        <Button
                          onClick={() => add(participant)}
                        >
                          Add
                        </Button>
                      )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </AccordionDetails>
    </Accordion>
  );
}

export default ChplSedParticipantsEdit;

ChplSedParticipantsEdit.propTypes = {
  task: object.isRequired, // eslint-disable-line react/forbid-prop-types
};
