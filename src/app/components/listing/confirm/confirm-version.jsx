import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Switch,
  ThemeProvider,
  Typography,
} from '@material-ui/core';
import { arrayOf, func } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import theme from '../../../themes/theme';
import { version as versionProp } from '../../../shared/prop-types';
import { ChplTextField } from '../../util';

const validationSchema = yup.object({
  version: yup.string()
    .required('Version is required'),
});

function ChplConfirmVersion(props) {
  /* eslint-disable react/destructuring-assignment */
  const version = {
    ...props.version,
  };
  const [selectedVersion, setSelectedVersion] = useState('');
  const versions = props.versions
    .sort((a, b) => (a.version < b.version ? -1 : 1));
  const [isCreating, setIsCreating] = useState(true);
  /* eslint-enable react/destructuring-assignment */

  useEffect(() => {
    const selected = props.versions.filter((p) => p.versionId === props.version.versionId)[0];
    if (selected) {
      setSelectedVersion(selected);
    }
    setIsCreating(!props.version.versionId || props.versions.length === 0);
  }, [props.version, props.versions]); // eslint-disable-line react/destructuring-assignment

  let formik;

  const handleCreationToggle = () => {
    if (isCreating) {
      props.dispatch('select', selectedVersion);
    } else {
      formik.handleSubmit();
    }
    setIsCreating(!isCreating);
  };

  const handleChange = (...args) => {
    formik.handleChange(...args);
    formik.handleSubmit();
  };

  const handleSelectOnChange = (event) => {
    props.dispatch('select', event.target.value);
    setSelectedVersion(event.target.value);
  };

  const submit = () => {
    props.dispatch('edit', {
      version: formik.values.version,
    });
  };

  formik = useFormik({
    initialValues: {
      version: version?.version || '',
    },
    onSubmit: () => {
      submit();
    },
    validationSchema,
  });

  return (
    <ThemeProvider theme={theme}>
      <Paper>
        <form noValidate>
          <Container>
            <Card>
              <CardContent>
                <Grid container spacing={4}>
                  <Grid item xs={4}>
                    Create a version
                  </Grid>
                  <Grid item xs={4}>
                    <Switch
                      id="create-toggle"
                      name="createVersion"
                      color="primary"
                      disabled={versions?.length === 0}
                      checked={!isCreating}
                      onChange={handleCreationToggle}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    { selectedVersion
                      ? (
                        <>
                          Use
                          {' '}
                          { selectedVersion.version }
                        </>
                      ) : (
                        <>
                          Choose a version to use
                        </>
                      )}
                  </Grid>
                </Grid>
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      Version Information
                    </Typography>
                    <Divider />
                  </Grid>
                  { isCreating
                    ? (
                      <Grid container spacing={4}>
                        <Grid item xs={6}>
                          <ChplTextField
                            id="version"
                            name="version"
                            label="Version"
                            value={formik.values.version}
                            error={formik.touched.version && !!formik.errors.version}
                            helperText={formik.touched.version && formik.errors.version}
                            onChange={handleChange}
                            onBlur={formik.handleBlur}
                          />
                        </Grid>
                      </Grid>
                    )
                    : (
                      <Grid container spacing={4}>
                        <Grid item xs={12}>
                          <ChplTextField
                            select
                            id="selected-version"
                            name="selectedVersion"
                            label="Select a Version"
                            required
                            value={selectedVersion}
                            onChange={handleSelectOnChange}
                          >
                            { versions.map((item) => (
                              <MenuItem value={item} key={item.versionId}>
                                { item.version }
                              </MenuItem>
                            ))}
                          </ChplTextField>
                        </Grid>
                      </Grid>
                    )}
                </Grid>
              </CardContent>
            </Card>
          </Container>
        </form>
      </Paper>
    </ThemeProvider>
  );
}

export default ChplConfirmVersion;

ChplConfirmVersion.propTypes = {
  version: versionProp.isRequired,
  versions: arrayOf(versionProp).isRequired,
  dispatch: func.isRequired,
};
