import React, { useContext, useState } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  ThemeProvider,
  Typography,
} from '@material-ui/core';
import { func } from 'prop-types';

import {
  useFetchAttestationData,
} from 'api/attestations';
import { UserContext } from 'shared/contexts';
import theme from 'themes/theme';

function ChplAttestationCreate() {
  const { isLoading, data } = useFetchAttestationData();

  return (
    <ThemeProvider theme={theme}>
      <Typography>Create attestation here</Typography>
    </ThemeProvider>
  );
}

export default ChplAttestationCreate;

ChplAttestationCreate.propTypes = {
};
