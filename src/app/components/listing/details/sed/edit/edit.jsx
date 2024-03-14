import React, { useContext, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import ChplSedDetailsEdit from './details';
import ChplSedTaskAdd from './sed-task-add';
import ChplSedTaskEdit from './sed-task-edit';
import ChplUcdProcessesEdit from './processes-edit';

import { ListingContext } from 'shared/contexts';

const sortTestTasks = (a, b) => (a.description < b.description ? -1 : 1);

function ChplSedEdit() {
  const { listing } = useContext(ListingContext);
  const [addingTask, setAddingTask] = useState(false);

  const handleDispatch = () => {
    setAddingTask(false);
  };

  if (!listing) {
    return (
      <CircularProgress />
    );
  }

  return (
    <Box display="flex" gridGap={16} flexDirection="column">
      <Card>
        <CardHeader title="SED Summary" />
        <CardContent>
          <ChplSedDetailsEdit />
        </CardContent>
      </Card>
      <Card>
        <CardHeader title="SED Tested Certification Criteria &amp; Associated UCD Processes" />
        <CardContent>
          <ChplUcdProcessesEdit />
        </CardContent>
      </Card>
      { (listing.edition === null || listing.edition.name === '2015')
        && (
          <Card>
            <CardHeader title="SED Testing Tasks" />
            <CardContent>
              { listing.sed.testTasks
                .sort(sortTestTasks)
                .map((task) => (
                  <ChplSedTaskEdit
                    key={task.id ?? task.uniqueId}
                    task={task}
                  />
                ))}
              { !addingTask
                && (
                  <Box pt={4}>
                    <Button
                      size="medium"
                      color="primary"
                      variant="outlined"
                      onClick={() => setAddingTask(true)}
                      endIcon={<AddIcon fontSize="medium" />}
                    >
                      Add Test Task
                    </Button>
                  </Box>
                )}
              { addingTask
                && (
                  <ChplSedTaskAdd
                    dispatch={handleDispatch}
                  />
                )}
            </CardContent>
          </Card>
        )}
    </Box>
  );
}

export default ChplSedEdit;

ChplSedEdit.propTypes = {
};
