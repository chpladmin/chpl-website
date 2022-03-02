import React, { useContext, useEffect, useState } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  arrayOf, func, string,
} from 'prop-types';

import { useFetchDevelopers } from 'api/developer';
import { ChplTextField } from 'components/util';

function ChplDevelopers(props) {
  const {data, isLoading} = useFetchDevelopers();
  const [developerToLoad, setDeveloperToLoad] = useState(null);
  const [developerValueToLoad, setDeveloperValueToLoad] = useState('');

  const goToDeveloper = (event, newValue) => {
    console.log({event, newValue});
  };

  return (
    <>
      { !isLoading
        && (
          <>
              { /* eslint-disable react/jsx-props-no-spreading */ }
              <Autocomplete
                id="developers"
                name="developers"
                options={data}
                value={developerToLoad}
                onChange={goToDeveloper}
                inputValue={developerValueToLoad}
                onInputChange={(event, newValue) => {
                  setDeveloperValueToLoad(newValue);
                }}
                getOptionLabel={(item) => item.name}
                renderInput={(params) => <ChplTextField {...params} label="Choose Developer" />}
              />
          { /* eslint-enable react/jsx-props-no-spreading */ }
          </>
        )}
    </>
  );
}

export default ChplDevelopers;

ChplDevelopers.propTypes = {
};
