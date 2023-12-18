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
  Typography,
  makeStyles,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import InfoIcon from '@material-ui/icons/Info';

import ChplG1G2Add from './g1g2-add';

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

function ChplG1G2sEdit() {
  const { listing, setListing } = useContext(ListingContext);
  const [addingMeasure, setAddingMeasure] = useState(false);
  const classes = useStyles();

  const getDisplayCriteria = (criteria) => [...new Set(criteria.map((c) => c.number))]
    .map((number) => ({ number, title: 'n/a' }))
    .sort(sortCriteria)
    .map((cc) => cc.number)
    .join('; ');

  const handleDispatch = () => {
    setAddingMeasure(false);
  };

  const remove = (measure) => {
    setListing({
      ...listing,
      measures: listing.measures
        .filter((m) => m.measure.id !== measure.measure.id),
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
        { (listing.edition === null || listing.edition.name === '2015')
          && (
            <Typography>
              Note 170.315 (c)(3) has two versions, so please check the criterion in the “Certification Criteria” section above to determine which version applies here.
            </Typography>
          )}
        <Card className={classes.cardContainer}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Measure Name</TableCell>
                <TableCell>Required Test</TableCell>
                <TableCell>G1/G2?</TableCell>
                <TableCell>Associated Criteria</TableCell>
                <TableCell><span className="sr-only">Action</span></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { listing.measures
                .map((measure) => (
                  <TableRow key={measure.id ?? measure.measure.id}>
                    <TableCell className={measure.measure.removed ? classes.removedText : ''}>
                      <Box display="flex" alignItems="center" gridGap={4}>
                        { measure.measure.removed
                          && (
                            <>
                              Removed |
                              {' '}
                            </>
                          )}
                        { measure.measure.name }
                        { measure.measure.removed
                          && (
                            <ChplTooltip title="This MACRA Measure has been removed from the Program.">
                              <IconButton>
                                <InfoIcon className={classes.infoIconColor} />
                              </IconButton>
                            </ChplTooltip>
                          )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      { measure.measure.requiredTest}
                    </TableCell>
                    <TableCell>
                      { measure.measureType.name}
                    </TableCell>
                    <TableCell>
                      { getDisplayCriteria(measure.associatedCriteria) }
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => remove(measure)}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Card>
        { !addingMeasure
          && (
            <Box>
              <Button
                size="medium"
                color="primary"
                variant="outlined"
                onClick={() => setAddingMeasure(true)}
                endIcon={<AddIcon fontSize="medium" />}
              >
                Add G1/G2 Measure
              </Button>
            </Box>
          )}
        { addingMeasure
          && (
            <>
              <ChplG1G2Add
                dispatch={handleDispatch}
              />
            </>
          )}
      </Box>
    </>
  );
}

export default ChplG1G2sEdit;

ChplG1G2sEdit.propTypes = {
};
