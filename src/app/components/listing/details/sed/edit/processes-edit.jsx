import React, { useContext, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  makeStyles,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import InfoIcon from '@material-ui/icons/Info';

import ChplProcessAdd from './process-add';

import { ChplTooltip } from 'components/util';
import { sortCriteria } from 'services/criteria.service';
import { ListingContext } from 'shared/contexts';
import { utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  cardContainer: {
    width: '100%',
    maxHeight: '700px',
    overflowY: 'auto',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gridGap: '16px',
    alignItems: 'flex-start',
    width: '100%',
  },
});

function ChplUcdProcessesEdit() {
  const { listing, setListing } = useContext(ListingContext);
  const [addingProcess, setAddingProcess] = useState(false);
  const classes = useStyles();

  const getDisplayCriteria = (criteria) => criteria
    .sort(sortCriteria)
    .map((cc) => cc.number)
    .join('; ');

  const handleDispatch = () => {
    setAddingProcess(false);
  };

  const remove = (process) => {
    // todo
    setListing({
      ...listing,
      sed: {
        ...listing.sed,
        ucdProcesses: listing.sed.ucdProcesses
          .filter((p) => p.name !== process.name),
      },
      //measures: listing.measures
        //.filter((m) => m.measure.id !== measure.measure.id),
    });
  };

  if (!listing) {
    return (
      <CircularProgress />
    );
  }

  return (
    <>
      <Box className={classes.column}>
        <Card className={classes.cardContainer}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>UCD Process</TableCell>
                <TableCell>UCD Process Details</TableCell>
                <TableCell>Associated Criteria</TableCell>
                <TableCell><span className="sr-only">Action</span></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { listing.sed.ucdProcesses
                .map((process) => (
                  <TableRow key={process.name}>
                    <TableCell>
                      { process.name }
                    </TableCell>
                    <TableCell>
                      { process.details}
                    </TableCell>
                    <TableCell>
                      { getDisplayCriteria(process.criteria) }
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => remove(process)}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Card>
        { !addingProcess
          && (
            <Box>
              <Button
                size="medium"
                color="primary"
                variant="outlined"
                onClick={() => setAddingProcess(true)}
                endIcon={<AddIcon fontSize="medium" />}
              >
                Add UCD Process
              </Button>
            </Box>
          )}
        { addingProcess
          && (
            <>
              <ChplProcessAdd
                dispatch={handleDispatch}
              />
            </>
          )}
      </Box>
    </>
  );
}

export default ChplUcdProcessesEdit;

ChplUcdProcessesEdit.propTypes = {
};
