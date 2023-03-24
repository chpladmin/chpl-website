import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { number } from 'prop-types';
import { useSnackbar } from 'notistack';

import { useFetchDevelopers, usePutJoinDevelopers } from 'api/developer';
import { ChplActionBar } from 'components/action-bar';
import { ChplTextField } from 'components/util';
import { getAngularService } from 'services/angular-react-helper';

const useStyles = makeStyles({
  headingPadding: {
    padding: '16px 0',
  },
});

function ChplJoinDevelopers({ id }) {
  const $state = getAngularService('$state');
  const { data, isLoading } = useFetchDevelopers();
  const { mutate } = usePutJoinDevelopers();
  const { enqueueSnackbar } = useSnackbar();
  const [activeDeveloper, setActiveDeveloper] = useState(undefined);
  const [developers, setDevelopers] = useState([]);
  const [developersToJoin, setDevelopersToJoin] = useState([]);
  const [developerValueToLoad, setDeveloperValueToLoad] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    if (isLoading) { return; }
    setActiveDeveloper(data.find((dev) => dev.id === id));
    setDevelopers(data
      .filter((dev) => dev.id !== id)
      .sort((a, b) => (a.name < b.name ? -1 : 1)));
  }, [data, id, isLoading]);

  const addDeveloper = (_, developer) => {
    if (developer) {
      console.log(developer);
      setDevelopersToJoin((prev) => prev.concat(developer));
    }
  };

  const canAdd = (developer) => !developersToJoin.find((dev) => dev.id === developer.id);

  const handleDispatch = (action) => {
    switch (action) {
      case 'cancel':
        $state.go('^');
        break;
      case 'save':
        setIsProcessing(true);
        mutate({
          developer: activeDeveloper,
          developerIds: developersToJoin.map((dev) => dev.id),
        }, {
          onSuccess: () => {
            setIsProcessing(false);
            $state.go('^');
          },
          onError: () => {
            setIsProcessing(false);
            const message = 'An error has occurred';
            enqueueSnackbar(message, {
              variant: 'error',
            });
          },
        });
        break;
        // no default
    }
  };

  const removeDeveloper = (developer) => {
    console.log(developer);
    setDevelopersToJoin((prev) => prev.filter((dev) => dev.id !== developer.id));
  };

  if (isLoading || !activeDeveloper) { return <CircularProgress />; }

  return (
    <>
      <Typography className={classes.headingPadding} variant="h1">
        Join Developers
      </Typography>
      <Card>
        <CardHeader title={`Developers joining ${activeDeveloper.name}`} />
        <CardContent>
          {developersToJoin.length === 0 && 'None selected' }
          {developersToJoin.length > 0
           && (
             <TableContainer>
               <Table>
                 <TableHead>
                   <TableRow>
                     <TableCell>Code</TableCell>
                     <TableCell>Name</TableCell>
                     <TableCell>Status</TableCell>
                     <TableCell><span className="sr-only">Action</span></TableCell>
                   </TableRow>
                 </TableHead>
                 <TableBody>
                   {developersToJoin.map((developer) => (
                     <TableRow key={developer.id}>
                       <TableCell>{developer.developerCode}</TableCell>
                       <TableCell>{developer.name}</TableCell>
                       <TableCell>{developer.status.status}</TableCell>
                       <TableCell>
                         <Button
                           onClick={() => removeDeveloper(developer)}
                         >
                           Remove
                         </Button>
                       </TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
             </TableContainer>
           )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader title={`Select Developers joining ${activeDeveloper.name}`} />
        <CardContent>
          { /* eslint-disable react/jsx-props-no-spreading */}
          <Autocomplete
            id="developers"
            name="developers"
            options={developers}
            onChange={addDeveloper}
            inputValue={developerValueToLoad}
            onInputChange={(event, newValue) => {
              setDeveloperValueToLoad(newValue);
            }}
            getOptionLabel={(item) => `${item.name} (${item.developerCode})`}
            renderInput={(params) => <ChplTextField {...params} label={`Select Developers joining ${activeDeveloper.name}`} />}
          />
          { /* eslint-enable react/jsx-props-no-spreading */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell><span className="sr-only">Action</span></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {developers.map((developer) => (
                  <TableRow key={developer.id}>
                    <TableCell>{developer.developerCode}</TableCell>
                    <TableCell>{developer.name}</TableCell>
                    <TableCell>{developer.status.status}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => addDeveloper(undefined, developer)}
                        disabled={!canAdd(developer)}
                      >
                        Add
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      <ChplActionBar
        dispatch={handleDispatch}
        isDisabled={developersToJoin.length === 0}
        isProcessing={isProcessing}
      />
    </>
  );
}

export default ChplJoinDevelopers;

ChplJoinDevelopers.propTypes = {
  id: number.isRequired,
};
