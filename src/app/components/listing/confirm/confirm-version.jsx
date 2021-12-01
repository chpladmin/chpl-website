import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  MenuItem,
  ThemeProvider,
  Typography,
  makeStyles,
} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { arrayOf, func } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import theme from '../../../themes/theme';
import { version as versionProp } from '../../../shared/prop-types';
import { ChplTextField } from '../../util';

const useStyles = makeStyles(() => ({
  buttonCard: {
    padding: '32px',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: '#f5f9fd',
    whiteSpace: 'pre-wrap',
  },
  buttonCardFocused: {
    boxShadow: '0px 0px 16px 4px #337ab750',
    fontWeight: '600',
  },
  buttonContent: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    whiteSpace: 'pre-wrap',
  },
  developerConfirm: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '32px',
    padding: '32px',
    alignItems: 'start',
  },
  developerSubContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    alignItems: 'self-start',
    textAlign: 'center',
    gap: '32px',
  },
  developerInfo: {
    display: 'grid',
    gap: '16px',
    flexDirection: 'row',
    gridTemplateColumns: '1fr 1fr',
  },
  extraLargeIcons: {
    marginBottom: '8px',
    fontSize: '2em',
  },
  formContainer: {
    display: 'flex',
    gap: '16px',
    flexDirection: 'column',
  },
  formSubContainer: {
    display: 'grid',
    gap: '16px',
    flexDirection: 'row',
    gridTemplateColumns: '1fr',
  },
  orContainer: {
    display: 'flex',
    gap: '4px',
    flexDirection: 'column',
    paddingTop: '32px',
  },
  rejectButton: {
    backgroundColor: '#c44f65',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#853544',
    },
  },
  selectedDeveloper: {
    fontWeight: '100',
    paddingTop: '8px',
  },
  verticalDivider: {
    height: '25%',
  },
}));

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

  const handleCreationToggle = (creating) => {
    if (isCreating !== creating) {
      if (isCreating) {
        props.dispatch('select', selectedVersion);
      } else {
        formik.handleSubmit();
      }
      setIsCreating(creating);
    }
  };

  const handleChange = (...args) => {
    formik.handleChange(...args);
    formik.handleSubmit();
  };

  const handleSelectOnChange = (event) => {
    props.dispatch('select', event.target.value);
    setSelectedVersion(event.target.value);
  };

  const classes = useStyles();

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
      <Container>
        <div className={classes.developerConfirm}>
          <div className={classes.developerSubContainer}>
            <Button
              variant="outlined"
              color="default"
              fullWidth
              disabled={versions?.length === 0}
              className={`${classes.buttonCard} ${!isCreating ? classes.buttonCardFocused : ''}`}
              onClick={() => handleCreationToggle(false)}
            >
              <span className={classes.buttonContent}>
                <CheckCircleIcon color="primary" className={classes.extraLargeIcons} />
                { selectedVersion
                  ? (
                    <>
                      {`Use "${selectedVersion.version}"`}
                    </>
                  ) : (
                    <>
                      Choose A Version To Use
                    </>
                  )}
              </span>
            </Button>
            <div className={classes.orContainer}>
              <Divider />
              <Typography>OR</Typography>
              <Divider />
            </div>
            <Button
              variant="outlined"
              color="default"
              fullWidth
              className={`${classes.buttonCard} ${isCreating ? classes.buttonCardFocused : ''}`}
              onClick={() => handleCreationToggle(true)}
            >
              <span className={classes.buttonContent}>
                <AddCircleIcon color="primary" className={classes.extraLargeIcons} />
                Create A Version
              </span>
            </Button>
          </div>
          <Divider />
          { isCreating
            ? (
              <Card>
                <CardHeader title="Create A New Version" />
                <CardContent>
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
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader title="Existing Versions" />
                <CardContent>
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
                </CardContent>
              </Card>
            )}
        </div>
      </Container>
    </ThemeProvider>
  );
}

export default ChplConfirmVersion;

ChplConfirmVersion.propTypes = {
  version: versionProp.isRequired,
  versions: arrayOf(versionProp).isRequired,
  dispatch: func.isRequired,
};
