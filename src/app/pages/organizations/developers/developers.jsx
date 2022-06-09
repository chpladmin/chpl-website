import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
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

import { useFetchDevelopers } from 'api/developer';
import { ChplTextField } from 'components/util';
import { getAngularService } from 'services/angular-react-helper';

const useStyles = makeStyles({
  headingPadding: {
    padding: '16px 0',
  },
});

function ChplDevelopers() {
  const $state = getAngularService('$state');
  const DateUtil = getAngularService('DateUtil');
  const { data, isLoading } = useFetchDevelopers();
  const [developers, setDevelopers] = useState([]);
  const [developerValueToLoad, setDeveloperValueToLoad] = useState('');
  const classes = useStyles();
  useEffect(() => {
    if (isLoading) { return; }
    setDevelopers(data.sort((a, b) => (a.name < b.name ? -1 : 1)));
  }, [data, isLoading]);

  const goToDeveloper = (_, { id }) => {
    $state.go('.developer', { id });
  };

  return (
    <>
      <Typography className={classes.headingPadding} variant="h1">
        View Developers
      </Typography>
      { /* eslint-disable react/jsx-props-no-spreading */}
      <Card>
        <CardContent>
          <Autocomplete
            id="developers"
            name="developers"
            options={developers}
            onChange={goToDeveloper}
            inputValue={developerValueToLoad}
            onInputChange={(event, newValue) => {
              setDeveloperValueToLoad(newValue);
            }}
            getOptionLabel={(item) => `${item.name} (${item.developerCode})`}
            renderInput={(params) => <ChplTextField {...params} label="Choose Developer" />}
          />
        </CardContent>
      </Card>
      <br />
      { /* eslint-enable react/jsx-props-no-spreading */}
      {developers.length > 0
          && (
            <Card>
              <CardContent>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Code</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Last modified Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {developers.map((developer) => (
                        <TableRow key={developer.id}>
                          <TableCell>{developer.developerCode}</TableCell>
                          <TableCell>{developer.name}</TableCell>
                          <TableCell>{developer.status.status}</TableCell>
                          <TableCell>{DateUtil.getDisplayDateFormat(parseInt(developer.lastModifiedDate, 10))}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}
    </>
  );
}

export default ChplDevelopers;

ChplDevelopers.propTypes = {
};
