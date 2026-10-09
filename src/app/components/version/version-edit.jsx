import React from 'react';
import {
  Card, CardHeader, CardContent, Container,
} from '@mui/material';
import {
  arrayOf,
  bool,
  func,
  object,
  string,
} from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ChplActionBar, useActionBar } from 'components/action-bar';
import { ChplTextField } from 'components/util';
import { eventTrack } from 'services/analytics.service';
import { useAnalyticsContext } from 'shared/contexts';
import { utilStyles } from 'themes';

const styles = {
  ...utilStyles,
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    alignItems: 'start',
  },
  header: {
    margin: '0',
    fontSize: '1.25em',
  },
};

const validationSchema = yup.object({
  version: yup.string()
    .required('Version is required')
    .max(300, 'Version is too long'),
  code: yup.string()
    .length(2, 'Version Code must be exactly two characters')
    .matches(/^[A-Za-z0-9_]*$/, 'Version Code must contain only the characters A-Z, a-z, 0-9, and _'),
});

function ChplVersionEdit(props) {
  const {
    dispatch,
    errorMessages,
    isInvalid,
    isProcessing = false,
    isSplitting,
    version,
  } = props;
  const { analytics } = useAnalyticsContext();
  let formik;

  const cancel = () => {
    eventTrack({
      ...analytics,
      event: 'Cancel Version Edit',
    });
    dispatch('cancel');
  };

  const save = () => {
    const updatedVersion = {
      ...version,
      version: formik.values.version,
      code: formik.values.code,
    };
    dispatch('save', updatedVersion);
  };

  const handleDispatch = (action) => {
    switch (action) {
      case 'cancel':
        cancel();
        break;
      case 'save':
        formik.submitForm();
        break;
        // no default
    }
  };

  const isActionDisabled = () => isInvalid || !formik.isValid;

  formik = useFormik({
    initialValues: {
      version: version.version || '',
      code: '',
    },
    onSubmit: () => {
      save();
    },
    validationSchema,
  });

  useActionBar({
    isDisabled: isActionDisabled(),
    isProcessing,
    errors: errorMessages,
  });

  return (
    <Container
      disableGutters
      maxWidth="lg"
    >
      <Card>
        { isSplitting
          && (
            <CardHeader
              title="New Version"
              component="h5"
              sx={styles.header}
            />
          )}
        { !isSplitting
          && (
            <CardHeader
              title={version.version}
              sx={styles.header}
              component="h2"
            />
          )}
        <CardContent sx={styles.content}>
          <ChplTextField
            id="version"
            name="version"
            label="Version"
            required
            value={formik.values.version}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.version && !!formik.errors.version}
            helperText={formik.touched.version && formik.errors.version}
          />
          { isSplitting
            && (
              <ChplTextField
                id="code"
                name="code"
                label="Version Code"
                required
                value={formik.values.code}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.code && !!formik.errors.code}
                helperText={formik.touched.code && formik.errors.code}
              />
            )}
        </CardContent>
      </Card>
      <ChplActionBar dispatch={handleDispatch} />
    </Container>
  );
}

export default ChplVersionEdit;

ChplVersionEdit.propTypes = {
  dispatch: func.isRequired,
  errorMessages: arrayOf(string).isRequired,
  isInvalid: bool.isRequired,
  isProcessing: bool,
  isSplitting: bool.isRequired,
  version: object.isRequired,
};
