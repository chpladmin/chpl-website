import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Switch,
  makeStyles,
  ThemeProvider,
  Typography,
} from '@material-ui/core';

import AddCircleIcon from '@material-ui/icons/AddCircle';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import { arrayOf, func } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import theme from '../../../themes/theme';
import { product as productProp } from '../../../shared/prop-types';
import { ChplTextField } from '../../util';

const useStyles = makeStyles(() => ({
  buttonCard: {
    padding: '32px',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: '#f5f9fd',
    whiteSpace: 'pre-wrap',
    '&:focus': {
      boxShadow: '0px 0px 16px 4px #337ab750',
      fontWeight: '600',
    },
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
  name: yup.string()
    .required('Product Name is required'),
});

function ChplConfirmProduct(props) {
  /* eslint-disable react/destructuring-assignment */
  const product = {
    ...props.product,
  };
  const [selectedProduct, setSelectedProduct] = useState('');
  const products = props.products
    .sort((a, b) => (a.name < b.name ? -1 : 1));
  const [isCreating, setIsCreating] = useState(true);
  /* eslint-enable react/destructuring-assignment */

  useEffect(() => {
    const selected = props.products.filter((p) => p.productId === props.product.productId)[0];
    if (selected) {
      setSelectedProduct(selected);
    }
    setIsCreating(!props.product.productId || props.products.length === 0);
  }, [props.product, props.products]); // eslint-disable-line react/destructuring-assignment

  let formik;

  const handleCreationToggle = () => {
    if (isCreating) {
      props.dispatch('select', selectedProduct);
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
    setSelectedProduct(event.target.value);
  };

  const classes = useStyles();

  const submit = () => {
    props.dispatch('edit', {
      name: formik.values.name,
    });
  };

  formik = useFormik({
    initialValues: {
      name: product?.name || '',
    },
    onSubmit: () => {
      submit();
    },
    validationSchema,
  });

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <form noValidate>
          <div className={classes.developerConfirm}>
            <div className={classes.developerSubContainer}>
              <Button
                className={classes.buttonCard}
                variant="outlined"
                color="default"
                disabled
                fullWidth
              >
                <span className={classes.buttonContent}>
                  <AddCircleIcon color="primary" className={classes.extraLargeIcons}></AddCircleIcon>
                  Create a Product
                </span>
              </Button>
              <div className={classes.orContainer}>
                <Divider></Divider>
                <Typography>OR</Typography>
                <Divider ></Divider>
              </div>
              <div>
                {selectedProduct
                  ? (
                    <>
                      <Button
                        className={classes.buttonCard}
                        variant="outlined"
                        color="default"
                        fullWidth
                      >
                        <span className={classes.buttonContent}>
                          <CheckCircleIcon color="primary" className={classes.extraLargeIcons}>
                          </CheckCircleIcon>
                          Using {selectedProduct.name}
                        </span>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        className={classes.buttonCard}
                        variant="outlined"
                        color="default"
                        fullWidth
                      >
                        <span className={classes.buttonContent}>
                          <CheckCircleIcon color="primary" className={classes.extraLargeIcons}>
                          </CheckCircleIcon>
                         Choose a Product to Use
                        </span>
                      </Button>                    
                    </>
                  )}
              </div>
            </div>
            <Divider />
            {isCreating
              ? (
                <Card>
                  <CardHeader title="Creating A New Product"></CardHeader>
                  <CardContent>
                    <div className={classes.formContainer}>
                      <ChplTextField
                        id="name"
                        name="name"
                        label="Product Name"
                        value={formik.values.name}
                        error={formik.touched.name && !!formik.errors.name}
                        helperText={formik.touched.name && formik.errors.name}
                        onChange={handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </div>
                  </CardContent>
                </Card>
              )
              : (
                <Card>
                  <CardHeader title="Select An Existing Product"></CardHeader>
                  <CardContent>
                    <ChplTextField
                      select
                      id="selected-product"
                      name="selectedProduct"
                      label="Select a Product"
                      required
                      value={selectedProduct}
                      onChange={handleSelectOnChange}
                    >
                      {products.map((item) => (
                        <MenuItem value={item} key={item.productId}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </ChplTextField>
                  </CardContent>
                </Card>
              )}
          </div>
          <Switch
            id="create-toggle"
            name="createProduct"
            color="primary"
            disabled={products?.length === 0}
            checked={!isCreating}
            onChange={handleCreationToggle}
          />
        </form>
      </Container>
    </ThemeProvider>
  );
}

export default ChplConfirmProduct;

ChplConfirmProduct.propTypes = {
  product: productProp.isRequired,
  products: arrayOf(productProp).isRequired,
  dispatch: func.isRequired,
};
