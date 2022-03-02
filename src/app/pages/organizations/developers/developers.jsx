import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { useFetchDevelopers } from 'api/developer';
import { ChplTextField } from 'components/util';
import { getAngularService } from 'services/angular-react-helper';

function ChplDevelopers() {
  const $state = getAngularService('$state');
  const DateUtil = getAngularService('DateUtil');
  const { data, isLoading } = useFetchDevelopers();
  const [developers, setDevelopers] = useState([]);
  const [developerValueToLoad, setDeveloperValueToLoad] = useState('');

  useEffect(() => {
    if (isLoading) { return; }
    setDevelopers(data.sort((a, b) => (a.name < b.name ? -1 : 1)));
  }, [data, isLoading]);

  const goToDeveloper = (_, { developerId }) => {
    $state.go('.developer', { developerId });
  };

  return (
    <>
      <Typography variant="h1">
        View Developers
      </Typography>
      { /* eslint-disable react/jsx-props-no-spreading */ }
      <Autocomplete
        id="developers"
        name="developers"
        options={developers}
        onChange={goToDeveloper}
        inputValue={developerValueToLoad}
        onInputChange={(event, newValue) => {
          setDeveloperValueToLoad(newValue);
        }}
        getOptionLabel={(item) => item.name}
        renderInput={(params) => <ChplTextField {...params} label="Choose Developer" />}
      />
      { /* eslint-enable react/jsx-props-no-spreading */ }
      { developers.length > 0
        && (
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
                  <TableRow key={developer.developerId}>
                    <TableCell>{developer.developerCode}</TableCell>
                    <TableCell>{developer.name}</TableCell>
                    <TableCell>{developer.status.status}</TableCell>
                    <TableCell>{DateUtil.getDisplayDateFormat(parseInt(developer.lastModifiedDate, 10))}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
    </>
  );
}

export default ChplDevelopers;

ChplDevelopers.propTypes = {
};
