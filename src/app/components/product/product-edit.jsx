import React, { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Container,
  makeStyles,
} from '@material-ui/core';
import {
  arrayOf,
  bool,
  func,
  object,
  string,
} from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ChplActionBar } from 'components/action-bar';
import { ChplTextField } from 'components/util';
import { eventTrack } from 'services/analytics.service';
import { useAnalyticsContext } from 'shared/contexts';
import { utilStyles } from 'themes';

const useStyles = makeStyles({
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
});

const validationSchema = yup.object({
  name: yup.string()
    .required('Product is required')
    .max(300, 'Product is too long'),
  code: yup.string()
    .length(2, 'Product Code must be exactly two characters')
    .matches(/^[A-Za-z0-9_]*$/, 'Product Code must contain only the characters A-Z, a-z, 0-9, and _'),
});

function ChplProductEdit(props) {
  const {
    dispatch,
    errorMessages: initialErrorMessages,
    isInvalid: initialIsInvalid,
    isProcessing,
    isSplitting,
    product,
  } = props;
  const { analytics } = useAnalyticsContext();
  const [errorMessages, setErrorMessages] = useState([]);
  const [isInvalid, setIsInvalid] = useState(false);
  const classes = useStyles();
  let formik;

  useEffect(() => {
    setIsInvalid(initialIsInvalid);
  }, [initialIsInvalid]);

  useEffect(() => {
    setErrorMessages(initialErrorMessages);
  }, [initialErrorMessages]);

  const cancel = () => {
    eventTrack({
      ...analytics,
      event: 'Cancel Product Edit',
    });
    dispatch('cancel');
  };

  const save = () => {
    const updatedProduct = {
      ...product,
      name: formik.values.name,
      code: formik.values.code,
    };
    dispatch('save', updatedProduct);
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
      name: product.name || '',
      code: '',
    },
    onSubmit: () => {
      save();
    },
    validationSchema,
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
              title="New Product"
              component="h5"
              className={classes.header}
            />
          )}
        { !isSplitting
          && (
            <CardHeader
              title={product.name}
              className={classes.header}
              component="h2"
            />
          )}
        <CardContent className={classes.content}>
          <ChplTextField
            id="name"
            name="name"
            label="Name"
            required
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && !!formik.errors.name}
            helperText={formik.touched.name && formik.errors.name}
          />
          { isSplitting
            && (
              <ChplTextField
                id="code"
                name="code"
                label="Product Code"
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
      <ChplActionBar
        dispatch={handleDispatch}
        isDisabled={isActionDisabled()}
        isProcessing={isProcessing}
        errors={errorMessages}
      />
    </Container>
  );
}

export default ChplProductEdit;

ChplProductEdit.propTypes = {
  dispatch: func.isRequired,
  errorMessages: arrayOf(string).isRequired,
  isInvalid: bool.isRequired,
  isProcessing: bool,
  isSplitting: bool.isRequired,
  product: object.isRequired,
};

ChplProductEdit.defaultProps = {
  isProcessing: false,
};
