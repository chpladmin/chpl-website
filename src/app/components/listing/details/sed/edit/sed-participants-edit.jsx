import React, { useContext, useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import { object } from 'prop-types';

import ChplSedParticipantAdd from './sed-participant-add';

import { ListingContext } from 'shared/contexts';
import { palette, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  accordion: {
    borderRadius: '4px',
    borderColor: palette.divider,
    borderWidth: '.5px',
    borderStyle: 'solid',
  },
  accordionSummary: {
    backgroundColor: `${palette.secondary} !important`,
    borderRadius: '4px',
    padding: '0 4px',
    fontSize: '1.25em',
    borderBottom: `.5px solid ${palette.divider}`,
  },
  summaryText: {
    textTransform: 'none',
  },
  accordionDetails: {
    borderRadius: '0 0 8px 8px',
    flexDirection: 'column',
    width: '100%',
    maxHeight: '700px',
    overflowY: 'scroll',
    overflowX: 'scroll',
    padding: 0,
  },
  rotate: {
    transform: 'rotate(180deg)',
  },
});

function ChplSedParticipantsEdit({ task: initialTask }) {
  const { listing, setListing } = useContext(ListingContext);
  const [addingParticipant, setAddingParticipant] = useState(false);
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

  const handleDispatch = ({ action, payload }) => {
    if (action === 'add') {
      setAllParticipants((prev) => prev.concat(payload));
    }
    setAddingParticipant(false);
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
        <>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell size="medium">Occupation</TableCell>
                <TableCell size="medium" style={{ minWidth: 150 }}>Education Type</TableCell>
                <TableCell size="medium">Product Experience (Months)</TableCell>
                <TableCell size="medium">Professional Experience (Months)</TableCell>
                <TableCell size="medium">Computer Experience (Months)</TableCell>
                <TableCell size="medium">Age (Years)</TableCell>
                <TableCell size="medium">Gender</TableCell>
                <TableCell size="medium">Assistive Technology Needs</TableCell>
                <TableCell size="medium">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allParticipants
                .map((participant) => (
                  <TableRow key={participant.friendlyId}>
                    <TableCell>{ participant.occupation }</TableCell>
                    <TableCell style={{ minWidth: 150 }}>{ participant.educationType.name }</TableCell>
                    <TableCell>{ participant.productExperienceMonths }</TableCell>
                    <TableCell>{ participant.professionalExperienceMonths }</TableCell>
                    <TableCell>{ participant.computerExperienceMonths }</TableCell>
                    <TableCell>{ participant.age.name }</TableCell>
                    <TableCell>{ participant.gender }</TableCell>
                    <TableCell>{ participant.assistiveTechnologyNeeds }</TableCell>
                    <TableCell>
                      { task.testParticipants.some((p) => (p.friendlyId === participant.friendlyId))
                        ? (
                          <IconButton
                            onClick={() => remove(participant)}
                          >
                            <RemoveCircleOutlineIcon color="error" />
                          </IconButton>
                        ) : (
                          <IconButton
                            onClick={() => add(participant)}
                          >
                            <AddIcon color="primary" />
                          </IconButton>
                        )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </>
      </AccordionDetails>
      <>
        { !addingParticipant
          && (
            <Box paddingX={2} paddingY={2}>
              <Button
                size="medium"
                color="primary"
                variant="outlined"
                onClick={() => setAddingParticipant(true)}
                endIcon={<AddIcon fontSize="medium" />}
              >
                Add Test Participant
              </Button>
            </Box>
          )}
        { addingParticipant
          && (
            <CardContent>
              <ChplSedParticipantAdd
                dispatch={handleDispatch}
              />
            </CardContent>
          )}
      </>
    </Accordion>
  );
}

export default ChplSedParticipantsEdit;

ChplSedParticipantsEdit.propTypes = {
  task: object.isRequired, // eslint-disable-line react/forbid-prop-types
};
