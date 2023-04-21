import React from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Link,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { arrayOf } from 'prop-types';

import { palette, utilStyles } from 'themes';
import { measure as measureType } from 'shared/prop-types';

const useStyles = makeStyles({
  ...utilStyles,
  infoIcon: {
    color: `${palette.primary}`,
  },
});
function ChplAdditionalinformation() {
  const classes = useStyles();

  return (
    <>
      <Box gridGap={8} display="flex" flexDirection="column">
        <Card>
          <CardHeader title="Certification History" />
          <CardContent>
            <Typography variant="subtitle1">Inherited Certified Status (ICS): </Typography>
            <Typography gutterBottom>True</Typography>
            <Typography variant="subtitle1">Inherits From </Typography>
            <Link gutterBottom>15.04.04.2087.Acui.02.00.1.180409 (Apr 9, 2018)</Link>
            <Typography variant="subtitle1">ICS Source for </Typography>
            <Link gutterBottom>15.04.04.1447.Beac.22.17.1.220511 (May 11, 2022)</Link>
          </CardContent>
          <CardActions>
            <Button variant="contained" color="secondary">Show ICS Relationship</Button>
          </CardActions>
        </Card>
        <Card>
          <CardHeader title="Test Results Summary" />
          <CardContent>
            <Typography>No report on file.</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="Other ACB" />
          <CardContent>
            <Typography>No report on file.</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="Developer Identified Targeted User" />
          <CardContent>
            <Typography>No report on file.</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="Estimated Number of Promoting Interoperability Users" />
          <CardContent>
            No Promoting Interoperability Users data exists.
          </CardContent>
        </Card>
      </Box>
    </>
  );
}

export default ChplAdditionalinformation;

ChplAdditionalinformation.propTypes = {
  measures: arrayOf(measureType).isRequired,
};
