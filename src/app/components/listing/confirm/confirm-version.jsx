import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  MenuItem,
  Typography,
  makeStyles,
} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { func, object } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { useFetchVersionsByProduct } from 'api/version';
import { ChplTextField } from 'components/util';
import { version as versionProp } from 'shared/prop-types';

const useStyles = makeStyles({
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
    backgroundColor: '#ffffff',
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
    padding: '32px 0',
    alignItems: 'start',
    paddingBottom: '26vh',
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
});

const validationSchema = yup.object({
  version: yup.string()
    .required('Version is required'),
});

function ChplConfirmVersion({ product, version: initialVersion, dispatch }) {
  const { data, isLoading, isSuccess } = useFetchVersionsByProduct({ id: product.id });
  const [selectedVersion, setSelectedVersion] = useState('');
  const [versions, setVersions] = useState([]);
  const [isCreating, setIsCreating] = useState(true);
  const classes = useStyles();
  let formik;

  useEffect(() => {
    if (isLoading || !isSuccess) { return; }
    setVersions(data
      .sort((a, b) => (a.version < b.version ? -1 : 1)));
  }, [data, isLoading, isSuccess]);

  useEffect(() => {
    const selected = versions.find((p) => p.id === initialVersion.id);
    if (selected) {
      setSelectedVersion(selected);
    }
    setIsCreating(!initialVersion.id || versions.length === 0);
  }, [initialVersion, versions]);

  const handleCreationToggle = (creating) => {
    if (isCreating !== creating) {
      if (isCreating) {
        dispatch('select', selectedVersion);
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
    dispatch('select', event.target.value);
    setSelectedVersion(event.target.value);
  };

  const submit = () => {
    dispatch('edit', {
      version: formik.values.version,
    });
  };

  formik = useFormik({
    initialValues: {
      version: initialVersion?.version || '',
    },
    onSubmit: () => {
      submit();
    },
    validationSchema,
  });

  return (
    <Container maxWidth="md">
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
                    <MenuItem value={item} key={item.id}>
                      { item.version }
                    </MenuItem>
                  ))}
                </ChplTextField>
              </CardContent>
            </Card>
          )}
      </div>
    </Container>
  );
}

export default ChplConfirmVersion;

ChplConfirmVersion.propTypes = {
  version: versionProp.isRequired,
  product: object.isRequired,
  dispatch: func.isRequired,
};
